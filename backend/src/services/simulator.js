import prisma from '../config/prisma.js';
import { systemConfig } from '../controllers/system.controller.js';

let simulatorInterval = null;

export const startTrafficSimulator = (io) => {
  if (simulatorInterval) {
    clearInterval(simulatorInterval);
  }

  console.log('Real-Time Traffic Simulator started.');

  // Run tick every 3 seconds (base rate)
  const runTick = async () => {
    try {
      const multiplier = systemConfig.simulationSpeedMultiplier || 1.0;
      const tickDuration = Math.round(3 / multiplier); // seconds simulated per tick

      // 1. Retrieve all intersections, signals, and roads
      const intersections = await prisma.intersection.findMany({
        include: {
          Signals: true,
          Roads: true,
        },
      });

      const updatedIntersections = [];

      for (const intersection of intersections) {
        if (intersection.status === 'OFFLINE') {
          // If offline, lights flash yellow or stay empty. Vehicle count stays static or creeps up.
          const signal = intersection.Signals[0];
          if (signal) {
            await prisma.signal.update({
              where: { id: signal.id },
              data: {
                activeState: 'YELLOW',
                timerSeconds: 0,
              },
            });
          }
          updatedIntersections.push(intersection);
          continue;
        }

        const signal = intersection.Signals[0];
        let nextState = signal?.activeState || 'RED';
        let nextTimer = (signal?.timerSeconds || 30) - tickDuration;
        let didChange = false;

        // Auto mode signal transitions
        if (signal && signal.mode === 'AUTO') {
          if (nextTimer <= 0) {
            didChange = true;
            if (signal.activeState === 'RED') {
              nextState = 'GREEN';
              nextTimer = signal.greenDuration;
            } else if (signal.activeState === 'GREEN') {
              nextState = 'YELLOW';
              nextTimer = signal.yellowDuration;
            } else {
              nextState = 'RED';
              nextTimer = signal.redDuration;
            }
          }

          // Update DB for the signal
          await prisma.signal.update({
            where: { id: signal.id },
            data: {
              activeState: nextState,
              timerSeconds: nextTimer,
              lastStateChange: didChange ? new Date() : signal.lastStateChange,
            },
          });
        } else if (signal && signal.mode === 'MANUAL') {
          // Manual timer count down just loops in place or stays high
          if (nextTimer < 0) nextTimer = 99;
          await prisma.signal.update({
            where: { id: signal.id },
            data: { timerSeconds: nextTimer },
          });
        }

        // 2. Modulate Congestion and Vehicles
        // Green light -> reduces vehicle queue
        // Red light -> builds vehicle queue
        let vehicleDelta = 0;
        if (nextState === 'GREEN') {
          // Emptying vehicles (speed up roads)
          vehicleDelta = -Math.floor(Math.random() * 6) - 2; // flow out
        } else if (nextState === 'RED') {
          // Blocking vehicles (stack up)
          vehicleDelta = Math.floor(Math.random() * 5) + 1; // incoming
        } else {
          // Yellow light - slows down slightly
          vehicleDelta = Math.floor(Math.random() * 2) - 1;
        }

        // If manual override (emergency wave), quickly drain congestion
        if (intersection.status === 'OVERRIDE' && nextState === 'GREEN') {
          vehicleDelta = -Math.floor(Math.random() * 12) - 6;
        }

        let newVehicleCount = Math.max(0, intersection.vehicleCount + vehicleDelta);
        // Cap vehicles at 150
        newVehicleCount = Math.min(150, newVehicleCount);

        // Map vehicle counts to a 0.0 - 1.0 congestion level
        const newCongestion = parseFloat((newVehicleCount / 120).toFixed(2));
        const cappedCongestion = Math.min(1.0, newCongestion);

        // Update intersection details
        const updatedIntersection = await prisma.intersection.update({
          where: { id: intersection.id },
          data: {
            vehicleCount: newVehicleCount,
            congestionLevel: cappedCongestion,
            lastUpdated: new Date(),
          },
          include: {
            Roads: true,
            Signals: true,
          },
        });

        // 3. Modulate connected road speeds based on congestion
        for (const road of intersection.Roads) {
          const maxSpeed = 60.0;
          let currentSpeed = maxSpeed - (cappedCongestion * 45.0) + (Math.random() * 6 - 3);
          currentSpeed = Math.max(5.0, Math.min(maxSpeed, currentSpeed));

          await prisma.road.update({
            where: { id: road.id },
            data: { currentSpeed: parseFloat(currentSpeed.toFixed(1)) },
          });
        }

        updatedIntersections.push(updatedIntersection);

        // 4. Periodically insert Traffic Flow logs (10% chance per tick to keep DB light)
        if (Math.random() < 0.15) {
          await prisma.trafficFlow.create({
            data: {
              intersectionId: intersection.id,
              vehicleCount: newVehicleCount,
              averageSpeed: 55.0 - (cappedCongestion * 40.0),
              occupancyRate: cappedCongestion * 100,
              densityLevel: cappedCongestion > 0.8 ? 'HIGH' : cappedCongestion > 0.4 ? 'MEDIUM' : 'LOW',
            },
          });
        }
      }

      // Broadcast new traffic ticks
      io.emit('traffic_tick', updatedIntersections);

      // 5. Random Alerts generator (e.g. 2% chance to trigger random incident)
      if (Math.random() < 0.02) {
        const activeIntersections = updatedIntersections.filter((x) => x.status === 'ACTIVE');
        if (activeIntersections.length > 0) {
          const target = activeIntersections[Math.floor(Math.random() * activeIntersections.length)];
          const incidentTypes = ['ACCIDENT', 'CONGESTION', 'SIGNAL_FAILURE'];
          const selectedType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];

          let severity = 'MEDIUM';
          let msg = '';

          if (selectedType === 'ACCIDENT') {
            severity = Math.random() > 0.6 ? 'HIGH' : 'MEDIUM';
            msg = `Collision alert: Multi-vehicle lane blockage reported on ${target.name}. Response units dispatched.`;
          } else if (selectedType === 'CONGESTION') {
            severity = 'HIGH';
            msg = `Peak volume warning: Severe congestion spillback detected at ${target.name}.`;
          } else {
            severity = 'CRITICAL';
            msg = `Hardware fault: IoT controller failure at ${target.name}. Local signal unit degraded.`;

            // Change intersection to offline
            await prisma.intersection.update({
              where: { id: target.id },
              data: { status: 'OFFLINE' },
            });
          }

          const newAlert = await prisma.alert.create({
            data: {
              intersectionId: target.id,
              type: selectedType,
              severity,
              message: msg,
            },
            include: {
              intersection: { select: { name: true } },
            },
          });

          io.emit('alert_new', newAlert);
          io.emit('new_activity', {
            type: 'ALERT_NEW',
            message: `New Incident Alert: ${selectedType} at ${target.name}`,
            timestamp: new Date(),
          });
        }
      }
    } catch (error) {
      console.error('Simulator error during loop:', error);
    }
  };

  // Run the tick immediately and set interval
  runTick();
  simulatorInterval = setInterval(runTick, 3000);
};

export const stopTrafficSimulator = () => {
  if (simulatorInterval) {
    clearInterval(simulatorInterval);
    simulatorInterval = null;
    console.log('Traffic Simulator stopped.');
  }
};

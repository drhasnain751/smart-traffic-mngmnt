import prisma from '../config/prisma.js';

export const getIntersections = async (req, res) => {
  try {
    const intersections = await prisma.intersection.findMany({
      include: {
        Roads: true,
        Signals: true,
      },
    });
    res.json(intersections);
  } catch (error) {
    console.error('Error fetching intersections:', error);
    res.status(500).json({ error: 'Failed to retrieve intersections' });
  }
};

export const getIntersectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const intersection = await prisma.intersection.findUnique({
      where: { id },
      include: {
        Roads: true,
        Signals: true,
        TrafficFlows: {
          orderBy: { timestamp: 'desc' },
          take: 20,
        },
        Alerts: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!intersection) {
      return res.status(404).json({ error: 'Intersection not found' });
    }

    res.json(intersection);
  } catch (error) {
    console.error('Error fetching intersection details:', error);
    res.status(500).json({ error: 'Failed to retrieve intersection details' });
  }
};

export const updateSignalState = async (req, res) => {
  try {
    const { id } = req.params; // intersection ID
    const { activeState, mode } = req.body; // e.g. RED, YELLOW, GREEN and AUTO, MANUAL

    const signal = await prisma.signal.findFirst({
      where: { intersectionId: id },
    });

    if (!signal) {
      return res.status(404).json({ error: 'Signal system not found for this intersection' });
    }

    const updatedSignal = await prisma.signal.update({
      where: { id: signal.id },
      data: {
        activeState: activeState || signal.activeState,
        mode: mode || signal.mode,
        timerSeconds: activeState ? 10 : signal.timerSeconds, // set short transition countdown or keep
        lastStateChange: new Date(),
      },
    });

    // Also update intersection status
    const status = mode === 'MANUAL' ? 'OVERRIDE' : 'ACTIVE';
    const updatedIntersection = await prisma.intersection.update({
      where: { id },
      data: { status, lastUpdated: new Date() },
      include: { Roads: true, Signals: true },
    });

    // Socket.io emission
    const io = req.app.get('io');
    if (io) {
      io.emit('intersection_updated', updatedIntersection);
      io.emit('new_activity', {
        type: 'SIGNAL_CONTROL',
        message: `Signal status updated at ${updatedIntersection.name} to ${updatedSignal.activeState} (${updatedSignal.mode})`,
        timestamp: new Date(),
      });
    }

    // Log Activity
    if (req.user) {
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          action: 'SIGNAL_OVERRIDE',
          description: `Changed signal ${updatedIntersection.name} state to ${updatedSignal.activeState} in ${updatedSignal.mode} mode`,
        },
      });
    }

    res.json({ intersection: updatedIntersection, signal: updatedSignal });
  } catch (error) {
    console.error('Error updating signal state:', error);
    res.status(500).json({ error: 'Failed to update signal system' });
  }
};

export const triggerEmergencyOverride = async (req, res) => {
  try {
    const { id } = req.params;

    const intersection = await prisma.intersection.findUnique({
      where: { id },
      include: { Signals: true },
    });

    if (!intersection) {
      return res.status(404).json({ error: 'Intersection not found' });
    }

    // Set green wave on major lane, red on rest, mode to MANUAL
    const signal = intersection.Signals[0];
    const updatedSignal = await prisma.signal.update({
      where: { id: signal.id },
      data: {
        mode: 'MANUAL',
        activeState: 'GREEN',
        timerSeconds: 999, // infinite green until reset
        lastStateChange: new Date(),
      },
    });

    const updatedIntersection = await prisma.intersection.update({
      where: { id },
      data: {
        status: 'OVERRIDE',
        congestionLevel: 0.1, // Clear queue simulation
        vehicleCount: Math.floor(intersection.vehicleCount * 0.3),
        lastUpdated: new Date(),
      },
      include: { Roads: true, Signals: true },
    });

    // Trigger an alert
    const newAlert = await prisma.alert.create({
      data: {
        intersectionId: id,
        type: 'EMERGENCY_OVERRIDE',
        severity: 'HIGH',
        message: `EMERGENCY DISPATCH GREEN WAVE active at ${intersection.name}. All cross traffic held.`,
      },
    });

    // Socket.io emit
    const io = req.app.get('io');
    if (io) {
      io.emit('intersection_updated', updatedIntersection);
      io.emit('alert_new', { ...newAlert, intersectionName: intersection.name });
      io.emit('new_activity', {
        type: 'EMERGENCY_OVERRIDE',
        message: `Emergency override activated at ${intersection.name}`,
        timestamp: new Date(),
      });
    }

    // Log Activity
    if (req.user) {
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          action: 'EMERGENCY_OVERRIDE',
          description: `Triggered emergency green wave at ${intersection.name}`,
        },
      });
    }

    res.json({ intersection: updatedIntersection, signal: updatedSignal, alert: newAlert });
  } catch (error) {
    console.error('Error triggering emergency override:', error);
    res.status(500).json({ error: 'Failed to trigger emergency override' });
  }
};

export const resetToAuto = async (req, res) => {
  try {
    const { id } = req.params;

    const intersection = await prisma.intersection.findUnique({
      where: { id },
      include: { Signals: true },
    });

    if (!intersection) {
      return res.status(404).json({ error: 'Intersection not found' });
    }

    const signal = intersection.Signals[0];
    const updatedSignal = await prisma.signal.update({
      where: { id: signal.id },
      data: {
        mode: 'AUTO',
        activeState: 'RED',
        timerSeconds: 30,
        lastStateChange: new Date(),
      },
    });

    const updatedIntersection = await prisma.intersection.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        lastUpdated: new Date(),
      },
      include: { Roads: true, Signals: true },
    });

    // Resolve any active emergency override alert for this intersection
    await prisma.alert.updateMany({
      where: {
        intersectionId: id,
        type: 'EMERGENCY_OVERRIDE',
        status: 'ACTIVE',
      },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });

    // Socket.io emit
    const io = req.app.get('io');
    if (io) {
      io.emit('intersection_updated', updatedIntersection);
      io.emit('alerts_refreshed');
      io.emit('new_activity', {
        type: 'SYSTEM',
        message: `Restored automatic signal pattern control at ${intersection.name}`,
        timestamp: new Date(),
      });
    }

    // Log Activity
    if (req.user) {
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          action: 'RESET_AUTO',
          description: `Restored automatic operations at ${intersection.name}`,
        },
      });
    }

    res.json({ intersection: updatedIntersection, signal: updatedSignal });
  } catch (error) {
    console.error('Error resetting signal mode:', error);
    res.status(500).json({ error: 'Failed to reset signal mode' });
  }
};

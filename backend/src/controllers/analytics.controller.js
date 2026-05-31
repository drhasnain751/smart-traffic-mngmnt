import prisma from '../config/prisma.js';

export const getTrends = async (req, res) => {
  try {
    // Generate simulated historical trends for a premium chart
    // Return a 7-day volume and speed aggregation
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const data = days.map((day, idx) => {
      // Create rush-hour profile (simulated average)
      const baseCount = 5000 + Math.floor(Math.random() * 2000);
      const isWeekend = idx >= 5;
      const volumeMultiplier = isWeekend ? 0.7 : 1.0;
      
      return {
        day,
        volume: Math.floor(baseCount * volumeMultiplier),
        avgSpeed: isWeekend ? 58.5 : 44.2 + (Math.random() * 5),
        congestionIdx: isWeekend ? 0.28 : 0.62 + (Math.random() * 0.1 - 0.05),
      };
    });

    res.json(data);
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ error: 'Failed to retrieve trends data' });
  }
};

export const getForecast = async (req, res) => {
  try {
    // Generate a 24-hour congestion density projection
    const forecast = [];
    for (let hour = 0; hour < 24; hour++) {
      let baseCongestion = 0.15;
      
      // Morning rush hour: 7am - 9am
      if (hour >= 7 && hour <= 9) {
        baseCongestion = 0.72 + (Math.random() * 0.15);
      }
      // Evening rush hour: 4pm - 7pm (16h - 19h)
      else if (hour >= 16 && hour <= 19) {
        baseCongestion = 0.85 + (Math.random() * 0.1);
      }
      // Lunch transit: 12pm - 1pm
      else if (hour === 12 || hour === 13) {
        baseCongestion = 0.48 + (Math.random() * 0.1);
      }
      // Night: 10pm - 5am
      else if (hour >= 22 || hour <= 5) {
        baseCongestion = 0.08 + (Math.random() * 0.05);
      }
      // Standard daytime
      else {
        baseCongestion = 0.35 + (Math.random() * 0.1);
      }

      forecast.push({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        predictedCongestion: parseFloat(baseCongestion.toFixed(2)),
        historicalCongestion: parseFloat((baseCongestion * 0.95 + (Math.random() * 0.08 - 0.04)).toFixed(2)),
      });
    }

    res.json(forecast);
  } catch (error) {
    console.error('Error fetching forecasts:', error);
    res.status(500).json({ error: 'Failed to retrieve analytics forecast' });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    // Generate advanced AI suggestions based on active database states
    const intersections = await prisma.intersection.findMany({
      include: { Signals: true },
    });

    const recommendations = [];

    // Check high congestion levels and suggest optimizations
    intersections.forEach((item) => {
      const signal = item.Signals[0];
      if (item.congestionLevel > 0.75 && item.status !== 'OFFLINE') {
        recommendations.push({
          id: `rec-${item.id}-congest`,
          title: `Optimize Green Phase Offset`,
          intersectionName: item.name,
          intersectionId: item.id,
          priority: item.congestionLevel > 0.9 ? 'CRITICAL' : 'HIGH',
          message: `Heavy vehicle queue of ${item.vehicleCount} detected. Recommend extending the green light phase for major approach by ${Math.floor(item.congestionLevel * 20)} seconds.`,
          actionable: true,
          suggestedState: {
            greenDuration: (signal?.greenDuration || 35) + 15,
            redDuration: Math.max((signal?.redDuration || 30) - 10, 20),
          },
        });
      }
    });

    // Add static AI analytics insights if list is small
    if (recommendations.length === 0) {
      recommendations.push({
        id: 'rec-static-1',
        title: 'Calibrate Off-Peak Synchronization',
        intersectionName: 'Broadway Grid System',
        priority: 'LOW',
        message: 'System models indicate a 4.2% carbon emission reduction by introducing a 5-second offset delay on northbound links between 23:00 and 05:00.',
        actionable: false,
      });
    }

    // Always include a system recommendation for predictive maintenance
    recommendations.push({
      id: 'rec-sys-maintain',
      title: 'Recalibrate Flashing Cycle',
      intersectionName: 'Hudson St & Canal St',
      priority: 'MEDIUM',
      message: 'Controller has been flashing red (offline) for > 4 hours. Automated diagnosis suggests an internal loop logic reset is needed.',
      actionable: false,
    });

    res.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to retrieve recommendations' });
  }
};

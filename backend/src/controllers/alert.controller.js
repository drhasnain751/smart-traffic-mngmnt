import prisma from '../config/prisma.js';

export const getAlerts = async (req, res) => {
  try {
    const { status, severity } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (severity) filters.severity = severity;

    const alerts = await prisma.alert.findMany({
      where: filters,
      include: {
        intersection: {
          select: { name: true, latitude: true, longitude: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to retrieve alerts' });
  }
};

export const resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const alert = await prisma.alert.findUnique({
      where: { id },
      include: { intersection: true },
    });

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    const updatedAlert = await prisma.alert.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });

    // Emits via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.emit('alert_resolved', updatedAlert);
      io.emit('new_activity', {
        type: 'ALERT_RESOLVE',
        message: `Alert resolved: ${alert.type} at ${alert.intersection.name}`,
        timestamp: new Date(),
      });
    }

    // Log Activity
    if (req.user) {
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          action: 'RESOLVE_ALERT',
          description: `Resolved ${alert.type} alert at ${alert.intersection.name}`,
        },
      });
    }

    res.json(updatedAlert);
  } catch (error) {
    console.error('Error resolving alert:', error);
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
};

export const createAlert = async (req, res) => {
  try {
    const { intersectionId, type, severity, message } = req.body;

    if (!intersectionId || !type || !severity || !message) {
      return res.status(400).json({ error: 'Missing required alert fields' });
    }

    const intersection = await prisma.intersection.findUnique({
      where: { id: intersectionId },
    });

    if (!intersection) {
      return res.status(404).json({ error: 'Intersection not found' });
    }

    const alert = await prisma.alert.create({
      data: {
        intersectionId,
        type,
        severity,
        message,
      },
      include: {
        intersection: {
          select: { name: true },
        },
      },
    });

    // Notify clients
    const io = req.app.get('io');
    if (io) {
      io.emit('alert_new', alert);
      io.emit('new_activity', {
        type: 'ALERT_NEW',
        message: `New ${severity} alert: ${type} at ${intersection.name}`,
        timestamp: new Date(),
      });
    }

    // Log Activity
    if (req.user) {
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          action: 'CREATE_ALERT',
          description: `Created custom alert of type ${type} at ${intersection.name}`,
        },
      });
    }

    res.status(201).json(alert);
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
};

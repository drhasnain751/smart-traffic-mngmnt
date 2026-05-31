// In-memory system settings storage for simulation controls
export let systemConfig = {
  simulationSpeedMultiplier: 1.0,
  congestionAlertThreshold: 0.8,
  autoResolutionMinutes: 5,
  emergencyPriorityProtocol: "GREEN_WAVE",
  notificationChannels: {
    email: true,
    sms: false,
    dashboardPush: true
  }
};

export const getSettings = (req, res) => {
  try {
    res.json(systemConfig);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve system settings' });
  }
};

export const updateSettings = (req, res) => {
  try {
    const { simulationSpeedMultiplier, congestionAlertThreshold, autoResolutionMinutes, emergencyPriorityProtocol, notificationChannels } = req.body;

    if (simulationSpeedMultiplier !== undefined) {
      systemConfig.simulationSpeedMultiplier = Math.max(0.1, Math.min(10, Number(simulationSpeedMultiplier)));
    }
    if (congestionAlertThreshold !== undefined) {
      systemConfig.congestionAlertThreshold = Math.max(0.1, Math.min(1.0, Number(congestionAlertThreshold)));
    }
    if (autoResolutionMinutes !== undefined) {
      systemConfig.autoResolutionMinutes = Math.max(1, Number(autoResolutionMinutes));
    }
    if (emergencyPriorityProtocol !== undefined) {
      systemConfig.emergencyPriorityProtocol = emergencyPriorityProtocol;
    }
    if (notificationChannels !== undefined) {
      systemConfig.notificationChannels = {
        ...systemConfig.notificationChannels,
        ...notificationChannels
      };
    }

    // Broadcast updated settings to the simulation and frontend
    const io = req.app.get('io');
    if (io) {
      io.emit('settings_updated', systemConfig);
      io.emit('new_activity', {
        type: 'SYSTEM',
        message: `System operational parameters updated by admin`,
        timestamp: new Date(),
      });
    }

    res.json(systemConfig);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update system settings' });
  }
};

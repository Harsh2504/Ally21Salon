const Settings = require('../models/Settings');

// Get all settings or settings by category
const getSettings = async (req, res) => {
  try {
    const { category } = req.query;
    const userId = req.user._id;

    let query = {};
    
    if (category) {
      query.category = category;
    }

    // Get both global and user-specific settings
    const globalSettings = await Settings.find({
      ...query,
      isUserSpecific: false
    }).populate('updatedBy', 'firstName lastName');

    const userSettings = await Settings.find({
      ...query,
      isUserSpecific: true,
      userId: userId
    }).populate('updatedBy', 'firstName lastName');

    // Combine settings, with user settings overriding global ones
    const settingsMap = new Map();
    
    globalSettings.forEach(setting => {
      settingsMap.set(`${setting.category}_${setting.key}`, setting);
    });
    
    userSettings.forEach(setting => {
      settingsMap.set(`${setting.category}_${setting.key}`, setting);
    });

    const settings = Array.from(settingsMap.values());

    res.json({
      settings,
      total: settings.length
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

// Get settings by category
const getSettingsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const userId = req.user._id;

    const globalSettings = await Settings.find({
      category,
      isUserSpecific: false
    }).populate('updatedBy', 'firstName lastName');

    const userSettings = await Settings.find({
      category,
      isUserSpecific: true,
      userId: userId
    }).populate('updatedBy', 'firstName lastName');

    // Combine and organize settings
    const settingsMap = new Map();
    
    globalSettings.forEach(setting => {
      settingsMap.set(setting.key, setting);
    });
    
    userSettings.forEach(setting => {
      settingsMap.set(setting.key, setting);
    });

    const settings = Array.from(settingsMap.values());

    res.json({
      category,
      settings,
      total: settings.length
    });
  } catch (error) {
    console.error('Error fetching settings by category:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

// Update a setting
const updateSetting = async (req, res) => {
  try {
    const { key, value, category } = req.body;
    const userId = req.user._id;

    // Check if setting exists
    let setting = await Settings.findOne({ key, category });
    
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    // If it's a user-specific setting, create or update user's copy
    if (setting.isUserSpecific) {
      let userSetting = await Settings.findOne({ key, category, userId });
      
      if (userSetting) {
        userSetting.value = value;
        userSetting.updatedBy = userId;
        await userSetting.save();
        setting = userSetting;
      } else {
        // Create user-specific copy
        setting = new Settings({
          ...setting.toObject(),
          _id: undefined,
          value,
          userId,
          updatedBy: userId
        });
        await setting.save();
      }
    } else {
      // Update global setting (only managers can do this)
      if (req.user.role !== 'manager') {
        return res.status(403).json({ error: 'Only managers can update global settings' });
      }
      
      setting.value = value;
      setting.updatedBy = userId;
      await setting.save();
    }

    await setting.populate('updatedBy', 'firstName lastName');

    res.json({
      message: 'Setting updated successfully',
      setting
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
};

// Bulk update settings
const bulkUpdateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(settings)) {
      return res.status(400).json({ error: 'Settings must be an array' });
    }

    const updatedSettings = [];
    const errors_list = [];

    for (const settingData of settings) {
      try {
        const { key, value, category } = settingData;
        
        let setting = await Settings.findOne({ key, category });
        
        if (!setting) {
          errors_list.push(`Setting ${key} in category ${category} not found`);
          continue;
        }

        if (setting.isUserSpecific) {
          let userSetting = await Settings.findOne({ key, category, userId });
          
          if (userSetting) {
            userSetting.value = value;
            userSetting.updatedBy = userId;
            await userSetting.save();
            updatedSettings.push(userSetting);
          } else {
            const newUserSetting = new Settings({
              ...setting.toObject(),
              _id: undefined,
              value,
              userId,
              updatedBy: userId
            });
            await newUserSetting.save();
            updatedSettings.push(newUserSetting);
          }
        } else {
          if (req.user.role !== 'manager') {
            errors_list.push(`Only managers can update global setting: ${key}`);
            continue;
          }
          
          setting.value = value;
          setting.updatedBy = userId;
          await setting.save();
          updatedSettings.push(setting);
        }
      } catch (error) {
        errors_list.push(`Error updating ${settingData.key}: ${error.message}`);
      }
    }

    res.json({
      message: `Updated ${updatedSettings.length} settings`,
      updatedSettings,
      errors: errors_list
    });
  } catch (error) {
    console.error('Error bulk updating settings:', error);
    res.status(500).json({ error: 'Failed to bulk update settings' });
  }
};

// Reset settings to default
const resetSettings = async (req, res) => {
  try {
    const { category } = req.params;
    const userId = req.user._id;

    if (req.user.role !== 'manager') {
      // Employees can only reset their user-specific settings
      await Settings.deleteMany({
        category,
        isUserSpecific: true,
        userId
      });
    } else {
      // Managers can reset global settings
      await Settings.deleteMany({
        category,
        isUserSpecific: false
      });

      // Re-initialize default settings for this category
      const defaultSettings = Settings.getDefaultSettings()
        .filter(setting => setting.category === category)
        .map(setting => ({
          ...setting,
          updatedBy: userId
        }));

      await Settings.insertMany(defaultSettings);
    }

    res.json({
      message: `Settings for ${category} have been reset to defaults`
    });
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({ error: 'Failed to reset settings' });
  }
};

// Initialize default settings (run once during setup)
const initializeSettings = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if settings already exist
    const existingCount = await Settings.countDocuments();
    if (existingCount > 0) {
      return res.status(400).json({ error: 'Settings already initialized' });
    }

    const defaultSettings = Settings.getDefaultSettings()
      .map(setting => ({
        ...setting,
        updatedBy: userId
      }));

    await Settings.insertMany(defaultSettings);

    res.json({
      message: 'Default settings initialized successfully',
      count: defaultSettings.length
    });
  } catch (error) {
    console.error('Error initializing settings:', error);
    res.status(500).json({ error: 'Failed to initialize settings' });
  }
};

// Export settings as JSON
const exportSettings = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    
    if (category) {
      query.category = category;
    }

    if (req.user.role !== 'manager') {
      query.isUserSpecific = true;
      query.userId = req.user._id;
    }

    const settings = await Settings.find(query);

    res.json({
      exportDate: new Date().toISOString(),
      settings: settings.map(setting => ({
        category: setting.category,
        key: setting.key,
        value: setting.value,
        label: setting.label,
        type: setting.type
      }))
    });
  } catch (error) {
    console.error('Error exporting settings:', error);
    res.status(500).json({ error: 'Failed to export settings' });
  }
};

module.exports = {
  getSettings,
  getSettingsByCategory,
  updateSetting,
  bulkUpdateSettings,
  resetSettings,
  initializeSettings,
  exportSettings
};
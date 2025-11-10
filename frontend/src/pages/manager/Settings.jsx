import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, Save, RotateCcw, Download, Upload,
  Building, Bell, Calendar, CreditCard, Shield, Link
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';

const ManagerSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);

  const categories = [
    { key: 'general', label: 'General', icon: Building, color: 'blue' },
    { key: 'notifications', label: 'Notifications', icon: Bell, color: 'yellow' },
    { key: 'scheduling', label: 'Scheduling', icon: Calendar, color: 'green' },
    { key: 'payments', label: 'Payments', icon: CreditCard, color: 'purple' },
    { key: 'security', label: 'Security', icon: Shield, color: 'red' },
    { key: 'integrations', label: 'Integrations', icon: Link, color: 'gray' }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings');
      
      // Organize settings by category
      const organizedSettings = {};
      response.data.settings.forEach(setting => {
        if (!organizedSettings[setting.category]) {
          organizedSettings[setting.category] = {};
        }
        organizedSettings[setting.category][setting.key] = setting;
      });
      
      setSettings(organizedSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: {
          ...prev[category][key],
          value
        }
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async (category = null) => {
    setSaving(true);
    try {
      const categoriesToSave = category ? [category] : Object.keys(settings);
      const settingsToUpdate = [];

      categoriesToSave.forEach(cat => {
        if (settings[cat]) {
          Object.values(settings[cat]).forEach(setting => {
            settingsToUpdate.push({
              category: setting.category,
              key: setting.key,
              value: setting.value
            });
          });
        }
      });

      await api.put('/settings/bulk', { settings: settingsToUpdate });
      
      toast.success(category ? 
        `${category} settings saved successfully` : 
        'All settings saved successfully'
      );
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async (category) => {
    if (!confirm(`Are you sure you want to reset ${category} settings to defaults?`)) {
      return;
    }

    try {
      await api.delete(`/settings/reset/${category}`);
      toast.success(`${category} settings reset to defaults`);
      await fetchSettings();
      setHasChanges(false);
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast.error('Failed to reset settings');
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/settings/export');
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `salon-settings-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('Settings exported successfully');
    } catch (error) {
      console.error('Error exporting settings:', error);
      toast.error('Failed to export settings');
    }
  };

  const renderSettingInput = (setting) => {
    const { key, value, label, description, type, options, validation } = setting;

    switch (type) {
      case 'boolean':
        return (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{label}</Label>
              {description && <p className="text-sm text-gray-600">{description}</p>}
            </div>
            <Switch
              checked={value}
              onCheckedChange={(checked) => updateSetting(setting.category, key, checked)}
            />
          </div>
        );

      case 'string':
        if (options && options.length > 0) {
          return (
            <div className="space-y-2">
              <Label>{label}</Label>
              {description && <p className="text-sm text-gray-600">{description}</p>}
              <Select 
                value={value} 
                onValueChange={(val) => updateSetting(setting.category, key, val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }
        
        if (description && description.length > 50) {
          return (
            <div className="space-y-2">
              <Label>{label}</Label>
              {description && <p className="text-sm text-gray-600">{description}</p>}
              <Textarea
                value={value}
                onChange={(e) => updateSetting(setting.category, key, e.target.value)}
                placeholder={label}
              />
            </div>
          );
        }

        return (
          <div className="space-y-2">
            <Label>{label}</Label>
            {description && <p className="text-sm text-gray-600">{description}</p>}
            <Input
              value={value}
              onChange={(e) => updateSetting(setting.category, key, e.target.value)}
              placeholder={label}
              required={validation?.required}
            />
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <Label>{label}</Label>
            {description && <p className="text-sm text-gray-600">{description}</p>}
            <Input
              type="number"
              value={value}
              onChange={(e) => updateSetting(setting.category, key, parseFloat(e.target.value))}
              min={validation?.min}
              max={validation?.max}
              required={validation?.required}
            />
          </div>
        );

      case 'array':
        if (options) {
          return (
            <div className="space-y-2">
              <Label>{label}</Label>
              {description && <p className="text-sm text-gray-600">{description}</p>}
              <div className="space-y-2">
                {options.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Switch
                      checked={value.includes(option.value)}
                      onCheckedChange={(checked) => {
                        const newValue = checked 
                          ? [...value, option.value]
                          : value.filter(v => v !== option.value);
                        updateSetting(setting.category, key, newValue);
                      }}
                    />
                    <Label>{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        break;

      case 'object':
        if (key === 'working_hours') {
          const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
          return (
            <div className="space-y-4">
              <Label>{label}</Label>
              {description && <p className="text-sm text-gray-600">{description}</p>}
              <div className="space-y-3">
                {days.map(day => (
                  <div key={day} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-24">
                      <Label className="capitalize">{day}</Label>
                    </div>
                    <Switch
                      checked={value[day]?.enabled || false}
                      onCheckedChange={(enabled) => {
                        updateSetting(setting.category, key, {
                          ...value,
                          [day]: { ...value[day], enabled }
                        });
                      }}
                    />
                    {value[day]?.enabled && (
                      <>
                        <Input
                          type="time"
                          value={value[day]?.open || '09:00'}
                          onChange={(e) => {
                            updateSetting(setting.category, key, {
                              ...value,
                              [day]: { ...value[day], open: e.target.value }
                            });
                          }}
                          className="w-32"
                        />
                        <span>to</span>
                        <Input
                          type="time"
                          value={value[day]?.close || '17:00'}
                          onChange={(e) => {
                            updateSetting(setting.category, key, {
                              ...value,
                              [day]: { ...value[day], close: e.target.value }
                            });
                          }}
                          className="w-32"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }
        break;

      default:
        return (
          <div className="space-y-2">
            <Label>{label}</Label>
            {description && <p className="text-sm text-gray-600">{description}</p>}
            <Input value={JSON.stringify(value)} disabled />
          </div>
        );
    }
  };

  const renderCategoryTab = (category) => {
    const categorySettings = settings[category.key] || {};
    const Icon = category.icon;

    return (
      <TabsContent key={category.key} value={category.key} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-semibold">{category.label} Settings</h2>
              <p className="text-gray-600">Configure {category.label.toLowerCase()} preferences</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleReset(category.key)}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={() => handleSave(category.key)} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              Save {category.label}
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {Object.values(categorySettings).map((setting) => (
                <div key={setting.key} className="space-y-2">
                  {renderSettingInput(setting)}
                </div>
              ))}
              
              {Object.keys(categorySettings).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-8 w-8 mx-auto mb-2" />
                  <p>No settings available for this category</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage salon configuration and preferences</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {hasChanges && (
            <Button onClick={() => handleSave()} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save All'}
            </Button>
          )}
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger key={category.key} value={category.key} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map(renderCategoryTab)}
      </Tabs>

      {/* Changes Warning */}
      {hasChanges && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  Unsaved Changes
                </Badge>
                <p className="text-sm text-yellow-700">
                  You have unsaved changes. Make sure to save before leaving.
                </p>
              </div>
              <Button size="sm" onClick={() => handleSave()}>
                Save All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManagerSettings;
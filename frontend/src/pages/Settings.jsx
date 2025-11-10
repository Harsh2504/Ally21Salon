import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon, Bell, Shield, Clock, 
  Save, Eye, EyeOff, Smartphone, Mail, AlertCircle,
  Globe, Moon, Sun, Palette, Monitor, Check
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      types: {
        announcements: true,
        reminders: true,
        bookings: true,
        alerts: true,
      }
    },
    privacy: {
      profileVisibility: 'team',
      showEmail: false,
      showPhone: false,
    },
    appearance: {
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
    },
    schedule: {
      workingHours: {
        start: '09:00',
        end: '17:00',
      },
      breakDuration: 60,
      autoClockOut: false,
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings');
      if (response.data.settings) {
        setSettings(response.data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Continue with default settings if fetch fails
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async () => {
    try {
      setSaving(true);
      await api.put('/settings', settings);
      toast.success('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const updateNestedSetting = (section, subsection, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [key]: value
        }
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and application settings</p>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notification Channels */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Notification Channels</h4>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-xs text-gray-500">Receive notifications via email</p>
                </div>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.notifications?.email || false}
                onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-4 w-4 text-gray-500" />
                <div>
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-xs text-gray-500">Receive browser push notifications</p>
                </div>
              </div>
              <Switch
                id="push-notifications"
                checked={settings.notifications?.push || false}
                onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-4 w-4 text-gray-500" />
                <div>
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <p className="text-xs text-gray-500">Receive notifications via SMS</p>
                </div>
              </div>
              <Switch
                id="sms-notifications"
                checked={settings.notifications?.sms || false}
                onCheckedChange={(checked) => updateSetting('notifications', 'sms', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Notification Types */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Notification Types</h4>
            
            {Object.entries(settings.notifications?.types || {}).map(([type, enabled]) => (
              <div key={type} className="flex items-center justify-between">
                <div>
                  <Label htmlFor={`${type}-notifications`} className="capitalize">
                    {type}
                  </Label>
                  <p className="text-xs text-gray-500">
                    {type === 'announcements' && 'Company-wide announcements and updates'}
                    {type === 'reminders' && 'Schedule and task reminders'}
                    {type === 'bookings' && 'Booking confirmations and updates'}
                    {type === 'alerts' && 'Important alerts and warnings'}
                  </p>
                </div>
                <Switch
                  id={`${type}-notifications`}
                  checked={enabled}
                  onCheckedChange={(checked) => updateNestedSetting('notifications', 'types', type, checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
          <CardDescription>
            Control your privacy and data sharing preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="profile-visibility">Profile Visibility</Label>
              <select
                id="profile-visibility"
                value={settings.privacy?.profileVisibility || 'team'}
                onChange={(e) => updateSetting('privacy', 'profileVisibility', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="public">Public</option>
                <option value="team">Team Only</option>
                <option value="private">Private</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Who can see your profile information</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-email">Show Email Address</Label>
                <p className="text-xs text-gray-500">Allow others to see your email address</p>
              </div>
              <Switch
                id="show-email"
                checked={settings.privacy?.showEmail || false}
                onCheckedChange={(checked) => updateSetting('privacy', 'showEmail', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-phone">Show Phone Number</Label>
                <p className="text-xs text-gray-500">Allow others to see your phone number</p>
              </div>
              <Switch
                id="show-phone"
                checked={settings.privacy?.showPhone || false}
                onCheckedChange={(checked) => updateSetting('privacy', 'showPhone', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <div className="mt-2 flex space-x-4">
                {[
                  { value: 'light', icon: Sun, label: 'Light' },
                  { value: 'dark', icon: Moon, label: 'Dark' },
                  { value: 'system', icon: Monitor, label: 'System' }
                ].map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => updateSetting('appearance', 'theme', value)}
                    className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                      settings.appearance?.theme === value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mb-2" />
                    <span className="text-sm">{label}</span>
                    {settings.appearance?.theme === value && (
                      <Check className="h-4 w-4 text-blue-500 mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="language">Language</Label>
              <select
                id="language"
                value={settings.appearance?.language || 'en'}
                onChange={(e) => updateSetting('appearance', 'language', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <select
                id="timezone"
                value={settings.appearance?.timezone || 'UTC'}
                onChange={(e) => updateSetting('appearance', 'timezone', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Settings (Employee Only) */}
      {user?.role === 'Employee' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Schedule Preferences
            </CardTitle>
            <CardDescription>
              Configure your work schedule and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="work-start">Work Start Time</Label>
                <Input
                  id="work-start"
                  type="time"
                  value={settings.schedule?.workingHours?.start || '09:00'}
                  onChange={(e) => updateNestedSetting('schedule', 'workingHours', 'start', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="work-end">Work End Time</Label>
                <Input
                  id="work-end"
                  type="time"
                  value={settings.schedule?.workingHours?.end || '17:00'}
                  onChange={(e) => updateNestedSetting('schedule', 'workingHours', 'end', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="break-duration">Default Break Duration (minutes)</Label>
              <Input
                id="break-duration"
                type="number"
                min="15"
                max="180"
                value={settings.schedule?.breakDuration || 60}
                onChange={(e) => updateSetting('schedule', 'breakDuration', parseInt(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-clock-out">Auto Clock Out</Label>
                <p className="text-xs text-gray-500">Automatically clock out at end of shift</p>
              </div>
              <Switch
                id="auto-clock-out"
                checked={settings.schedule?.autoClockOut || false}
                onCheckedChange={(checked) => updateSetting('schedule', 'autoClockOut', checked)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={updateSettings} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, Bell, Shield, Settings, Save, RotateCcw,
  Lock, Mail, Smartphone, Clock, Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const EmployeeSettings = () => {
  const { user, updateUser } = useAuth();
  const [settings, setSettings] = useState({});
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    emergencyContact: user?.emergencyContact || ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('profile');
  const [hasChanges, setHasChanges] = useState(false);

  const categories = [
    { key: 'profile', label: 'Profile', icon: User, color: 'blue' },
    { key: 'notifications', label: 'Notifications', icon: Bell, color: 'yellow' },
    { key: 'security', label: 'Security', icon: Shield, color: 'red' },
    { key: 'preferences', label: 'Preferences', icon: Settings, color: 'gray' }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings');
      
      // Organize user-specific settings
      const organizedSettings = {};
      response.data.settings.forEach(setting => {
        if (setting.isUserSpecific || setting.category === 'notifications') {
          if (!organizedSettings[setting.category]) {
            organizedSettings[setting.category] = {};
          }
          organizedSettings[setting.category][setting.key] = setting;
        }
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
          ...prev[category]?.[key],
          value
        }
      }
    }));
    setHasChanges(true);
  };

  const updateProfile = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await api.put('/users/profile', profile);
      updateUser(response.data.user);
      toast.success('Profile updated successfully');
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async (category = null) => {
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

      if (settingsToUpdate.length > 0) {
        await api.put('/settings/bulk', { settings: settingsToUpdate });
        toast.success(category ? 
          `${category} settings saved successfully` : 
          'Settings saved successfully'
        );
      }
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = async (category) => {
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

  const renderProfileTab = () => (
    <TabsContent value="profile" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User className="h-6 w-6" />
          <div>
            <h2 className="text-xl font-semibold">Profile Settings</h2>
            <p className="text-gray-600">Update your personal information</p>
          </div>
        </div>
        <Button onClick={handleSaveProfile} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          Save Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => updateProfile('firstName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => updateProfile('lastName', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => updateProfile('email', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => updateProfile('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency">Emergency Contact</Label>
              <Input
                id="emergency"
                value={profile.emergencyContact}
                onChange={(e) => updateProfile('emergencyContact', e.target.value)}
                placeholder="Emergency contact name and number"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Your current account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Role</Label>
              <Badge className="bg-blue-100 text-blue-800">{user?.role}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Status</Label>
              <Badge className={user?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {user?.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Member Since</Label>
              <span className="text-sm text-gray-600">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>

            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );

  const renderNotificationsTab = () => (
    <TabsContent value="notifications" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6" />
          <div>
            <h2 className="text-xl font-semibold">Notification Settings</h2>
            <p className="text-gray-600">Configure how you receive notifications</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleResetSettings('notifications')}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={() => handleSaveSettings('notifications')} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Notifications
            </CardTitle>
            <CardDescription>Email notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <Switch
                checked={settings.notifications?.email_notifications?.value || false}
                onCheckedChange={(checked) => updateSetting('notifications', 'email_notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Shift Reminders</Label>
                <p className="text-sm text-gray-600">Get reminded about upcoming shifts</p>
              </div>
              <Switch
                checked={settings.notifications?.shift_reminders?.value || true}
                onCheckedChange={(checked) => updateSetting('notifications', 'shift_reminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Schedule Changes</Label>
                <p className="text-sm text-gray-600">Notify when schedule is updated</p>
              </div>
              <Switch
                checked={settings.notifications?.schedule_changes?.value || true}
                onCheckedChange={(checked) => updateSetting('notifications', 'schedule_changes', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Push Notifications
            </CardTitle>
            <CardDescription>In-app and push notification settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Browser Notifications</Label>
                <p className="text-sm text-gray-600">Show notifications in browser</p>
              </div>
              <Switch
                checked={settings.notifications?.browser_notifications?.value || true}
                onCheckedChange={(checked) => updateSetting('notifications', 'browser_notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Sound Alerts</Label>
                <p className="text-sm text-gray-600">Play sound for notifications</p>
              </div>
              <Switch
                checked={settings.notifications?.sound_alerts?.value || false}
                onCheckedChange={(checked) => updateSetting('notifications', 'sound_alerts', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );

  const renderSecurityTab = () => (
    <TabsContent value="security" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6" />
          <div>
            <h2 className="text-xl font-semibold">Security Settings</h2>
            <p className="text-gray-600">Manage your account security</p>
          </div>
        </div>
        <Button onClick={() => handleSaveSettings('security')} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Password Security
            </CardTitle>
            <CardDescription>Password and authentication settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <Label>Session Timeout</Label>
                <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
              </div>
              <Select 
                value={settings.security?.session_timeout?.value?.toString() || '30'}
                onValueChange={(value) => updateSetting('security', 'session_timeout', parseInt(value))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 min</SelectItem>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Privacy Settings
            </CardTitle>
            <CardDescription>Control your privacy preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Profile Visibility</Label>
                <p className="text-sm text-gray-600">Show profile to other employees</p>
              </div>
              <Switch
                checked={settings.security?.profile_visibility?.value || true}
                onCheckedChange={(checked) => updateSetting('security', 'profile_visibility', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Activity Tracking</Label>
                <p className="text-sm text-gray-600">Track login activity</p>
              </div>
              <Switch
                checked={settings.security?.activity_tracking?.value || true}
                onCheckedChange={(checked) => updateSetting('security', 'activity_tracking', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );

  const renderPreferencesTab = () => (
    <TabsContent value="preferences" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6" />
          <div>
            <h2 className="text-xl font-semibold">App Preferences</h2>
            <p className="text-gray-600">Customize your app experience</p>
          </div>
        </div>
        <Button onClick={() => handleSaveSettings('preferences')} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Display Preferences
          </CardTitle>
          <CardDescription>Customize how information is displayed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Time Format</Label>
              <p className="text-sm text-gray-600">Choose 12-hour or 24-hour format</p>
            </div>
            <Select 
              value={settings.preferences?.time_format?.value || '12'}
              onValueChange={(value) => updateSetting('preferences', 'time_format', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12-hour</SelectItem>
                <SelectItem value="24">24-hour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Date Format</Label>
              <p className="text-sm text-gray-600">Choose date display format</p>
            </div>
            <Select 
              value={settings.preferences?.date_format?.value || 'MM/DD/YYYY'}
              onValueChange={(value) => updateSetting('preferences', 'date_format', value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Theme</Label>
              <p className="text-sm text-gray-600">Choose your preferred theme</p>
            </div>
            <Select 
              value={settings.preferences?.theme?.value || 'light'}
              onValueChange={(value) => updateSetting('preferences', 'theme', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );

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
          <p className="text-gray-600">Manage your personal preferences and account settings</p>
        </div>
        
        {hasChanges && (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Unsaved Changes
          </Badge>
        )}
      </div>

      {/* Settings Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
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

        {renderProfileTab()}
        {renderNotificationsTab()}
        {renderSecurityTab()}
        {renderPreferencesTab()}
      </Tabs>
    </div>
  );
};

export default EmployeeSettings;
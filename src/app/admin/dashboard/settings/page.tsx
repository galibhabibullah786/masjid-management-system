'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Upload, RefreshCw, Image, Loader2 } from 'lucide-react';
import { Button, Card, Input, Textarea, Checkbox } from '@/components/admin/ui';
import { settingsApi, uploadApi } from '@/lib/api';
import { hasPermission } from '@/lib/permissions';
import type { SiteSettings } from '@/lib/types';
import { useToast, useAuth, useSiteSettings } from '@/lib/context';

const defaultSettings: SiteSettings = {
  siteName: '',
  tagline: '',
  description: '',
  phone: '',
  email: '',
  address: '',
  socialLinks: {},
  prayerTimes: {},
  maintenanceMode: false,
  showAnonymousDonors: true,
  enableGallery: true,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const originalSettings = useRef<SiteSettings>(defaultSettings);
  const { addToast } = useToast();
  const { user } = useAuth();
  const { updateSettings: updateSiteSettings } = useSiteSettings();
  const router = useRouter();
  
  const canManage = user?.role && hasPermission(user.role, 'manage_settings');

  // Check permission
  useEffect(() => {
    if (user && !canManage) {
      addToast({ type: 'error', title: 'Access denied', message: 'You do not have permission to manage settings.' });
      router.push('/admin/dashboard');
    }
  }, [user, canManage, router, addToast]);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsApi.get();
        const data = (response as { data: SiteSettings }).data || defaultSettings;
        setSettings(data);
        originalSettings.current = data;
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        addToast({ type: 'error', title: 'Failed to load settings' });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [addToast]);

  const handleChange = (field: keyof SiteSettings, value: unknown) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsApi.update(settings);
      originalSettings.current = settings;
      // Update the global site settings context
      updateSiteSettings({
        siteName: settings.siteName,
        logo: settings.logo,
        favicon: settings.favicon,
      });
      addToast({ type: 'success', title: 'Settings saved successfully' });
    } catch (error) {
      console.error('Failed to save settings:', error);
      addToast({ type: 'error', title: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(originalSettings.current);
    addToast({ type: 'info', title: 'Settings reset to last saved state' });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingLogo(true);
    try {
      const response = await uploadApi.upload(file, 'settings');
      if (response.success && response.data?.url) {
        handleChange('logo', response.data.url);
        addToast({ type: 'success', title: 'Logo uploaded successfully' });
      }
    } catch (error) {
      console.error('Failed to upload logo:', error);
      addToast({ type: 'error', title: 'Failed to upload logo' });
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingFavicon(true);
    try {
      const response = await uploadApi.upload(file, 'settings');
      if (response.success && response.data?.url) {
        handleChange('favicon', response.data.url);
        addToast({ type: 'success', title: 'Favicon uploaded successfully' });
      }
    } catch (error) {
      console.error('Failed to upload favicon:', error);
      addToast({ type: 'error', title: 'Failed to upload favicon' });
    } finally {
      setUploadingFavicon(false);
      if (faviconInputRef.current) faviconInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Configure site settings and preferences</p>
        </div>
      </div>

      {/* Site Information */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Site Information</h2>
        <div className="space-y-4">
          <Input
            label="Site Name"
            value={settings.siteName || ''}
            onChange={(e) => handleChange('siteName', e.target.value)}
            placeholder="Amanat-E-Nazirpara"
          />
          <Input
            label="Tagline"
            value={settings.tagline || ''}
            onChange={(e) => handleChange('tagline', e.target.value)}
            placeholder="Building our sacred space together"
          />
          <Textarea
            label="Description"
            value={settings.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of the site..."
            rows={3}
          />
        </div>
      </Card>

      {/* Contact Information */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone"
            value={settings.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+880 1234-567890"
          />
          <Input
            label="Email"
            type="email"
            value={settings.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="contact@example.com"
          />
          <div className="md:col-span-2">
            <Textarea
              label="Address"
              value={settings.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Full address"
              rows={2}
            />
          </div>
        </div>
      </Card>

      {/* Social Media */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Facebook"
            value={settings.socialLinks?.facebook || ''}
            onChange={(e) =>
              handleChange('socialLinks', { ...settings.socialLinks, facebook: e.target.value })
            }
            placeholder="https://facebook.com/yourpage"
          />
          <Input
            label="YouTube"
            value={settings.socialLinks?.youtube || ''}
            onChange={(e) =>
              handleChange('socialLinks', { ...settings.socialLinks, youtube: e.target.value })
            }
            placeholder="https://youtube.com/@channel"
          />
        </div>
      </Card>

      {/* Branding */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Branding</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              {settings.logo ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={settings.logo} alt="Logo" className="max-h-24 mx-auto" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleChange('logo', '')}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Image className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Upload your logo</p>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                  >
                    {uploadingLogo ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {uploadingLogo ? 'Uploading...' : 'Choose File'}
                  </Button>
                </>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              {settings.favicon ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={settings.favicon} alt="Favicon" className="max-h-12 mx-auto" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleChange('favicon', '')}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Image className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Upload favicon (32x32)</p>
                  <input
                    ref={faviconInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFaviconUpload}
                    className="hidden"
                    id="favicon-upload"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => faviconInputRef.current?.click()}
                    disabled={uploadingFavicon}
                  >
                    {uploadingFavicon ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {uploadingFavicon ? 'Uploading...' : 'Choose File'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Display Preferences */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Display Preferences</h2>
        <div className="space-y-4">
          <Checkbox
            label="Maintenance mode"
            description="Put the public site in maintenance mode"
            checked={settings.maintenanceMode ?? false}
            onChange={(checked) => handleChange('maintenanceMode', checked)}
          />
        </div>
      </Card>

      {/* Bottom Actions */}
      <div className="flex justify-end gap-3 pb-8">
        <Button variant="outline" onClick={handleReset}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSave} loading={saving}>
          <Save className="w-4 h-4" />
          Save All Changes
        </Button>
      </div>
    </div>
  );
}

function Badge({ variant, children }: { variant: string; children: React.ReactNode }) {
  const colors = {
    info: 'bg-blue-100 text-blue-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[variant as keyof typeof colors] || colors.info}`}>
      {children}
    </span>
  );
}

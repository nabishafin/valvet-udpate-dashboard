'use client';

import { useState, useEffect } from 'react';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../redux/features/settings/settingsApi';
import { useUploadTeamImageMutation } from '../redux/features/team/teamApi';
import { Loader2, Save, Settings as SettingsIcon, Image as LucideImage, Plus } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

const ImageUploadField = ({ label, currentImage, onUpload, isUploading, type = "square" }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-zinc-700">{label}</label>
    <div className="flex items-center gap-4 mt-2">
      <div className={`relative ${type === 'logo' ? 'w-32 h-16 rounded-xl' : 'w-20 h-20 rounded-full'} bg-zinc-50 overflow-hidden border border-dashed border-zinc-300 flex items-center justify-center group hover:border-maroon transition-colors`}>
        {isUploading ? (
          <Loader2 size={24} className="animate-spin text-maroon" />
        ) : currentImage ? (
          <Image src={currentImage} alt="Preview" fill sizes="128px" className="object-cover" />
        ) : (
          <LucideImage className="text-zinc-300" size={24} />
        )}
        {!isUploading && (
          <>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus size={16} className="text-white" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={onUpload}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
          </>
        )}
      </div>
      <div>
        <p className="text-xs text-zinc-500 font-medium">Change Image</p>
        <p className="text-[10px] text-zinc-400 mt-0.5">{type === 'logo' ? 'PNG preferred (Dark)' : 'Recommended: 1:1 Aspect Ratio'}</p>
      </div>
    </div>
  </div>
);

export default function SettingsPage() {
  const { data: response, isLoading: isFetching } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();
  const [uploadImage] = useUploadTeamImageMutation();

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    logo: '',
    contact: {
      phone: '',
      email: '',
      whatsapp: '',
      address: '',
      mapLink: '',
    },
    socials: {
      instagram: '',
      facebook: '',
      twitter: '',
      whatsapp: '',
    },
    openingHours: {
      weekdays: '',
      saturday: '',
      sunday: '',
    },
    founder: {
      name: '',
      role: '',
      image: '',
    }
  });

  const [uploadingField, setUploadingField] = useState(null); // 'logo' or 'founder'

  // Load existing data into form
  useEffect(() => {
    if (response?.data) {
      setFormData((prev) => ({
        ...prev,
        name: response.data.name || '',
        tagline: response.data.tagline || '',
        logo: response.data.logo || '',
        contact: { ...prev.contact, ...response.data.contact },
        socials: { ...prev.socials, ...response.data.socials },
        openingHours: { ...prev.openingHours, ...response.data.openingHours },
        founder: { ...prev.founder, ...response.data.founder },
      }));
    }
  }, [response]);

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingField(field);
    try {
      const res = await uploadImage({ file }).unwrap();
      const url = res?.data?.url;
      if (url) {
        if (field === 'logo') {
          setFormData(prev => ({ ...prev, logo: url }));
        } else if (field === 'founder') {
          setFormData(prev => ({ ...prev, founder: { ...prev.founder, image: url } }));
        }
        toast.success('Image uploaded successfully!');
      }
    } catch {
      toast.error('Image upload failed.');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(formData).unwrap();
      toast.success('Settings updated successfully!');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update settings.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#fcfbf9]/90 backdrop-blur-md pb-4 pt-2 -mx-8 px-8 border-b border-zinc-100/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <SettingsIcon size={20} className="text-[#BA8C43]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-maroon">Global Configuration</span>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Site Settings</h1>
          <p className="text-zinc-500 mt-1 text-base">Manage global website data like identity, contacts and hours.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isUpdating || isFetching}
          className="bg-maroon text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-maroon/90 transition-all shadow-lg shadow-maroon/20 active:scale-95 disabled:opacity-50"
        >
          {isUpdating ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          <span>Save Changes</span>
        </button>
      </header>

      {isFetching ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-center space-y-3">
            <Loader2 size={32} className="animate-spin text-maroon mx-auto" />
            <p className="text-zinc-500 font-medium">Loading settings...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="max-w-4xl space-y-8">

          {/* General & Identity Section */}

          {/* Admin / Owner Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
            <div className="px-8 py-5 border-b border-zinc-100 bg-zinc-50/50">
              <h2 className="text-lg font-bold text-zinc-900">Admin / Owner Details</h2>
              <p className="text-sm text-zinc-500 mt-0.5">Information about the studio admin or owner.</p>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <ImageUploadField
                label="Admin / Owner Portrait"
                currentImage={formData.founder.image}
                onUpload={(e) => handleImageUpload(e, 'founder')}
                isUploading={uploadingField === 'founder'}
                type="square"
              />
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-zinc-700">Admin / Owner Name</label>
                  <input
                    type="text"
                    value={formData.founder.name}
                    onChange={(e) => handleChange('founder', 'name', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900"
                    placeholder="Elena Voss"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-zinc-700">Admin / Owner Role</label>
                  <input
                    type="text"
                    value={formData.founder.role}
                    onChange={(e) => handleChange('founder', 'role', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900"
                    placeholder="Founder & Creative Director"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
            <div className="px-8 py-5 border-b border-zinc-100 bg-zinc-50/50">
              <h2 className="text-lg font-bold text-zinc-900">Contact Information</h2>
              <p className="text-sm text-zinc-500 mt-0.5">Primary contact details shown on the website.</p>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-zinc-700">Phone Number</label>
                <input
                  type="text"
                  value={formData.contact.phone}
                  onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900"
                  placeholder="(808) 555-0111"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-zinc-700">Email Address</label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => handleChange('contact', 'email', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900"
                  placeholder="info@companyname.com"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-zinc-700">WhatsApp (Number)</label>
                <input
                  type="text"
                  value={formData.contact.whatsapp}
                  onChange={(e) => handleChange('contact', 'whatsapp', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900"
                  placeholder="+18085550111"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700">Physical Address</label>
                <input
                  type="text"
                  value={formData.contact.address}
                  onChange={(e) => handleChange('contact', 'address', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900"
                  placeholder="123 Luxury Lane, Suite 101"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700">Google Maps Link</label>
                <input
                  type="url"
                  value={formData.contact.mapLink}
                  onChange={(e) => handleChange('contact', 'mapLink', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900"
                  placeholder="https://maps.google.com/?q=..."
                />
              </div>
            </div>
          </section>

          {/* Socials Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
            <div className="px-8 py-5 border-b border-zinc-100 bg-zinc-50/50">
              <h2 className="text-lg font-bold text-zinc-900">Social Media Links</h2>
              <p className="text-sm text-zinc-500 mt-0.5">URLs for your social media profiles.</p>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-zinc-700">Instagram</label>
                <input
                  type="url"
                  value={formData.socials.instagram}
                  onChange={(e) => handleChange('socials', 'instagram', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-zinc-700">Facebook</label>
                <input
                  type="url"
                  value={formData.socials.facebook}
                  onChange={(e) => handleChange('socials', 'facebook', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-zinc-700">Twitter / X</label>
                <input
                  type="url"
                  value={formData.socials.twitter}
                  onChange={(e) => handleChange('socials', 'twitter', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900"
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-zinc-700">WhatsApp Link</label>
                <input
                  type="url"
                  value={formData.socials.whatsapp}
                  onChange={(e) => handleChange('socials', 'whatsapp', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900"
                  placeholder="https://wa.me/..."
                />
              </div>
            </div>
          </section>

          {/* Opening Hours Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
            <div className="px-8 py-5 border-b border-zinc-100 bg-zinc-50/50">
              <h2 className="text-lg font-bold text-zinc-900">Opening Hours</h2>
              <p className="text-sm text-zinc-500 mt-0.5">Studio operating hours shown to clients.</p>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-zinc-700">Weekdays</label>
                <input
                  type="text"
                  value={formData.openingHours.weekdays}
                  onChange={(e) => handleChange('openingHours', 'weekdays', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900"
                  placeholder="09:00 — 20:00"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-zinc-700">Saturday</label>
                <input
                  type="text"
                  value={formData.openingHours.saturday}
                  onChange={(e) => handleChange('openingHours', 'saturday', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900"
                  placeholder="10:00 — 18:00"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-zinc-700">Sunday</label>
                <input
                  type="text"
                  value={formData.openingHours.sunday}
                  onChange={(e) => handleChange('openingHours', 'sunday', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900"
                  placeholder="Closed"
                />
              </div>
            </div>
          </section>

        </form>
      )}
    </div>
  );
}

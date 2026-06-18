'use client';

import { useState, useEffect } from 'react';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../redux/features/settings/settingsApi';
import { useUploadImageMutation } from '../redux/features/studios/studiosApi';
import { Loader2, Save, Settings as SettingsIcon, Image as LucideImage, Plus, X } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

const IMAGE_CONFIG = {
  logo:       { w: 'w-32', h: 'h-16', rounded: 'rounded-xl',   hint: 'PNG preferred (Dark bg)' },
  square:     { w: 'w-20', h: 'h-20', rounded: 'rounded-full', hint: 'Recommended: 1:1 ratio' },
  portrait:   { w: 'w-24', h: 'h-32', rounded: 'rounded-2xl',  hint: 'Recommended: 3:4 ratio' },
};

const ImageUploadField = ({ label, hint, currentImage, onUpload, isUploading, type = "square", wide = false }) => {
  const cfg = IMAGE_CONFIG[type] ?? IMAGE_CONFIG.square;
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      {hint && <p className="text-[11px] text-zinc-400">{hint}</p>}
      {wide ? (
        <label className="relative block w-full h-44 bg-zinc-50 rounded-2xl overflow-hidden border border-dashed border-zinc-300 hover:border-maroon transition-colors group cursor-pointer mt-2">
          {isUploading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={28} className="animate-spin text-maroon" />
            </div>
          ) : currentImage ? (
            <>
              <Image src={currentImage} alt="Preview" fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-semibold">Click to change</p>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-400 group-hover:text-zinc-600 transition-colors">
              <LucideImage size={32} />
              <p className="text-sm font-semibold">Click to upload background image</p>
              <p className="text-[11px] text-zinc-400">Recommended: 1600 × 900 px</p>
            </div>
          )}
          <input type="file" accept="image/*" onChange={onUpload} className="sr-only" />
        </label>
      ) : (
        <div className="flex items-center gap-4 mt-2">
          <label className={`relative ${cfg.w} ${cfg.h} ${cfg.rounded} bg-zinc-50 overflow-hidden border border-dashed border-zinc-300 flex items-center justify-center group hover:border-maroon transition-colors cursor-pointer`}>
            {isUploading ? (
              <Loader2 size={24} className="animate-spin text-maroon" />
            ) : currentImage ? (
              <Image src={currentImage} alt="Preview" fill sizes="128px" className="object-cover" />
            ) : (
              <LucideImage className="text-zinc-300" size={24} />
            )}
            {!isUploading && (
              <>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[inherit]">
                  <Plus size={16} className="text-white" />
                </div>
                <input type="file" accept="image/*" onChange={onUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              </>
            )}
          </label>
          <div>
            <p className="text-xs text-zinc-500 font-medium">Click to upload</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">{cfg.hint}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function SettingsPage() {
  const { data: response, isLoading: isFetching } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();
  const [uploadImage] = useUploadImageMutation();

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
      backgroundImage: '',
      bio: [],
      quote: '',
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
        founder: {
          ...prev.founder,
          ...response.data.founder,
          bio: Array.isArray(response.data.founder?.bio) ? response.data.founder.bio : [],
          quote: response.data.founder?.quote ?? '',
          backgroundImage: response.data.founder?.backgroundImage ?? '',
        },
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
      const res = await uploadImage({ file, folder: 'settings' }).unwrap();
      const url = res?.data?.url;
      if (url) {
        if (field === 'logo') {
          setFormData(prev => ({ ...prev, logo: url }));
        } else if (field === 'founderPortrait') {
          setFormData(prev => ({ ...prev, founder: { ...prev.founder, image: url } }));
        } else if (field === 'founderBg') {
          setFormData(prev => ({ ...prev, founder: { ...prev.founder, backgroundImage: url } }));
        }
        toast.success('Image uploaded!');
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

          {/* Meet the Founder Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
            <div className="px-8 py-5 border-b border-zinc-100 bg-zinc-50/50">
              <h2 className="text-lg font-bold text-zinc-900">Meet the Founder</h2>
              <p className="text-sm text-zinc-500 mt-0.5">Founder profile shown in the &ldquo;Meet the Founder&rdquo; section on the website.</p>
            </div>
            <div className="p-8 space-y-8">

              {/* Background Image — full width */}
              <ImageUploadField
                label="Section Background Image"
                hint="Large salon photo displayed behind the founder section. Recommended: 1600 × 900 px."
                currentImage={formData.founder.backgroundImage}
                onUpload={(e) => handleImageUpload(e, 'founderBg')}
                isUploading={uploadingField === 'founderBg'}
                wide
              />

              {/* Portrait + Name + Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <ImageUploadField
                  label="Founder Portrait"
                  hint="Foreground photo of the founder. Recommended: 3:4 ratio."
                  currentImage={formData.founder.image}
                  onUpload={(e) => handleImageUpload(e, 'founderPortrait')}
                  isUploading={uploadingField === 'founderPortrait'}
                  type="portrait"
                />
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-zinc-700">Name</label>
                    <input
                      type="text"
                      value={formData.founder.name}
                      onChange={(e) => handleChange('founder', 'name', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900"
                      placeholder="Elena Voss"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-zinc-700">Role / Title</label>
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

              {/* Bio Paragraphs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">Bio Paragraphs</label>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Each paragraph is displayed separately on the website.</p>
                  </div>
                  <button
                    type="button"
                    disabled={formData.founder.bio.length >= 5}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        founder: { ...prev.founder, bio: [...prev.founder.bio, ''] },
                      }))
                    }
                    className="flex items-center gap-1.5 px-3 py-2 bg-maroon/8 text-maroon rounded-lg text-xs font-bold hover:bg-maroon/15 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus size={14} />
                    Add Paragraph
                    <span className="text-maroon/50">({formData.founder.bio.length}/5)</span>
                  </button>
                </div>

                {formData.founder.bio.length === 0 ? (
                  <div className="flex items-center justify-center h-20 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                    <p className="text-zinc-400 text-sm">No paragraphs yet. Click &ldquo;Add Paragraph&rdquo; to begin.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.founder.bio.map((para, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <div className="flex-shrink-0 w-6 h-9 flex items-center justify-center">
                          <span className="text-[11px] font-bold text-zinc-300">#{idx + 1}</span>
                        </div>
                        <textarea
                          rows={3}
                          value={para}
                          onChange={(e) => {
                            const updated = [...formData.founder.bio];
                            updated[idx] = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              founder: { ...prev.founder, bio: updated },
                            }));
                          }}
                          className="flex-1 px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900 text-sm resize-none"
                          placeholder={`Paragraph ${idx + 1}…`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.founder.bio.filter((_, i) => i !== idx);
                            setFormData((prev) => ({
                              ...prev,
                              founder: { ...prev.founder, bio: updated },
                            }));
                          }}
                          className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-zinc-300 hover:bg-red-50 hover:text-red-400 transition-colors border border-transparent hover:border-red-100"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quote */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-zinc-700">Quote</label>
                <p className="text-[11px] text-zinc-400">A short inspiring quote from the founder.</p>
                <textarea
                  rows={2}
                  value={formData.founder.quote}
                  onChange={(e) => handleChange('founder', 'quote', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900 text-sm resize-none mt-1"
                  placeholder='"Beauty is the harmony of purpose and elegance."'
                />
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

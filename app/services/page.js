'use client';

import { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  X,
  PlusCircle,
  Image as LucideImage,
  Loader2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import Image from 'next/image';
import Modal from "../../components/Modal";
import toast from 'react-hot-toast';
import {
  useGetAllStudiosQuery,
  useCreateStudioMutation,
  useUpdateStudioMutation,
  useDeleteStudioMutation,
  useUploadImageMutation,
} from '../redux/features/studios/studiosApi';

const emptyForm = {
  title: '',
  price: '',
  badge: 'SINGLE',
  image: '',
  description: '',
  auraExperience: '',
  inclusions: '',
  features: [],
  benefits: [],
  gallery: [],
};

// ── Sub-components ──────────────────────────────────────────────────────────

const ImageUploadField = ({ label, currentImage, onUpload, isUploading }) => (
  <div className="space-y-1">
    <label className="block text-base font-medium text-zinc-700">{label}</label>
    <div className="flex items-center gap-4 mt-2">
      <div className="relative w-24 h-24 bg-zinc-50 rounded-lg overflow-hidden border border-dashed border-zinc-300 flex items-center justify-center group hover:border-maroon transition-colors">
        {isUploading ? (
          <Loader2 size={24} className="animate-spin text-maroon" />
        ) : currentImage ? (
          <Image src={currentImage} alt="Preview" fill sizes="96px" className="object-cover" />
        ) : (
          <LucideImage className="text-zinc-300" size={32} />
        )}
        {!isUploading && (
          <>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
              <Plus size={20} className="text-white" />
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
        <p className="text-base text-zinc-500 font-medium">Click to upload</p>
        <p className="text-[13px] text-zinc-400 mt-0.5">JPG / PNG / WEBP</p>
        {currentImage && (
          <p className="text-[9px] text-emerald-500 font-bold mt-1 uppercase">✓ Uploaded</p>
        )}
      </div>
    </div>
  </div>
);

const ListInput = ({ label, field, tempField, items, tempInputs, setTempInputs, handleAddItem, handleRemoveItem, placeholder }) => (
  <div className="space-y-1">
    <label className="block text-base font-medium text-zinc-700">{label}</label>
    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-white rounded-lg border border-zinc-200 mt-2">
      {items.length === 0 && <span className="text-zinc-400 text-[13px] italic p-1">No items added yet</span>}
      {items.map((item, index) => (
        <span key={index} className="pl-2 pr-1 py-1 bg-zinc-100 text-zinc-800 text-[13px] font-medium rounded flex items-center gap-1 border border-zinc-200">
          {item}
          <button type="button" onClick={() => handleRemoveItem(field, index)} className="p-0.5 hover:bg-zinc-200 rounded transition-colors text-zinc-500">
            <X size={14} />
          </button>
        </span>
      ))}
    </div>
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        value={tempInputs[tempField]}
        onChange={(e) => setTempInputs({ ...tempInputs, [tempField]: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem(field, tempField))}
        className="flex-1 px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-base text-zinc-900"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => handleAddItem(field, tempField)}
        className="px-4 py-2.5 bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-lg flex items-center justify-center hover:bg-zinc-200 transition-colors"
      >
        <Plus size={20} />
      </button>
    </div>
  </div>
);

// ── Main Page ────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const { data: response, isLoading: isFetching } = useGetAllStudiosQuery();
  const studios = response?.data ?? [];

  const [createStudio, { isLoading: isCreating }] = useCreateStudioMutation();
  const [updateStudio, { isLoading: isUpdating }] = useUpdateStudioMutation();
  const [deleteStudio] = useDeleteStudioMutation();
  const [uploadImage] = useUploadImageMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudio, setCurrentStudio] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  const [formData, setFormData] = useState(emptyForm);
  const [tempInputs, setTempInputs] = useState({ feature: '', benefit: '', gallery: '' });

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleOpenModal = (studio = null) => {
    if (studio) {
      setCurrentStudio(studio);
      setFormData({
        title: studio.title ?? '',
        price: studio.price ?? '',
        badge: studio.badge ?? 'SINGLE',
        image: studio.image ?? '',
        description: studio.description ?? '',
        auraExperience: studio.auraExperience ?? '',
        inclusions: studio.inclusions ?? '',
        features: studio.features ?? [],
        benefits: studio.benefits ?? [],
        gallery: studio.gallery ?? [],
      });
    } else {
      setCurrentStudio(null);
      setFormData(emptyForm);
    }
    setTempInputs({ feature: '', benefit: '', gallery: '' });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsImageUploading(true);
    try {
      const res = await uploadImage({ file, folder: 'studios' }).unwrap();
      const url = res?.data?.url;
      if (url) {
        setFormData((prev) => ({ ...prev, image: url }));
        toast.success('Image uploaded successfully!');
      }
    } catch {
      toast.error('Image upload failed. Please try again.');
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsGalleryUploading(true);
    try {
      const res = await uploadImage({ file, folder: 'studios/gallery' }).unwrap();
      const url = res?.data?.url;
      if (url) {
        setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, url] }));
        toast.success('Gallery image added!');
      }
    } catch {
      toast.error('Gallery upload failed.');
    } finally {
      setIsGalleryUploading(false);
    }
  };

  const handleRemoveGalleryImage = (index) => {
    setFormData((prev) => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
  };

  const handleAddItem = (field, tempField) => {
    const value = tempInputs[tempField];
    if (!value.trim()) return;
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    setTempInputs((prev) => ({ ...prev, [tempField]: '' }));
  };

  const handleRemoveItem = (field, index) => {
    setFormData((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (currentStudio) {
        await updateStudio({ id: currentStudio._id, ...formData }).unwrap();
        toast.success('Studio updated successfully!');
      } else {
        await createStudio(formData).unwrap();
        toast.success('Studio published to live site!');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message ?? 'Something went wrong. Please try again.');
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return;
    try {
      await deleteStudio(id).unwrap();
      toast.success('Studio removed successfully.');
    } catch {
      toast.error('Failed to delete studio.');
    }
  };

  const handleToggleActive = async (studio) => {
    try {
      await updateStudio({ id: studio._id, isActive: !studio.isActive }).unwrap();
      toast.success(`Studio ${!studio.isActive ? 'activated' : 'deactivated'}.`);
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const isSaving = isCreating || isUpdating;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#fcfbf9]/90 backdrop-blur-md pb-4 pt-2 -mx-8 px-8 border-b border-zinc-100/50">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-widest text-maroon mb-1">Velvet Rouge</p>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Suite Management</h1>
          <p className="text-zinc-400 mt-1 text-base">Configure and publish luxury studio spaces.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-maroon text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-maroon/90 transition-all shadow-xl shadow-maroon/20 active:scale-95"
        >
          <PlusCircle size={20} />
          <span>Add New Suite</span>
        </button>
      </header>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
        {isFetching ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-center space-y-3">
              <Loader2 size={32} className="animate-spin text-maroon mx-auto" />
              <p className="text-zinc-400 text-base font-medium">Loading studios...</p>
            </div>
          </div>
        ) : studios.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <LucideImage size={36} className="text-zinc-200" />
            <p className="text-zinc-400 text-base font-medium">No studios yet. Add your first suite!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-zinc-900 text-[10px] uppercase tracking-[0.2em] font-black border-b border-zinc-50">
                  <th className="px-10 py-6">Suite Identity</th>
                  <th className="px-10 py-6">Weekly Rate</th>
                  <th className="px-10 py-6">Category</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {studios.map((studio) => (
                  <tr key={studio._id} className="group hover:bg-zebra/30 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="relative w-20 h-20 shrink-0">
                          {studio.image ? (
                            <Image
                              src={studio.image}
                              alt={studio.title}
                              fill
                              sizes="80px"
                              className="rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-zebra rounded-xl flex items-center justify-center text-zinc-300">
                              <LucideImage size={24} />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-black text-zinc-900 block text-xl tracking-tight">{studio.title}</span>
                          <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest">/{studio.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="font-black text-maroon text-xl">{studio.price || '—'}</span>
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-5 py-1.5 bg-maroon/5 text-maroon text-[10px] font-black uppercase tracking-[0.15em] rounded-full border border-maroon/10">
                        {studio.badge || '—'}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <button
                        onClick={() => handleToggleActive(studio)}
                        className="flex items-center gap-2 text-[13px] font-bold transition-colors"
                      >
                        {studio.isActive ? (
                          <>
                            <ToggleRight size={24} className="text-emerald-500" />
                            <span className="text-emerald-600">Active</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft size={24} className="text-zinc-300" />
                            <span className="text-zinc-400">Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleOpenModal(studio)}
                          className="w-11 h-11 flex items-center justify-center hover:bg-zebra rounded-2xl text-zinc-400 hover:text-gold transition-all"
                        >
                          <Edit3 size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(studio._id, studio.title)}
                          className="w-11 h-11 flex items-center justify-center hover:bg-red-50 rounded-2xl text-zinc-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentStudio ? 'Refine Suite Details' : 'Onboard New Suite'}
      >
        <form onSubmit={handleSave} className="space-y-10 max-h-[75vh] overflow-y-auto pr-4 pb-10">

          {/* Section 1: Identity */}
          <section className="space-y-4">
            <h4 className="text-xl font-semibold text-zinc-900 border-b border-zinc-100 pb-2">Basic Details</h4>

            <ImageUploadField
              label="Main Hero Image"
              currentImage={formData.image}
              onUpload={handleImageUpload}
              isUploading={isImageUploading}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-zinc-700 mb-1">Suite Title *</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-base text-zinc-900"
                  placeholder="The Executive Suite"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-zinc-700 mb-1">Weekly Rate</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-base text-zinc-900"
                  placeholder="From $325/wk"
                />
              </div>
            </div>

            <div>
              <label className="block text-base font-medium text-zinc-700 mb-1">Badge / Tier</label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-base text-zinc-900"
                placeholder="SINGLE / MULTI / POPULAR"
              />
            </div>
          </section>

          {/* Section 2: Description */}
          <section className="space-y-4 pt-4">
            <h4 className="text-xl font-semibold text-zinc-900 border-b border-zinc-100 pb-2">Descriptions</h4>
            {[
              { label: 'General Description', key: 'description', ph: 'Additional suite details...' },
              { label: 'Aura Experience', key: 'auraExperience', ph: 'Describe the sensory experience...' },
              { label: 'Inclusions', key: 'inclusions', ph: "What's included..." },
            ].map(({ label, key, ph }) => (
              <div key={key}>
                <label className="block text-base font-medium text-zinc-700 mb-1">{label}</label>
                <textarea
                  rows={3}
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-base text-zinc-900"
                  placeholder={ph}
                />
              </div>
            ))}
          </section>

          {/* Section 3: Features & Benefits */}
          <section className="space-y-4 pt-4">
            <h4 className="text-xl font-semibold text-zinc-900 border-b border-zinc-100 pb-2">Features & Benefits</h4>
            <ListInput label="Features (Tags)" field="features" tempField="feature" items={formData.features} tempInputs={tempInputs} setTempInputs={setTempInputs} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} placeholder="e.g. Private Bathroom" />
            <ListInput label="Benefits (Bullet Points)" field="benefits" tempField="benefit" items={formData.benefits} tempInputs={tempInputs} setTempInputs={setTempInputs} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} placeholder="e.g. 24/7 Access" />
          </section>

          {/* Section 4: Gallery */}
          <section className="space-y-4 pt-4">
            <h4 className="text-xl font-semibold text-zinc-900 border-b border-zinc-100 pb-2">Gallery Images</h4>

            {/* Gallery preview grid */}
            {formData.gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {formData.gallery.map((url, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-zinc-100">
                    <Image src={url} alt={`Gallery ${idx + 1}`} fill sizes="(max-width: 768px) 33vw, 250px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                    <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                      {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            <div className="relative mt-3">
              <label className={`flex items-center justify-center gap-2 w-full py-3 border border-dashed rounded-lg cursor-pointer transition-colors ${
                isGalleryUploading ? 'border-zinc-300 bg-zinc-50' : 'border-zinc-300 hover:border-maroon hover:bg-zinc-50'
              }`}>
                {isGalleryUploading ? (
                  <><Loader2 size={16} className="animate-spin text-zinc-500" /><span className="text-base font-medium text-zinc-500">Uploading...</span></>
                ) : (
                  <><Plus size={16} className="text-zinc-500" /><span className="text-base font-medium text-zinc-600">Add Gallery Image ({formData.gallery.length}/10)</span></>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  disabled={isGalleryUploading || formData.gallery.length >= 10}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
          </section>

          {/* Submit */}
          <div className="pt-6 mt-4 border-t border-zinc-100">
            <button
              type="submit"
              disabled={isSaving || isImageUploading || isGalleryUploading}
              className="w-full bg-maroon text-white py-3 rounded-lg font-semibold shadow hover:bg-maroon/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving && <Loader2 size={18} className="animate-spin" />}
              {currentStudio ? 'Save Changes' : 'Publish to Live Site'}
            </button>
          </div>

        </form>
      </Modal>
    </div>
  );
}

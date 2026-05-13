'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  PlusCircle,
  Image as LucideImage
} from 'lucide-react';
import Image from 'next/image';
import Modal from "../../components/Modal";

const initialServices = [
  {
    id: 1,
    slug: "executive-suite",
    title: "The Executive Suite",
    price: "From $325/wk",
    badge: "SINGLE",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400",
    image2: null,
    image3: null,
    features: ["FLOOR-TO-CEILING WINDOWS", "PRIVATE SINK", "DUAL STATIONS", "DIMMABLE LIGHTING"],
    description: "Experience the pinnacle of professional studio space.",
    auraExperience: "Our Velvet Experience in the Executive Suite is designed for ultimate comfort.",
    inclusions: "Every Executive Suite includes a private sink, dual stations, and premium modern fixtures.",
    benefits: ["Prime location with high visibility.", "Exclusive member events."],
    gallery: []
  }
];

export default function ServicesPage() {
  const [services, setServices] = useState(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    price: '',
    badge: 'SINGLE',
    image: null,
    image2: null,
    image3: null,
    description: '',
    auraExperience: '',
    inclusions: '',
    features: [],
    benefits: [],
    gallery: []
  });

  const [tempInputs, setTempInputs] = useState({
    feature: '',
    benefit: '',
    gallery: ''
  });

  const handleOpenModal = (service = null) => {
    if (service) {
      setCurrentService(service);
      setFormData({ ...service });
    } else {
      setCurrentService(null);
      setFormData({
        title: '',
        slug: '',
        price: '',
        badge: 'SINGLE',
        image: null,
        image2: null,
        image3: null,
        description: '',
        auraExperience: '',
        inclusions: '',
        features: [],
        benefits: [],
        gallery: []
      });
    }
    setTempInputs({ feature: '', benefit: '', gallery: '' });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, [field]: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleAddItem = (field, tempField) => {
    const value = tempInputs[tempField];
    if (!value.trim()) return;
    setFormData({
      ...formData,
      [field]: [...formData[field], value.trim()]
    });
    setTempInputs({ ...tempInputs, [tempField]: '' });
  };

  const handleRemoveItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const finalSlug = formData.slug || formData.title.toLowerCase().replace(/ /g, '-');
    const processedData = { ...formData, slug: finalSlug };

    if (currentService) {
      setServices(services.map(s => s.id === currentService.id ? { ...processedData, id: s.id } : s));
    } else {
      setServices([...services, { ...processedData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this suite?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const ImageUploadField = ({ label, field, currentImage }) => (
    <div className="space-y-3">
      <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{label}</label>
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 bg-zebra rounded-xl overflow-hidden border-2 border-dashed border-zinc-200 flex items-center justify-center group hover:border-maroon/40 transition-colors">
          {currentImage ? (
            <Image src={currentImage} alt="Preview" fill className="object-cover" />
          ) : (
            <LucideImage className="text-zinc-300" size={32} />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, field)}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />
        </div>
        <div className="flex-1">
          <p className="text-[10px] text-zinc-500 font-bold leading-tight uppercase">Upload</p>
          <p className="text-[9px] text-zinc-400 mt-0.5 uppercase tracking-tighter">JPG/PNG/WEBP</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Suite Management</h1>
          <p className="text-zinc-500 mt-1">Configure and publish luxury studio spaces.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-maroon text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-maroon/90 transition-all shadow-xl shadow-maroon/20 active:scale-95"
        >
          <PlusCircle size={20} />
          <span>Add New Suite</span>
        </button>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-zinc-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-zinc-50">
                <th className="px-10 py-8 text-zinc-900">Suite Identity</th>
                <th className="px-10 py-8 text-zinc-900">Weekly Rate</th>
                <th className="px-10 py-8 text-zinc-900">Category</th>
                <th className="px-10 py-8 text-right text-zinc-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {services.map((service) => (
                <tr key={service.id} className="group hover:bg-zebra/30 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="relative w-20 h-20 shrink-0">
                        {service.image ? (
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-zebra rounded-xl flex items-center justify-center text-zinc-300">
                            <LucideImage size={24} />
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-black text-zinc-900 block text-lg tracking-tight">{service.title}</span>
                        <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">SLUG: {service.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="font-black text-maroon text-xl">{service.price}</span>
                  </td>
                  <td className="px-10 py-6">
                    <span className="px-5 py-1.5 bg-maroon/5 text-maroon text-[10px] font-black uppercase tracking-[0.15em] rounded-full border border-maroon/10">
                      {service.badge}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleOpenModal(service)}
                        className="w-11 h-11 flex items-center justify-center hover:bg-zebra rounded-2xl text-zinc-400 hover:text-gold transition-all duration-300"
                      >
                        <Edit3 size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="w-11 h-11 flex items-center justify-center hover:bg-red-50 rounded-2xl text-zinc-400 hover:text-red-500 transition-all duration-300"
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
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentService ? 'Refine Suite Details' : 'Onboard New Suite'}
      >
        <form onSubmit={handleSave} className="space-y-12 max-h-[75vh] overflow-y-auto pr-4 custom-scrollbar pb-10">

          {/* Section 1: Hero & Identity */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
              <div className="w-1.5 h-6 bg-maroon rounded-full" />
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-900">1. Hero Section & Identity</h4>
            </div>

            <ImageUploadField label="Main Hero Image (Big Top Image)" field="image" currentImage={formData.image} />

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Suite Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-6 py-4 bg-zebra border-none rounded-xl focus:ring-2 focus:ring-maroon/20 text-sm font-semibold text-zinc-900"
                  placeholder="The Executive Suite"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-6 py-4 bg-zebra border-none rounded-xl focus:ring-2 focus:ring-maroon/20 text-sm font-semibold text-zinc-900"
                  placeholder="executive-suite"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Weekly Rate</label>
                <input
                  required
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-6 py-4 bg-zebra border-none rounded-xl focus:ring-2 focus:ring-maroon/20 text-sm font-semibold text-zinc-900"
                  placeholder="From $325/wk"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Member Tier (Badge)</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-6 py-4 bg-zebra border-none rounded-xl focus:ring-2 focus:ring-maroon/20 text-sm font-semibold text-zinc-900"
                  placeholder="SINGLE / MULTI"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Experience & Description */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
              <div className="w-1.5 h-6 bg-maroon rounded-full" />
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-900">2. The Aura Experience</h4>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Experience Title (Optional)</label>
              <input
                type="text"
                className="w-full px-6 py-4 bg-zebra border-none rounded-2xl focus:ring-2 focus:ring-maroon/20 text-sm font-semibold text-zinc-900"
                placeholder="The Aura Experience"
                defaultValue="The Aura Experience"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Aura Description</label>
              <textarea
                rows={3}
                value={formData.auraExperience}
                onChange={(e) => setFormData({ ...formData, auraExperience: e.target.value })}
                className="w-full px-6 py-4 bg-zebra border-none rounded-xl focus:ring-2 focus:ring-maroon/20 text-sm font-medium leading-relaxed text-zinc-900"
                placeholder="Describe the sensory experience..."
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">General Description (Secondary Text)</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-6 py-4 bg-zebra border-none rounded-xl focus:ring-2 focus:ring-maroon/20 text-sm font-medium leading-relaxed text-zinc-900"
                placeholder="Additional details about the suite..."
              />
            </div>
          </section>

          {/* Section 3: Inclusions */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
              <div className="w-1.5 h-6 bg-maroon rounded-full" />
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-900">3. Services Included</h4>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Inclusions Description</label>
              <textarea
                rows={3}
                value={formData.inclusions}
                onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                className="w-full px-6 py-4 bg-zebra border-none rounded-2xl focus:ring-2 focus:ring-maroon/20 text-sm font-medium leading-relaxed text-zinc-900"
                placeholder="List what's included in the service..."
              />
            </div>

            <ListInput
              label="Inclusion Features (Mini Tags)"
              field="features"
              tempField="feature"
              items={formData.features}
              tempInputs={tempInputs}
              setTempInputs={setTempInputs}
              handleAddItem={handleAddItem}
              handleRemoveItem={handleRemoveItem}
              placeholder="e.g. Private Sink"
            />
          </section>

          {/* Section 4: Secondary Images & Benefits */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
              <div className="w-1.5 h-6 bg-maroon rounded-full" />
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-900">4. Visual Details & Benefits</h4>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <ImageUploadField label="Secondary View 1" field="image2" currentImage={formData.image2} />
              <ImageUploadField label="Secondary View 2" field="image3" currentImage={formData.image3} />
            </div>

            <ListInput
              label="Services Benefits (Bullet Points)"
              field="benefits"
              tempField="benefit"
              items={formData.benefits}
              tempInputs={tempInputs}
              setTempInputs={setTempInputs}
              handleAddItem={handleAddItem}
              handleRemoveItem={handleRemoveItem}
              placeholder="Add benefit..."
            />
          </section>

          <div className="pt-6 border-t border-zinc-100">
            <button className="w-full bg-maroon text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-maroon/30 hover:bg-maroon/90 transition-all active:scale-[0.98]">
              {currentService ? 'Sync with Website Profile' : 'Publish to Live Site'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

const ListInput = ({ label, field, tempField, items, tempInputs, setTempInputs, handleAddItem, handleRemoveItem, placeholder }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</label>
    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-zebra/50 rounded-xl border border-zinc-100">
      {items.length === 0 && <span className="text-zinc-400 text-xs italic p-2">No {label.toLowerCase()} added yet...</span>}
      {items.map((item, index) => (
        <span key={index} className="pl-3 pr-1 py-1 bg-maroon text-white text-[10px] font-bold uppercase tracking-tight rounded-lg flex items-center gap-1 group animate-in zoom-in-90">
          {item}
          <button
            type="button"
            onClick={() => handleRemoveItem(field, index)}
            className="p-1 hover:bg-white/20 rounded-md transition-colors"
          >
            <X size={14} />
          </button>
        </span>
      ))}
    </div>
    <div className="flex gap-2">
      <input
        type="text"
        value={tempInputs[tempField]}
        onChange={(e) => setTempInputs({ ...tempInputs, [tempField]: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem(field, tempField))}
        className="flex-1 px-5 py-3 bg-zebra border-none rounded-xl focus:ring-2 focus:ring-maroon/20 text-sm shadow-inner text-zinc-900 font-semibold"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => handleAddItem(field, tempField)}
        className="w-12 h-12 bg-maroon text-white rounded-2xl flex items-center justify-center hover:bg-maroon/90 transition-all shadow-lg shadow-maroon/20"
      >
        <Plus size={24} />
      </button>
    </div>
  </div>
);

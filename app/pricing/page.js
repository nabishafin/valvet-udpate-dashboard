'use client';

import { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  X,
  PlusCircle,
  Loader2,
  Check,
  Star,
  Eye,
  EyeOff
} from 'lucide-react';
import Modal from "../../components/Modal";
import toast from 'react-hot-toast';
import {
  useGetPricingQuery,
  useCreatePricingMutation,
  useDeletePricingMutation,
  usePatchPricingMutation,
  useGetGlobalFeaturesQuery,
  useCreateGlobalFeatureMutation,
  useDeleteGlobalFeatureMutation
} from '../redux/features/pricing/pricingApi';

const emptyForm = {
  name: '',
  price: '',
  period: 'Every Month',
  buttonText: 'Join Experience',
  highlighted: false,
  isActive: true,
  order: 0,
  features: [],
};

export default function PricingPage() {
  const { data: response, isLoading: isFetching } = useGetPricingQuery();
  const { data: featuresResponse } = useGetGlobalFeaturesQuery();
  
  const pricingPlans = response?.data ?? [];
  const globalFeatures = featuresResponse?.data ?? [];

  const [createPricing, { isLoading: isCreating }] = useCreatePricingMutation();
  const [patchPricing, { isLoading: isPatching }] = usePatchPricingMutation();
  const [deletePricing] = useDeletePricingMutation();
  
  const [createGlobalFeature] = useCreateGlobalFeatureMutation();
  const [deleteGlobalFeature] = useDeleteGlobalFeatureMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [newFeatureText, setNewFeatureText] = useState('');

  const handleOpenModal = (plan = null) => {
    const baseData = plan ? {
      name: plan.name ?? '',
      price: plan.price ?? '',
      period: plan.period ?? 'Every Month',
      buttonText: plan.buttonText ?? 'Join Experience',
      highlighted: plan.highlighted ?? false,
      isActive: plan.isActive ?? true,
      order: plan.order ?? 0,
      features: plan.features ?? [],
    } : emptyForm;

    const syncedFeatures = globalFeatures.map(gf => {
      const existing = baseData.features.find(f => f.text === gf.text);
      return { text: gf.text, included: !!existing?.included };
    });

    setCurrentPlan(plan);
    setFormData({ ...baseData, features: syncedFeatures });
    setIsModalOpen(true);
  };

  const handleToggleFeature = (index) => {
    const newFeatures = [...formData.features];
    newFeatures[index].included = !newFeatures[index].included;
    setFormData({ ...formData, features: newFeatures });
  };

  const handleAddGlobalFeature = async () => {
    if (!newFeatureText.trim()) return;
    try {
      await createGlobalFeature({ text: newFeatureText.trim() }).unwrap();
      setFormData(prev => ({ ...prev, features: [...prev.features, { text: newFeatureText.trim(), included: true }] }));
      setNewFeatureText('');
      toast.success('Added');
    } catch {
      toast.error('Failed');
    }
  };

  const handleRemoveGlobalFeature = async (text) => {
    if (!confirm('Delete feature globally?')) return;
    const feat = globalFeatures.find(f => f.text === text);
    if (feat) {
      try {
        await deleteGlobalFeature(feat._id).unwrap();
        setFormData(prev => ({ ...prev, features: prev.features.filter(f => f.text !== text) }));
      } catch {
        toast.error('Failed');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, price: Number(formData.price), order: Number(formData.order) };
      if (currentPlan) await patchPricing({ id: currentPlan._id, ...payload }).unwrap();
      else await createPricing(payload).unwrap();
      setIsModalOpen(false);
      toast.success('Saved');
    } catch {
      toast.error('Error');
    }
  };

  const isSaving = isCreating || isPatching;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <header className="flex items-center justify-between bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-zinc-900">The Membership</h1>
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">Pricing Configuration</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-maroon text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-maroon/90 transition-all text-sm"
        >
          <Plus size={18} />
          <span>Add Plan</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isFetching ? (
          <div className="col-span-full flex justify-center py-10"><Loader2 className="animate-spin text-maroon" /></div>
        ) : (
          pricingPlans.map((plan) => (
            <div 
              key={plan._id} 
              className={`bg-white rounded-3xl p-6 border-2 transition-all group flex flex-col h-full ${plan.highlighted ? 'border-[#BA8C43] shadow-lg' : 'border-zinc-50 shadow-sm'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-baseline">
                  <span className="text-4xl font-black text-zinc-900">{plan.price}</span>
                  <span className="text-lg font-black text-zinc-400 ml-0.5">$</span>
                </div>
                <h3 className="text-2xl font-serif italic text-zinc-800">{plan.name}</h3>
              </div>

              <div className="space-y-2 mb-6 flex-grow">
                {plan.features.slice(0, 5).map((f, i) => (
                  <div key={i} className="flex justify-between items-center text-xs font-bold">
                    <span className={f.included ? 'text-zinc-700' : 'text-zinc-300'}>{f.text}</span>
                    <div className={`${f.included ? 'text-emerald-500' : 'text-zinc-200'}`}>
                      {f.included ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                    </div>
                  </div>
                ))}
                {plan.features.length > 5 && <p className="text-[10px] text-zinc-300 font-bold italic">+{plan.features.length - 5} more features</p>}
              </div>

              {/* Action Buttons: More compact and clearer as per screenshot */}
              <div className="pt-5 border-t border-zinc-50 flex items-center justify-between gap-3">
                <button 
                  onClick={() => handleOpenModal(plan)} 
                  className="flex-1 py-3 px-4 bg-zinc-50 hover:bg-zinc-100 text-zinc-500 rounded-xl flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest transition-all"
                >
                  <Edit3 size={14} />
                  <span>Edit Plan</span>
                </button>
                <button 
                  onClick={() => { if(confirm('Delete?')) deletePricing(plan._id) }} 
                  className="p-3 bg-zinc-50 hover:bg-red-50 text-zinc-300 hover:text-red-500 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentPlan ? `Edit ${currentPlan.name}` : 'New Plan'}>
        <form onSubmit={handleSave} className="space-y-5 max-h-[80vh] overflow-y-auto pr-2 pb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-400 uppercase">Plan Name</label>
              <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-zinc-50 rounded-xl focus:outline-none font-bold text-sm border border-zinc-100" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-400 uppercase">Price ($)</label>
              <input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-3 bg-zinc-50 rounded-xl focus:outline-none font-bold text-sm border border-zinc-100" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
               <button type="button" onClick={() => setFormData({ ...formData, highlighted: !formData.highlighted })} className={`w-10 h-5 rounded-full relative transition-colors ${formData.highlighted ? 'bg-[#BA8C43]' : 'bg-zinc-300'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${formData.highlighted ? 'left-5.5' : 'left-0.5'}`} />
              </button>
              <span className="text-[10px] font-black uppercase text-zinc-500">Featured</span>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-400 uppercase">Button CTA</label>
              <input value={formData.buttonText} onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })} className="w-full px-4 py-3 bg-zinc-50 rounded-xl focus:outline-none font-bold text-sm border border-zinc-100" />
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-zinc-100">
            <label className="text-[10px] font-black text-zinc-400 uppercase">Features</label>
            <div className="grid grid-cols-1 gap-1.5">
              {formData.features.map((f, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${f.included ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-zinc-50 opacity-60'}`}>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => handleToggleFeature(i)} className={`w-5 h-5 rounded-full flex items-center justify-center ${f.included ? 'bg-emerald-500 text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                      <Check size={12} strokeWidth={4} />
                    </button>
                    <span className={`text-xs font-bold ${f.included ? 'text-zinc-900' : 'text-zinc-400'}`}>{f.text}</span>
                  </div>
                  <button type="button" onClick={() => handleRemoveGlobalFeature(f.text)} className="text-zinc-300 hover:text-red-500"><X size={14} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input value={newFeatureText} onChange={(e) => setNewFeatureText(e.target.value)} placeholder="Add feature..." className="flex-1 px-4 py-2.5 bg-zinc-50 rounded-xl focus:outline-none border border-zinc-100 text-sm" />
              <button type="button" onClick={handleAddGlobalFeature} className="px-4 py-2 bg-zinc-900 text-white rounded-xl font-bold text-xs">Add</button>
            </div>
          </div>

          <button type="submit" disabled={isSaving} className="w-full bg-maroon text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-maroon/10">
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            Save Membership
          </button>
        </form>
      </Modal>
    </div>
  );
}

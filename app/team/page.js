'use client';

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Star,
  Edit3, 
  Trash2,
  Phone,
  Mail
} from 'lucide-react';
import Image from 'next/image';
import Modal from "../../components/Modal";

const initialTeam = [
  { id: 1, name: 'Elena Vossen', role: 'Master Stylist', experience: '12 Years', rating: 4.9, avatar: 'https://i.pravatar.cc/150?u=elena' },
  { id: 2, name: 'Julian Marx', role: 'Senior Barber', experience: '8 Years', rating: 4.8, avatar: 'https://i.pravatar.cc/150?u=julian' },
  { id: 3, name: 'Sophia Chen', role: 'Color Specialist', experience: '6 Years', rating: 4.7, avatar: 'https://i.pravatar.cc/150?u=sophia' },
  { id: 4, name: 'Marcus Thorne', role: 'Executive Groomer', experience: '15 Years', rating: 5.0, avatar: 'https://i.pravatar.cc/150?u=marcus' },
  { id: 5, name: 'Aria Blue', role: 'Junior Stylist', experience: '2 Years', rating: 4.5, avatar: 'https://i.pravatar.cc/150?u=aria' },
];

export default function TeamPage() {
  const [team, setTeam] = useState(initialTeam);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    experience: '',
    rating: 5.0,
    avatar: ''
  });

  const handleOpenModal = (member = null) => {
    if (member) {
      setCurrentMember(member);
      setFormData({ ...member });
    } else {
      setCurrentMember(null);
      setFormData({ name: '', role: '', experience: '', rating: 5.0, avatar: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (currentMember) {
      setTeam(team.map(m => m.id === currentMember.id ? { ...formData, id: m.id } : m));
    } else {
      setTeam([...team, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Remove this specialist from the directory?')) {
      setTeam(team.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Manage Team</h1>
          <p className="text-zinc-500 mt-1">Directory of Velvet Rouge specialists.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-maroon text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-maroon/90 transition-all shadow-lg shadow-maroon/20 active:scale-95"
        >
          <Plus size={20} />
          <span>Add Specialist</span>
        </button>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search specialists..." 
              className="w-full pl-12 pr-4 py-3 bg-zebra border-none rounded-xl text-sm focus:ring-2 focus:ring-maroon/20 transition-all text-zinc-900 font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
                <th className="px-8 py-4 text-zinc-900">Specialist</th>
                <th className="px-8 py-4 text-zinc-900">Role</th>
                <th className="px-8 py-4 text-zinc-900">Experience</th>
                <th className="px-8 py-4 text-zinc-900">Rating</th>
                <th className="px-8 py-4 text-right text-zinc-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {team.map((member) => (
                <tr key={member.id} className="group hover:bg-zebra/50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12">
                        <Image 
                          src={member.avatar || 'https://i.pravatar.cc/150'} 
                          alt={member.name} 
                          fill
                          className="rounded-full object-cover border-2 border-white shadow-md group-hover:border-maroon/20 transition-all"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-zinc-900 block">{member.name}</span>
                        <span className="text-zinc-400 text-xs flex items-center gap-2">
                          <Mail size={12} /> specialist@velvet.com
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="px-4 py-1 bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-widest rounded-full">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-zinc-600 font-medium">{member.experience}</td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-1 text-gold">
                      <Star size={14} fill="currentColor" />
                      <span className="font-bold">{member.rating}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(member)}
                        className="p-2 hover:bg-white rounded-xl text-zinc-400 hover:text-gold transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(member.id)}
                        className="p-2 hover:bg-white rounded-xl text-zinc-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={18} />
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
        title={currentMember ? 'Edit Specialist' : 'Add New Specialist'}
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Full Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-5 py-3 bg-zebra border-none rounded-xl focus:ring-2 focus:ring-maroon/20 text-zinc-900 font-medium"
              placeholder="e.g. Elena Vossen"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Role</label>
            <input 
              required
              type="text" 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-5 py-3 bg-zebra border-none rounded-2xl focus:ring-2 focus:ring-maroon/20 text-zinc-900 font-medium"
              placeholder="e.g. Master Stylist"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Experience</label>
              <input 
                required
                type="text" 
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="w-full px-5 py-3 bg-zebra border-none rounded-2xl focus:ring-2 focus:ring-maroon/20 text-zinc-900 font-medium"
                placeholder="e.g. 10 Years"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Rating</label>
              <input 
                required
                type="number" 
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                className="w-full px-5 py-3 bg-zebra border-none rounded-2xl focus:ring-2 focus:ring-maroon/20 text-zinc-900 font-medium"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Avatar URL</label>
            <input 
              type="text" 
              value={formData.avatar}
              onChange={(e) => setFormData({...formData, avatar: e.target.value})}
              className="w-full px-5 py-3 bg-zebra border-none rounded-2xl focus:ring-2 focus:ring-maroon/20 text-zinc-900 font-medium"
              placeholder="https://i.pravatar.cc/150"
            />
          </div>
          <button className="w-full bg-maroon text-white py-4 rounded-xl font-bold shadow-xl shadow-maroon/20 hover:bg-maroon/90 transition-all active:scale-[0.98] mt-4">
            {currentMember ? 'Update Profile' : 'Add to Team'}
          </button>
        </form>
      </Modal>
    </div>
  );
}

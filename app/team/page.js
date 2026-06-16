'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  Star,
  Edit3,
  Trash2,
  Image as LucideImage,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Modal from "../../components/Modal";
import toast from 'react-hot-toast';
import {
  useGetAllTeamQuery,
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
  useUploadTeamImageMutation,
} from '../redux/features/team/teamApi';

const emptyForm = {
  name: '',
  role: '',
  description: '',
  experience: '',
  rating: 5.0,
  image: '',
  sortOrder: 1,
  instagram: '',
};

const ImageUploadField = ({ label, currentImage, onUpload, isUploading }) => (
  <div className="space-y-1">
    <label className="block text-base font-medium text-zinc-700">{label}</label>
    <div className="flex items-center gap-4 mt-2">
      <div className="relative w-20 h-20 bg-zinc-50 rounded-full overflow-hidden border border-dashed border-zinc-300 flex items-center justify-center group hover:border-maroon transition-colors">
        {isUploading ? (
          <Loader2 size={24} className="animate-spin text-maroon" />
        ) : currentImage ? (
          <Image src={currentImage} alt="Preview" fill sizes="80px" className="object-cover" />
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
        <p className="text-base text-zinc-500 font-medium">Upload Portrait</p>
        <p className="text-[13px] text-zinc-400 mt-0.5">Recommended: 1:1 Aspect Ratio</p>
        {currentImage && (
          <p className="text-[11px] text-emerald-500 font-bold mt-1 uppercase">✓ Uploaded</p>
        )}
      </div>
    </div>
  </div>
);

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data: response, isLoading: isFetching, refetch } = useGetAllTeamQuery({
    search: searchQuery,
    page,
    limit: 10,
  });

  // Handle both array format and paginated object format
  const isArrayResponse = Array.isArray(response?.data);
  const team = isArrayResponse ? (response?.data ?? []) : (response?.data?.members ?? []);
  const pagination = isArrayResponse ? null : (response?.data?.pagination ?? null);

  const [createTeamMember, { isLoading: isCreating }] = useCreateTeamMemberMutation();
  const [updateTeamMember, { isLoading: isUpdating }] = useUpdateTeamMemberMutation();
  const [deleteTeamMember] = useDeleteTeamMemberMutation();
  const [uploadImage] = useUploadTeamImageMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const [formData, setFormData] = useState(emptyForm);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleOpenModal = (member = null) => {
    if (member) {
      setCurrentMember(member);
      setFormData({
        name: member.name ?? '',
        role: member.role ?? '',
        description: member.description ?? '',
        experience: member.experience ?? '',
        rating: member.rating ?? 5.0,
        image: member.image ?? '',
        sortOrder: member.sortOrder ?? 1,
        instagram: member.instagram ?? '',
      });
    } else {
      setCurrentMember(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsImageUploading(true);
    try {
      const res = await uploadImage({ file }).unwrap();
      const url = res?.data?.url;
      if (url) {
        setFormData((prev) => ({ ...prev, image: url }));
        toast.success('Portrait uploaded successfully!');
      }
    } catch {
      toast.error('Image upload failed. Please try again.');
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (currentMember) {
        await updateTeamMember({ id: currentMember._id, ...formData }).unwrap();
        toast.success('Specialist profile updated!');
      } else {
        await createTeamMember(formData).unwrap();
        toast.success('Specialist added to the team!');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message ?? 'Something went wrong. Please try again.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Remove ${name} from the directory? This action cannot be undone.`)) return;
    try {
      await deleteTeamMember(id).unwrap();
      toast.success('Specialist removed successfully.');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete team member.');
    }
  };

  const handleToggleActive = async (member) => {
    try {
      await updateTeamMember({ id: member._id, isActive: !member.isActive }).unwrap();
      toast.success(`Profile ${!member.isActive ? 'activated' : 'deactivated'}.`);
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const isSaving = isCreating || isUpdating;

  // Fallback: If backend doesn't return pagination, it means it returned all data. 
  // We should filter locally in this case.
  const filteredTeam = pagination ? team : team.filter((m) =>
    m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#fcfbf9]/90 backdrop-blur-md pb-4 pt-2 -mx-8 px-8 border-b border-zinc-100/50">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Manage Team</h1>
          <p className="text-zinc-500 mt-1 text-base">Directory of Velvet Rouge specialists.</p>
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
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-white">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Search specialists..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1); // Reset to page 1 on new search
              }}
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-maroon focus:border-maroon transition-all text-zinc-900"
            />
          </div>
        </div>

        {isFetching ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-center space-y-3">
              <Loader2 size={32} className="animate-spin text-maroon mx-auto" />
              <p className="text-zinc-500 text-base font-medium">Loading specialists...</p>
            </div>
          </div>
        ) : filteredTeam.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <Users size={36} className="text-zinc-300" />
            <p className="text-zinc-400 text-base font-medium">No specialists found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-zinc-500 text-[13px] uppercase tracking-wider font-bold border-b border-zinc-100">
                  <th className="px-8 py-5">Specialist</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5">Experience</th>
                  <th className="px-8 py-5">Rating</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredTeam.map((member) => (
                  <tr key={member._id} className="group hover:bg-zinc-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12">
                          {member.image ? (
                            <Image
                              src={member.image}
                              alt={member.name}
                              fill
                              sizes="48px"
                              className="rounded-full object-cover border border-zinc-200 shadow-sm"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
                              <LucideImage size={20} className="text-zinc-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-zinc-900 block text-base">{member.name}</span>
                          {member.instagram ? (
                            <a
                              href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#E1306C] text-[13px] flex items-center gap-1 mt-0.5 hover:underline"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                              </svg>
                              @{member.instagram.replace('@', '')}
                            </a>
                          ) : (
                            <span className="text-zinc-400 text-[13px] mt-0.5 block">No Instagram</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-4 py-1.5 bg-gold/10 text-gold text-[12px] font-bold uppercase tracking-widest rounded-full border border-gold/20">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-zinc-600 font-medium text-[15px]">{member.experience}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1.5 text-gold bg-gold/5 w-fit px-3 py-1 rounded-full border border-gold/10">
                        <Star size={14} fill="currentColor" />
                        <span className="font-bold text-[13px]">{member.rating}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <button
                        onClick={() => handleToggleActive(member)}
                        className="flex items-center gap-2 text-[13px] font-bold transition-colors"
                      >
                        {member.isActive ? (
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
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(member)}
                          className="p-2.5 hover:bg-white rounded-xl text-zinc-400 hover:text-gold transition-all border border-transparent hover:border-zinc-200 hover:shadow-sm"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(member._id, member.name)}
                          className="p-2.5 hover:bg-white rounded-xl text-zinc-400 hover:text-red-500 transition-all border border-transparent hover:border-zinc-200 hover:shadow-sm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {pagination && (
              <div className="p-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <span className="text-sm text-zinc-500 font-medium">
                  Showing page {pagination.page} of {pagination.totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!pagination.hasPrev}
                    className="px-4 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-lg text-sm font-semibold disabled:opacity-50 transition-all hover:bg-zinc-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!pagination.hasNext}
                    className="px-4 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-lg text-sm font-semibold disabled:opacity-50 transition-all hover:bg-zinc-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentMember ? 'Edit Specialist' : 'Add New Specialist'}
      >
        <form onSubmit={handleSave} className="space-y-6">
          <ImageUploadField
            label="Specialist Portrait"
            currentImage={formData.image}
            onUpload={handleImageUpload}
            isUploading={isImageUploading}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-base font-medium text-zinc-700">Full Name *</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-base text-zinc-900"
                placeholder="e.g. Elena Vossen"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-base font-medium text-zinc-700">Role *</label>
              <input
                required
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-base text-zinc-900"
                placeholder="e.g. Master Stylist"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-base font-medium text-zinc-700">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-base text-zinc-900"
              placeholder="Short bio or expertise..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-base font-medium text-zinc-700">Experience *</label>
              <input
                required
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-base text-zinc-900"
                placeholder="e.g. 10 Years"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-base font-medium text-zinc-700">Rating *</label>
              <input
                required
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-base text-zinc-900"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-base font-medium text-zinc-700">Sort Order</label>
              <input
                required
                type="number"
                min="1"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-base text-zinc-900"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-1">
            <label className="block text-base font-medium text-zinc-700">
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E1306C]">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                Instagram Handle
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium">@</span>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-[#E1306C] focus:ring-1 focus:ring-[#E1306C]/30 text-base text-zinc-900 transition-all"
                placeholder="username"
              />
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-zinc-100">
            <button
              type="submit"
              disabled={isSaving || isImageUploading}
              className="w-full bg-maroon text-white py-3 rounded-lg font-semibold shadow hover:bg-maroon/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving && <Loader2 size={18} className="animate-spin" />}
              {currentMember ? 'Update Profile' : 'Add to Team'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

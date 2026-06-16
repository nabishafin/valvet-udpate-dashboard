'use client';

import { useState } from 'react';
import {
  Search,
  Trash2,
  Loader2,
  Mail,
  Users,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import {
  useGetAllSubscribersQuery,
  useGetSubscriberCountQuery,
  useUpdateSubscriberStatusMutation,
  useDeleteSubscriberMutation,
} from '../redux/features/subscribers/subscribersApi';

const STATUS_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Unsubscribed', value: 'unsubscribed' },
];

export default function SubscribersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: response, isLoading: isFetching } = useGetAllSubscribersQuery({
    search: searchQuery,
    status: statusFilter,
    page,
    limit: 10,
  });

  const { data: totalData } = useGetSubscriberCountQuery('');
  const { data: activeData } = useGetSubscriberCountQuery('active');
  const { data: unsubData } = useGetSubscriberCountQuery('unsubscribed');

  const [updateStatus] = useUpdateSubscriberStatusMutation();
  const [deleteSubscriber] = useDeleteSubscriberMutation();

  const subscribers = response?.data?.subscribers ?? response?.subscribers ?? [];
  const pagination = response?.data?.pagination ?? response?.pagination ?? null;

  const totalCount = totalData?.data?.pagination?.total ?? totalData?.pagination?.total ?? 0;
  const activeCount = activeData?.data?.pagination?.total ?? activeData?.pagination?.total ?? 0;
  const unsubCount = unsubData?.data?.pagination?.total ?? unsubData?.pagination?.total ?? 0;

  const handleToggleStatus = async (sub) => {
    const next = sub.status === 'active' ? 'unsubscribed' : 'active';
    try {
      await updateStatus({ id: sub._id, status: next }).unwrap();
      toast.success(`Marked as ${next}.`);
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteSubscriber(deleteTarget.id).unwrap();
      toast.success('Subscriber removed.');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete subscriber.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (str) => {
    if (!str) return '—';
    return new Date(str).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const stats = [
    {
      label: 'Total Subscribers',
      value: totalCount,
      icon: Users,
      bg: 'bg-maroon/8',
      iconColor: 'text-maroon',
      border: 'border-maroon/10',
    },
    {
      label: 'Active',
      value: activeCount,
      icon: UserCheck,
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      border: 'border-emerald-100',
    },
    {
      label: 'Unsubscribed',
      value: unsubCount,
      icon: UserX,
      bg: 'bg-zinc-50',
      iconColor: 'text-zinc-400',
      border: 'border-zinc-100',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#fcfbf9]/90 backdrop-blur-md pb-4 pt-2 -mx-8 px-8 border-b border-zinc-100/50">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-widest text-maroon mb-1">Velvet Rouge</p>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Subscribers</h1>
          <p className="text-zinc-400 mt-1 text-sm">Manage email newsletter subscribers.</p>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`bg-white rounded-3xl border ${s.border} shadow-sm p-6 flex items-center gap-5`}>
              <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={26} className={s.iconColor} />
              </div>
              <div>
                <p className="text-3xl font-black text-zinc-900">{s.value.toLocaleString()}</p>
                <p className="text-zinc-400 text-sm font-medium mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={17} />
            <input
              type="text"
              placeholder="Search by email…"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-maroon focus:border-maroon transition-all text-zinc-900"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => { setStatusFilter(f.value); setPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  statusFilter === f.value
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        {isFetching ? (
          <div className="flex items-center justify-center h-52">
            <div className="text-center space-y-3">
              <Loader2 size={32} className="animate-spin text-maroon mx-auto" />
              <p className="text-zinc-400 text-sm font-medium">Loading subscribers…</p>
            </div>
          </div>
        ) : subscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-52 gap-3">
            <Mail size={36} className="text-zinc-200" />
            <p className="text-zinc-400 text-sm font-medium">No subscribers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-zinc-900 text-[10px] uppercase tracking-[0.2em] font-black border-b border-zinc-50">
                  <th className="px-8 py-5">Email</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Subscribed Date</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {subscribers.map((sub) => (
                  <tr key={sub._id} className="group hover:bg-zinc-50/40 transition-colors">
                    {/* Email */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-maroon/8 flex items-center justify-center flex-shrink-0">
                          <Mail size={15} className="text-maroon" />
                        </div>
                        <span className="font-semibold text-zinc-800 text-sm">{sub.email}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-8 py-5">
                      <button
                        onClick={() => handleToggleStatus(sub)}
                        title="Click to toggle status"
                        className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border transition-all hover:opacity-80 ${
                          sub.status === 'active'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : 'bg-zinc-50 text-zinc-500 border-zinc-200'
                        }`}
                      >
                        {sub.status === 'active' ? 'Active' : 'Unsubscribed'}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="px-8 py-5 text-zinc-500 text-sm">
                      {formatDate(sub.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => setDeleteTarget({ id: sub._id, email: sub.email })}
                          title="Delete"
                          className="p-2.5 rounded-lg text-zinc-300 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="p-5 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <span className="text-sm text-zinc-500 font-medium">
                  Page {pagination.page} of {pagination.totalPages}
                  <span className="text-zinc-400 ml-2">({pagination.total?.toLocaleString()} total)</span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!pagination.hasPrev}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-xl text-sm font-semibold disabled:opacity-40 transition-all hover:bg-zinc-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={15} />
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!pagination.hasNext}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-xl text-sm font-semibold disabled:opacity-40 transition-all hover:bg-zinc-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        title="Remove Subscriber"
      >
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-5 bg-red-50 rounded-2xl border border-red-100">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <div>
              <p className="font-bold text-zinc-900">Are you sure?</p>
              <p className="text-zinc-500 text-sm mt-1 leading-relaxed">
                <span className="font-semibold text-zinc-700">{deleteTarget?.email}</span>
                {' '}will be permanently removed from the subscriber list.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
              className="flex-1 py-3 px-4 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-xl font-bold transition-colors border border-zinc-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isDeleting && <Loader2 size={16} className="animate-spin" />}
              Remove
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

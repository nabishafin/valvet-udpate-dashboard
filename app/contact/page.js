'use client';

import { useState } from 'react';
import {
  Search,
  Trash2,
  Loader2,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import {
  useGetAllContactQuery,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
} from '../redux/features/contact/contactApi';

const STATUS_FILTERS = [
  { label: 'All',        value: '' },
  { label: 'New',        value: 'new' },
  { label: 'Pending',    value: 'pending' },
  { label: 'Resolved',   value: 'resolved' },
];

const STATUS_STYLE = {
  new:        'bg-blue-50 text-blue-600 border-blue-200',
  pending:    'bg-amber-50 text-amber-600 border-amber-200',
  resolved:   'bg-emerald-50 text-emerald-600 border-emerald-200',
};

export default function ContactPage() {
  const [searchQuery, setSearchQuery]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage]                 = useState(1);
  const [expandedId, setExpandedId]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting]     = useState(false);

  const { data: response, isLoading: isFetching } = useGetAllContactQuery({
    search: searchQuery,
    status: statusFilter,
    page,
    limit: 10,
  });

  const [updateStatus] = useUpdateContactStatusMutation();
  const [deleteContact] = useDeleteContactMutation();

  const messages   = response?.data?.messages ?? response?.data?.contacts ?? response?.data ?? [];
  const pagination = response?.data?.pagination ?? null;

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Marked as ${status}.`);
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteContact(deleteTarget.id).unwrap();
      toast.success('Message deleted.');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete message.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (str) => {
    if (!str) return '—';
    return new Date(str).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#fcfbf9]/90 backdrop-blur-md pb-4 pt-2 -mx-8 px-8 border-b border-zinc-100/50">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-widest text-maroon mb-1">Velvet Rouge</p>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Contact Messages</h1>
          <p className="text-zinc-400 mt-1 text-sm">Incoming messages from the website contact form.</p>
        </div>
      </header>

      {/* Table card */}
      <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={17} />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-maroon focus:border-maroon transition-all text-zinc-900"
            />
          </div>
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
              <p className="text-zinc-400 text-sm font-medium">Loading messages…</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-52 gap-3">
            <MessageSquare size={36} className="text-zinc-200" />
            <p className="text-zinc-400 text-sm font-medium">No messages found.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {messages.map((msg) => {
              const isExpanded = expandedId === msg._id;
              return (
                <div key={msg._id} className="hover:bg-zinc-50/40 transition-colors">
                  {/* Row */}
                  <div className="px-8 py-5 flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-maroon/8 flex items-center justify-center flex-shrink-0">
                      <MessageSquare size={16} className="text-maroon" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-bold text-zinc-900 text-sm">{msg.name || '—'}</p>
                        {msg.email && (
                          <span className="text-zinc-400 text-xs">{msg.email}</span>
                        )}
                        {msg.phone && (
                          <span className="text-zinc-400 text-xs">{msg.phone}</span>
                        )}
                      </div>
                      {msg.subject && (
                        <p className="text-zinc-500 text-sm mt-0.5 truncate">{msg.subject}</p>
                      )}
                      <p className="text-zinc-400 text-xs mt-0.5">{formatDate(msg.createdAt)}</p>
                    </div>

                    {/* Status badge */}
                    <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border flex-shrink-0 ${STATUS_STYLE[msg.status] ?? 'bg-zinc-50 text-zinc-500 border-zinc-200'}`}>
                      {msg.status || 'new'}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleStatusChange(msg._id, 'pending')}
                        title="Mark as pending"
                        className="p-2 rounded-lg text-zinc-300 hover:bg-amber-50 hover:text-amber-500 transition-all border border-transparent hover:border-amber-100"
                      >
                        <Clock size={16} />
                      </button>
                      <button
                        onClick={() => handleStatusChange(msg._id, 'resolved')}
                        title="Mark as resolved"
                        className="p-2 rounded-lg text-zinc-300 hover:bg-emerald-50 hover:text-emerald-500 transition-all border border-transparent hover:border-emerald-100"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: msg._id, name: msg.name })}
                        title="Delete"
                        className="p-2 rounded-lg text-zinc-300 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : msg._id)}
                        className="p-2 rounded-lg text-zinc-300 hover:bg-zinc-100 hover:text-zinc-600 transition-all"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded message body */}
                  {isExpanded && msg.message && (
                    <div className="px-8 pb-6">
                      <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Message</p>
                        <p className="text-zinc-700 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="p-5 flex items-center justify-between bg-zinc-50/50">
                <span className="text-sm text-zinc-500 font-medium">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!pagination.hasPrev}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-zinc-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={15} /> Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!pagination.hasNext}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-zinc-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        title="Delete Message"
      >
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-5 bg-red-50 rounded-2xl border border-red-100">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <div>
              <p className="font-bold text-zinc-900">Delete this message?</p>
              <p className="text-zinc-500 text-sm mt-1">
                Message from <span className="font-semibold text-zinc-700">{deleteTarget?.name}</span> will be permanently removed.
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
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

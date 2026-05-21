'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Search, 
  CheckCircle2, 
  Trash2,
  Calendar,
  Loader2,
  Mail,
  Zap,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useGetAllInstantBookingsQuery,
  useUpdateInstantBookingStatusMutation,
  useDeleteInstantBookingMutation,
} from '../redux/features/instantBookings/instantBookingsApi';

export default function InstantBookingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'new', 'pending', 'resolved'
  const [page, setPage] = useState(1);

  const { data: response, isLoading: isFetching } = useGetAllInstantBookingsQuery({
    search: searchQuery,
    status: statusFilter,
    page,
    limit: 10,
  });

  const bookings = response?.data?.messages ?? response?.data?.bookings ?? [];
  const pagination = response?.data?.pagination ?? null;

  const [updateStatus] = useUpdateInstantBookingStatusMutation();
  const [deleteBooking] = useDeleteInstantBookingMutation();

  const handleDelete = async (id, name) => {
    if (confirm(`Delete instant booking from ${name}?`)) {
      try {
        await deleteBooking(id).unwrap();
        toast.success('Booking deleted.');
      } catch {
        toast.error('Failed to delete booking.');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(`Booking marked as ${newStatus}.`);
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#fcfbf9]/90 backdrop-blur-md pb-4 pt-2 -mx-8 px-8 border-b border-zinc-100/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={20} className="text-[#BA8C43] fill-[#BA8C43]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-maroon">Priority Access</span>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Instant Bookings</h1>
          <p className="text-zinc-500 mt-1 text-base">Process high-priority studio reservations.</p>
        </div>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-white">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by client or studio..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-maroon focus:border-maroon transition-all text-zinc-900"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'new', 'pending', 'resolved'].map((status) => (
              <button 
                key={status}
                onClick={() => { setStatusFilter(status); setPage(1); }}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                  statusFilter === status ? 'bg-maroon text-white shadow' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {isFetching ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-center space-y-3">
              <Loader2 size={32} className="animate-spin text-maroon mx-auto" />
              <p className="text-zinc-500 text-base font-medium">Loading bookings...</p>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <Clock size={36} className="text-zinc-300" />
            <p className="text-zinc-400 text-base font-medium">No instant bookings found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-zinc-500 text-[13px] uppercase tracking-wider font-bold border-b border-zinc-100">
                  <th className="px-8 py-5">Client & Service</th>
                  <th className="px-8 py-5">Assigned Specialist</th>
                  <th className="px-8 py-5">Requested Date</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="group hover:bg-zinc-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-900 block text-base">{booking.name || 'Anonymous'}</span>
                          <span className="px-2 py-0.5 bg-[#BA8C43]/10 text-[#BA8C43] text-[10px] font-bold rounded uppercase">
                            {booking.service}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          {booking.email && (
                            <span className="text-zinc-500 text-[13px] flex items-center gap-1.5">
                              <Mail size={12} className="text-zinc-400" /> {booking.email}
                            </span>
                          )}
                          {booking.phone && (
                            <span className="text-zinc-500 text-[13px]">{booking.phone}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Assigned Specialist */}
                    <td className="px-8 py-5">
                      {booking.teamMemberId ? (
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-zinc-100 shadow-sm flex-shrink-0">
                            {booking.teamMemberId.image ? (
                              <Image src={booking.teamMemberId.image} alt={booking.teamMemberName} fill sizes="36px" className="object-cover" />
                            ) : (
                              <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs font-bold">
                                {(booking.teamMemberName || 'U').charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-zinc-900 text-sm block">{booking.teamMemberName || booking.teamMemberId.name}</span>
                            <span className="text-zinc-400 text-[12px]">{booking.teamMemberId.role}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-zinc-400 text-sm italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-8 py-5 font-medium text-zinc-700 text-[15px]">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-maroon" />
                        {formatDate(booking.date)}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 text-[12px] font-bold uppercase tracking-widest rounded-full flex items-center w-fit border ${
                        booking.status === 'new' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                        booking.status === 'pending' ? 'bg-gold/10 text-gold border-gold/20' :
                        'bg-emerald-50 text-emerald-600 border-emerald-200'
                      }`}>
                        {booking.status === 'new' && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse mr-1.5" />}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2">
                        {booking.status !== 'pending' && booking.status !== 'resolved' && (
                          <button 
                            onClick={() => handleStatusChange(booking._id, 'pending')}
                            className="p-2.5 hover:bg-gold/5 rounded-lg text-zinc-400 hover:text-gold transition-all border border-transparent hover:border-gold/20"
                            title="Mark as Pending"
                          >
                            <div className="w-[18px] h-[18px] border-2 border-current border-t-transparent rounded-full animate-spin" />
                          </button>
                        )}
                        {booking.status !== 'resolved' && (
                          <button 
                            onClick={() => handleStatusChange(booking._id, 'resolved')}
                            className="p-2.5 hover:bg-emerald-50 rounded-lg text-zinc-400 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-200"
                            title="Mark as Resolved"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(booking._id, booking.name)}
                          className="p-2.5 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-500 transition-all border border-transparent hover:border-red-200"
                          title="Delete"
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
            {pagination && pagination.totalPages > 1 && (
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
    </div>
  );
}

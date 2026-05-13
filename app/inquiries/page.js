'use client';

import { useState } from 'react';
import { 
  Search, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Trash2,
  Mail,
  User,
  Calendar
} from 'lucide-react';

const initialInquiries = [
  { id: 1, name: 'Sarah Jenkins', service: 'Maroon Suite', date: 'May 12, 2026', status: 'New', message: 'I would like to book a session for next Friday at 4 PM.' },
  { id: 2, name: 'Michael Ross', service: 'Gold Studio', date: 'May 11, 2026', status: 'Pending', message: 'Is there a discount for group bookings of 5 or more?' },
  { id: 3, name: 'David Gandy', service: 'Velvet Lounge', date: 'May 10, 2026', status: 'Resolved', message: 'Thank you for the amazing service yesterday!' },
  { id: 4, name: 'Emma Watson', service: 'Rouge Parlor', date: 'May 09, 2026', status: 'New', message: 'Can I reschedule my appointment from tomorrow to Sunday?' },
  { id: 5, name: 'Tom Hardy', service: 'Imperial Hall', date: 'May 08, 2026', status: 'Resolved', message: 'The event was a huge success. Thanks to the whole team.' },
];

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState(initialInquiries);

  const handleDelete = (id) => {
    if (confirm('Delete this inquiry?')) {
      setInquiries(inquiries.filter(i => i.id !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setInquiries(inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900">Client Inquiries</h1>
        <p className="text-zinc-500 mt-1">Manage client messages and booking requests.</p>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full pl-12 pr-4 py-3 bg-zebra border-none rounded-xl text-sm focus:ring-2 focus:ring-maroon/20 transition-all text-zinc-900 font-medium"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-maroon/5 text-maroon text-xs font-bold rounded-lg border border-maroon/10">All Messages</button>
            <button className="px-4 py-2 text-zinc-400 text-xs font-bold rounded-lg hover:bg-zinc-50 transition-colors">New Only</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
                <th className="px-8 py-4 text-zinc-900">Client</th>
                <th className="px-8 py-4 text-zinc-900">Service</th>
                <th className="px-8 py-4 text-zinc-900">Message</th>
                <th className="px-8 py-4 text-zinc-900">Status</th>
                <th className="px-8 py-4 text-right text-zinc-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="group hover:bg-zebra/50 transition-colors">
                  <td className="px-8 py-4">
                    <div>
                      <span className="font-bold text-zinc-900 block">{inquiry.name}</span>
                      <span className="text-zinc-400 text-[10px] flex items-center gap-1">
                        <Calendar size={10} /> {inquiry.date}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-4 font-semibold text-zinc-700 text-sm">{inquiry.service}</td>
                  <td className="px-8 py-4 max-w-xs">
                    <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed italic">
                      &quot;{inquiry.message}&quot;
                    </p>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5 w-fit ${
                      inquiry.status === 'New' ? 'bg-maroon/10 text-maroon' :
                      inquiry.status === 'Pending' ? 'bg-gold/10 text-gold' :
                      'bg-green-50 text-green-600'
                    }`}>
                      {inquiry.status === 'New' && <div className="w-1.5 h-1.5 bg-maroon rounded-full animate-pulse" />}
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleStatusChange(inquiry.id, 'Resolved')}
                        className="p-2 hover:bg-white rounded-xl text-zinc-400 hover:text-green-600 transition-all"
                        title="Mark as Resolved"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(inquiry.id)}
                        className="p-2 hover:bg-white rounded-xl text-zinc-400 hover:text-red-500 transition-all"
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
        </div>
      </div>
    </div>
  );
}

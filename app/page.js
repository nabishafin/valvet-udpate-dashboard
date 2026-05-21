'use client';

import { useGetDashboardStatsQuery } from './redux/features/adminOverview/adminOverviewApi';
import StatsCard from '../components/StatsCard';
import TrafficChart from '../components/TrafficChart';
import { Eye, Users, TrendingUp, Calendar, Building2, UsersRound, MessageSquare, Clock, Zap } from 'lucide-react';

export default function Dashboard() {
  const { data: response, isLoading, isError, refetch } = useGetDashboardStatsQuery(undefined, {
    refetchOnMountOrArgChange: true, // Always fetch latest data when component mounts
  });
  const stats = response?.data;

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#fcfbf9]/90 backdrop-blur-md pb-4 pt-2 -mx-8 px-8 border-b border-zinc-100/50">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-maroon mb-1">Velvet Rouge</p>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-zinc-400 mt-1 text-sm">Here&apos;s what&apos;s happening at your studios today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2.5 rounded-2xl border border-zinc-100 flex items-center gap-2 text-zinc-600 shadow-sm text-sm font-semibold">
            <Calendar size={16} className="text-maroon" />
            <span>{today}</span>
          </div>
        </div>
      </header>

      {/* Primary Stats — 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatsCard
          title="Total Hits"
          value={isLoading ? null : stats?.totalHits?.toLocaleString() ?? '0'}
          icon={Eye}
          trend={stats?.hitsTrend ?? null}
          isLoading={isLoading}
        />
        <StatsCard
          title="Live Visitors"
          value={isLoading ? null : stats?.liveVisitors ?? '0'}
          icon={Users}
          isLive={true}
          isLoading={isLoading}
        />
        <StatsCard
          title="Avg. Session"
          value={isLoading ? null : stats?.avgSession ?? '—'}
          icon={TrendingUp}
          trend={stats?.sessionTrend ?? null}
          isLoading={isLoading}
        />
      </div>

      {/* Operational Metrics Panel */}
      <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Operational Metrics</h2>
            <p className="text-sm text-zinc-500 mt-0.5">Quick overview of your studio entities and bookings.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-100">
          {/* Total Studios */}
          <div className="p-8 flex flex-col items-center text-center group hover:bg-zinc-50/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#BA8C43]/10 text-[#BA8C43] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2 size={24} />
            </div>
            {isLoading ? (
              <div className="h-8 w-16 bg-zinc-100 rounded-lg animate-pulse mb-1" />
            ) : (
              <span className="text-3xl font-black text-zinc-900 mb-1">{stats?.totalStudios ?? '0'}</span>
            )}
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Total Studios</span>
          </div>

          {/* Team Members */}
          <div className="p-8 flex flex-col items-center text-center group hover:bg-zinc-50/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-maroon/10 text-maroon flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UsersRound size={24} />
            </div>
            {isLoading ? (
              <div className="h-8 w-16 bg-zinc-100 rounded-lg animate-pulse mb-1" />
            ) : (
              <span className="text-3xl font-black text-zinc-900 mb-1">{stats?.totalTeam ?? '0'}</span>
            )}
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Team Members</span>
          </div>

          {/* Instant Bookings */}
          <div className="p-8 flex flex-col items-center text-center group hover:bg-zinc-50/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap size={24} />
            </div>
            {isLoading ? (
              <div className="h-8 w-16 bg-zinc-100 rounded-lg animate-pulse mb-1" />
            ) : (
              <span className="text-3xl font-black text-zinc-900 mb-1">{stats?.totalInstantBookings ?? '0'}</span>
            )}
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Total Bookings</span>
          </div>

          {/* New Bookings */}
          <div className="p-8 flex flex-col items-center text-center group hover:bg-zinc-50/50 transition-colors relative">
            {stats?.newInstantBookingsThisWeek > 0 && (
              <div className="absolute top-6 right-6 px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100">
                +{stats.newInstantBookingsThisWeek} New
              </div>
            )}
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock size={24} />
            </div>
            {isLoading ? (
              <div className="h-8 w-16 bg-zinc-100 rounded-lg animate-pulse mb-1" />
            ) : (
              <span className="text-3xl font-black text-zinc-900 mb-1">{stats?.newInstantBookingsThisWeek ?? '0'}</span>
            )}
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">This Week</span>
          </div>
        </div>
      </div>


      {/* Traffic Chart */}
      <TrafficChart
        trafficTrend={stats?.trafficTrend ?? []}
        isLoading={isLoading}
      />

      {/* Luxury Insights Banner */}
      <section className="bg-maroon rounded-3xl p-10 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.08),transparent)]" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 border-[40px] border-white/5 rounded-full" />

        <div className="relative z-10 max-w-lg">
          <p className="text-xs font-bold uppercase tracking-widest text-gold mb-3">Luxury Insights</p>
          <h2 className="text-3xl font-black mb-4 leading-tight">
            Your Studio <br />
            <span className="text-white/40">at a Glance</span>
          </h2>
          <p className="opacity-60 leading-relaxed text-sm">
            {isError
              ? 'Could not load live insights. Please check your connection.'
              : `Stay on top of your luxury studio operations with real-time insights.`
            }
          </p>
          <button className="mt-8 bg-gold hover:bg-gold/90 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-gold/20 text-sm uppercase tracking-wider">
            View Full Report
          </button>
        </div>
      </section>
    </div>
  );
}

import StatsCard from "../components/StatsCard";
import TrafficChart from "../components/TrafficChart";
import { Eye, Users, TrendingUp, Calendar } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Dashboard Overview</h1>
          <p className="text-zinc-500 mt-1">Welcome back to Velvet Rouge Admin.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-2xl border border-zinc-100 flex items-center gap-2 text-zinc-600 shadow-sm text-sm">
            <Calendar size={18} />
            <span>May 13, 2026</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Hits" 
          value="124,592" 
          icon={Eye} 
          trend="+12.5%" 
        />
        <StatsCard 
          title="Live Visitors" 
          value="42" 
          icon={Users} 
          isLive={true} 
        />
        <StatsCard 
          title="Avg. Session" 
          value="4m 32s" 
          icon={TrendingUp} 
          trend="+2.4%" 
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <TrafficChart />
      </div>

      <section className="bg-maroon rounded-3xl p-10 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl font-bold mb-4">Luxury Insights</h2>
          <p className="text-maroon-100 opacity-80 leading-relaxed">
            Your traffic has grown by 15% this week. The &quot;Maroon Suite&quot; is currently your most viewed service. Consider updating the team availability for the weekend.
          </p>
          <button className="mt-8 bg-gold hover:bg-gold/90 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-gold/20">
            View Full Report
          </button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 translate-x-20" />
      </section>
    </div>
  );
}

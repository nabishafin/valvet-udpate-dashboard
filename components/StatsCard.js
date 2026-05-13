import { TrendingUp, Users, Eye } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, isLive }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex flex-col gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 bg-zebra rounded-xl flex items-center justify-center text-maroon group-hover:bg-maroon group-hover:text-white transition-colors">
          <Icon size={24} />
        </div>
        {isLive && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            LIVE
          </div>
        )}
      </div>
      <div>
        <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-zinc-900 mt-1">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;

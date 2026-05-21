'use client';

const StatsCard = ({ title, value, icon: Icon, trend, isLive, isLoading, accent = false }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl ${
      accent 
        ? 'bg-maroon border-maroon text-white shadow-lg shadow-maroon/20' 
        : 'bg-white border-zinc-100 shadow-sm hover:border-zinc-200'
    }`}>
      {/* Decorative background orb */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl transition-opacity ${
        accent ? 'bg-white/10' : 'bg-maroon/5 group-hover:bg-maroon/10'
      }`} />

      <div className="relative p-6">
        {/* Top row: icon + badge */}
        <div className="flex items-start justify-between mb-5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
            accent 
              ? 'bg-white/15' 
              : 'bg-zebra group-hover:bg-maroon group-hover:text-white text-maroon'
          }`}>
            <Icon size={20} />
          </div>

          {isLive && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              LIVE
            </div>
          )}

          {trend && !isLive && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              accent 
                ? 'bg-white/15 text-white' 
                : 'bg-emerald-50 text-emerald-600'
            }`}>
              {trend}
            </span>
          )}
        </div>

        {/* Value */}
        <div>
          {isLoading ? (
            <div className="space-y-2">
              <div className={`h-8 w-24 rounded-lg animate-pulse ${accent ? 'bg-white/20' : 'bg-zinc-100'}`} />
              <div className={`h-3 w-16 rounded-lg animate-pulse ${accent ? 'bg-white/10' : 'bg-zinc-100'}`} />
            </div>
          ) : (
            <>
              <p className={`text-3xl font-black tracking-tight ${accent ? 'text-white' : 'text-zinc-900'}`}>
                {value ?? '—'}
              </p>
              <p className={`text-xs font-semibold uppercase tracking-widest mt-1.5 ${
                accent ? 'text-white/60' : 'text-zinc-400'
              }`}>
                {title}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Bottom accent bar */}
      {!accent && (
        <div className="h-0.5 bg-gradient-to-r from-maroon/0 via-maroon/30 to-maroon/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </div>
  );
};

export default StatsCard;

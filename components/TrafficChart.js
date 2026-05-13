'use client';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { day: '01', views: 400 },
  { day: '05', views: 800 },
  { day: '10', views: 600 },
  { day: '15', views: 1200 },
  { day: '20', views: 900 },
  { day: '25', views: 1600 },
  { day: '30', views: 2100 },
];

const TrafficChart = () => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 h-[400px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-zinc-900">Traffic Trend</h3>
          <p className="text-zinc-500 text-sm">Website hits for the last 30 days</p>
        </div>
        <select className="bg-zebra border-none text-zinc-600 text-sm rounded-xl px-4 py-2 focus:ring-0">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
        </select>
      </div>
      
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#BA8C43" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#BA8C43" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
              }}
            />
            <Area 
              type="monotone" 
              dataKey="views" 
              stroke="#BA8C43" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorViews)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrafficChart;

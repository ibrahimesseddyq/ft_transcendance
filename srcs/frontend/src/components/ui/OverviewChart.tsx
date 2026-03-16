import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export default function OverviewChart({ data }: any) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center text-gray-400 text-sm italic">
        No data available for this period
      </div>
    );
  }

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#334155"
            opacity={0.1}
          />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#9ca3af', fontSize: 10}} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#9ca3af', fontSize: 10}} 
            allowDecimals={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              borderRadius: '8px', 
              border: 'none', 
              color: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)' 
            }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend verticalAlign="top" align="right" height={36}/>
          <Line 
            type="monotone" 
            dataKey="uv"
            stroke="#1194b1" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#1194b1', strokeWidth: 2 }} 
            activeDot={{ r: 6, strokeWidth: 0 }} 
            name="Applications" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
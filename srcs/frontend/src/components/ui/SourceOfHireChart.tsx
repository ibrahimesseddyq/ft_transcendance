import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#1194b1', '#12cf91', '#3b82f6', '#8b5cf6', '#f59e0b'];

export default function SourceOfHireChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" opacity={0.1} />
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={100} 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
        />
        <Tooltip 
          cursor={{ fill: 'transparent' }}
          contentStyle={{ 
            backgroundColor: '#1e293b', 
            border: 'none', 
            borderRadius: '8px',
            color: '#fff',
            fontSize: '12px'
          }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={25}>
          {/* {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))} */}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
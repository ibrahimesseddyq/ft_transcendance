import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: '1',
    uv: 400,
    pv: 2400,
    amt: 2400,
  },
  {
    name: '2',
    uv: 300,
    pv: 4567,
    amt: 2400,
  },
  {
    name: '3',
    uv: 320,
    pv: 1398,
    amt: 2400,
  },
  {
    name: '4',
    uv: 200,
    pv: 9800,
    amt: 2400,
  },
  {
    name: '5',
    uv: 278,
    pv: 3908,
    amt: 2400,
  },
  {
    name: '6',
    uv: 189,
    pv: 4800,
    amt: 2400,
  },
  {
    name: '7',
    uv: 400,
    pv: 2400,
    amt: 2400,
  },
  {
    name: '8',
    uv: 300,
    pv: 4567,
    amt: 2400,
  },
  {
    name: '9',
    uv: 320,
    pv: 1398,
    amt: 2400,
  },
  {
    name: '10',
    uv: 200,
    pv: 9800,
    amt: 2400,
  },
  {
    name: '11',
    uv: 278,
    pv: 3908,
    amt: 2400,
  },
  {
    name: '12',
    uv: 189,
    pv: 4800,
    amt: 2400,
  },
];

export default function OverviewChart() {
  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#9ca3af', fontSize: 12}} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#9ca3af', fontSize: 12}} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Legend verticalAlign="top" align="right" height={36}/>
          <Line 
            type="monotone" 
            dataKey="uv" 
            stroke="#1194b1" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#1194b1' }} 
            activeDot={{ r: 6 }} 
            name="Applications" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
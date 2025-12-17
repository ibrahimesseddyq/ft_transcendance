
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

  const Months = [
  {
    name: '1',
    user1: 4000,
    user2: 2400,
    amt: 2400,
  },
  {
    name: '2',
    user1: 3000,
    user2: 1398,
    amt: 2210,
  },
  {
    name: '3',
    user1: 2000,
    user2: 9800,
    amt: 2290,
  },
  {
    name: '4',
    user1: 2780,
    user2: 3908,
    amt: 2000,
  },
  {
    name: '5',
    user1: 1890,
    user2: 4800,
    amt: 2181,
  },
  {
    name: '6',
    user1: 2390,
    user2: 3800,
    amt: 2500,
  },
  {
    name: '7',
    user1: 3490,
    user2: 4300,
    amt: 2100,
  },
   {
    name: '8',
    user1: 3490,
    user2: 4300,
    amt: 2100,
  },
   {
    name: '9',
    user1: 3490,
    user2: 4300,
    amt: 2100,
  },
   {
    name: '10',
    user1: 3490,
    user2: 4300,
    amt: 2100,
  },
   {
    name: '11',
    user1: 3490,
    user2: 4300,
    amt: 2100,
  },
   {
    name: '12',
    user1: 3490,
    user2: 4300,
    amt: 2100,
  },
  
];

const stats = [
  { label: "TOTAL", value: "125,378", change: null },
  { label: "USERS", value: "10,378", change: null },
  { label: "WIN RATE", value: "38.57%", change: "2.1%" },
  { label: "SESSION DURATION", value: "3h14m", change: null },
];

const ResponsiveLineChart = () => {
  return (

      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={Months}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              className="text-xs md:text-sm"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              className="text-xs md:text-sm"
            />
            <Tooltip 
              contentStyle={{ 
                fontSize: '12px',
                borderRadius: '6px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="user1" 
              stroke="#8884d8" 
              strokeWidth={2}
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="user2" 
              stroke="#82ca9d"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
  );
};

export function StatsSection() {
  return (
    <div className="h-full w-full flex flex-col place-content-center">
        {/* Chart placeholder */}
        <div className='h-[50%] w-[95%]  mx-auto overflow-hidden'>
          <ResponsiveLineChart/>
        </div>
          
          {/* Stats grid */}
          <div className="flex justify-between w-[90%] mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xs text-yellow-500 font-medium mb-1">
                  {stat.label}
                </p>
                <p className="text-lg font-bold text-foreground text-white">{stat.value}</p>
                {stat.change && (
                  <p className="text-xs text-yellow-500">▲ {stat.change}</p>
                )}
              </div>
            ))}
          </div>
        </div>
  );
}
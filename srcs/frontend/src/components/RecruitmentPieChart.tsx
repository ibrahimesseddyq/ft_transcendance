import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  pending: '#94a3b8',
  inProgress: '#3b82f6',
  accepted: '#22c55e',
  rejected: '#ef4444',
  withdrawn: '#f59e0b',
};

export function RecruitmentPieChart({ data }: { data: any[] }) {
  const chartData = data?.map(item => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count,
    statusKey: item.status,
  })) || [];

  const totalApps = chartData.reduce((sum, item) => sum + item.value, 0);
  const activeSlices = chartData.filter(item => item.value > 0);

  const renderLegendText = (value: string, entry: any) => {
    const count = entry.payload?.value ?? 0;
    return <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{value} ({count})</span>;
  };

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col relative outline-none">
      <header className="flex items-center justify-between w-full max-h-16 border-b border-gray-50 dark:border-slate-800">
        <h3 className="text-lg font-bold text-gray-800 dark:text-surface-main ml-5 m-3">
          Recruitment Status
        </h3>
      </header>

      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart style={{ outline: 'none' }}>
            {/* Background  */}
            <Pie
              data={[{ value: 1 }]}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              fill="#e2e8f0"
              className="fill-slate-200 dark:fill-slate-800 outline-none"
              dataKey="value"
              stroke="none"
              isAnimationActive={false}
              style={{ outline: 'none' }}
            />

            {/* Data Slices */}
            <Pie
              data={totalApps === 0 ? [] : activeSlices}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={activeSlices.length > 1 ? 5 : 0}
              dataKey="value"
              stroke="none"
              style={{ outline: 'none', cursor: 'pointer' }}
            >
              {activeSlices.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={STATUS_COLORS[entry.statusKey] || '#8884d8'} 
                  style={{ outline: 'none' }}
                />
              ))}
            </Pie>
            
            <Tooltip 
              wrapperStyle={{ zIndex: 1000, outline: 'none' }}
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)' 
              }}
              itemStyle={{ color: '#fff' }}
            />

            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              formatter={renderLegendText}
            />
          </PieChart>
        </ResponsiveContainer>
            
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] pointer-events-none flex flex-col items-center">
          <span className="text-3xl font-black text-gray-800 dark:text-white">
            {totalApps}
          </span>
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
            Total
          </span>
        </div>
      </div>
    </div>
  );
}
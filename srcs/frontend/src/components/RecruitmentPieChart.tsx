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
    return <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{value} ({count})</span>;
  };

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col relative outline-none">
      <header className="flex w-full max-h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <h3 className="m-3 ml-5 text-base font-semibold text-slate-900 dark:text-slate-100">
          Recruitment Status
        </h3>
      </header>

      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height={350} minWidth={0}>
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
          <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
            {totalApps}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400">
            Total
          </span>
        </div>
      </div>
    </div>
  );
}
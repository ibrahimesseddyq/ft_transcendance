import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

// #region Sample data
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
    <LineChart
      style={{ width: '100%', height: '100%', outline: 'none',}}
      responsive
      data={data}
      margin={{
        top: 20,
        right: 20,
        bottom: 5,
        left: 0,
      }}
    >
      <CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
      <Line type="monotone" dataKey="uv" stroke="purple" strokeWidth={2} name="Application" />
      <XAxis dataKey="name" />
      <YAxis width="auto" label={{ value: 'UV', position: 'insideLeft', angle: -90 }} />
      <Legend align="right" />
      <Tooltip />
      <RechartsDevtools />
    </LineChart>
  );
}
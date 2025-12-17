
import { PieChart, Pie, Cell} from 'recharts';
import {  AllUsers} from "@/lib/data";

const total = AllUsers[0].totalgames || 1;
const data = [
  { name: "Win", value: (AllUsers[0].win / total) * 100 },
  { name: "Lose", value: (AllUsers[0].lose / total) * 100 },
  { name: "Draw", value: (AllUsers[0].draw / total) * 100 },
];

// Custom colors for each segment
const COLORS = ["#4CAF50", "#F44336", "#FFC107"];
export function ProfileStatistics(){
    return (
      <div className="flex flex-col gap-2 items-center  ">
              <PieChart width={400} height={400}>
                  <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={(entry) => `${entry.name} ${entry.value}%`}
                  >
                      {data.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                  </Pie>
              </PieChart>
      </div> 
    );
}
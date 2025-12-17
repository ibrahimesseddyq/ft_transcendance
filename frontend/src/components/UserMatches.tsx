import {AllUsers} from "@/lib/data";

export function UserMatches() {
  return (
    <div className="items-center bg-transparent ">
        <div className="p-4 flex text-xl 2xl:text-2xl font-medium text-yellow-500 font-electrolize justify-between
          z-10 top-0 sticky bg-[#1E212A]">
          <span>Date</span>
          <span>Opponent</span>
          <span>Result</span>
        </div>
        

        <div className="p-4 space-y-3">
          {AllUsers[0].matches.map((match, index) => (
            <div key={index} className="flex  text-sm justify-between">
              <span className="text-muted-foreground text-white font-electrolize">{match.date}</span>
              <span className="text-white font-electrolize">{match.opponent}</span>
              <span
                className={`font-medium ${
                  match.result === "WIN"
                    ? "text-green-400 font-electrolize"
                    : match.result === "LOSS"
                    ? "text-red-400 font-electrolize"
                    : "text-yellow-400 font-electrolize"
                }`}
              >
                {match.result}
              </span>
            </div>
          ))}
        </div>
    </div>
  );
}
interface Props {
  progress: number; 
}

export function ProgressBar({ progress }: Props) {
  return (
    <div className="h-5 w-52 overflow-hidden rounded-xl bg-slate-500">
      <div 
        className="h-full rounded-xl bg-[#00adef] transition-all duration-300"
        style={{ width: progress }}
      />
    </div>
  );
}
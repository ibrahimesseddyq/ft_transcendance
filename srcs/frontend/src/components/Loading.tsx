interface LoadingProps {
  compact?: boolean;
  label?: string;
  className?: string;
}

export const Loading = ({ compact = false, label = "Loading...", className = "" }: LoadingProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-full bg-transparent animate-in fade-in duration-500 ${
        compact ? "min-h-[96px]" : "min-h-[200px]"
      } ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <div className={`absolute bg-primary/20 rounded-full animate-ping ${compact ? "w-10 h-10" : "w-16 h-16"}`}></div>
        <img 
          src="/logo.svg" 
          alt={label} 
          className={`${compact ? "w-8 h-8" : "w-12 h-12"} object-contain animate-[spin_3s_linear_infinite]`} 
        />
      </div>
      {!compact && <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{label}</p>}
    </div>
  );
};
import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";

interface IconProps {
  name: keyof typeof Icons;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export default function Icon({ name, size, className, strokeWidth }: IconProps) {
  const Ico = Icons[name] as React.ComponentType<LucideProps>;
  return <Ico size={size} strokeWidth={strokeWidth} className={className} />;
}
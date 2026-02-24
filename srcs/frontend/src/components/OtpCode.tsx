
import { useRef, KeyboardEvent } from 'react';

interface InputFieldProps {
    val: string;
    onChange: (value: string) => void;
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
    inputRef: (el: HTMLInputElement | null) => void;
}

const InputField = ({ val, onChange, onKeyDown, inputRef }: InputFieldProps) => {
    return (
        <input
            ref={inputRef}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            value={val}
            type="text"
            maxLength={1}
            inputMode="numeric"
            pattern="[0-9]*"
            required
            autoComplete="one-time-code"
            className="h-10 w-10 md:h-12 md:w-12 text-xl font-bold text-black hover:shadow-lg focus:outline-[#5F88B8]
                       bg-gray-100 border rounded-lg text-center transition-all"
        />
    );
};


interface OtpCodeProps {
  otp: string[];
  setOtp: (otp: string[]) => void;
}

export function OtpCode({ otp, setOtp }: OtpCodeProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (value !== "" && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 w-full items-center justify-center">
      {otp.map((digit, idx) => (
        <InputField
          key={idx}
          val={digit}
          inputRef={(el) => (inputRefs.current[idx] = el)}
          onChange={(val) => handleChange(val, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
        />
      ))}
    </div>
  );
}

import { useRef, KeyboardEvent, ClipboardEvent, useEffect } from 'react';

interface InputFieldProps {
    val: string;
    onChange: (value: string) => void;
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: ClipboardEvent<HTMLInputElement>) => void;
    inputRef: (el: HTMLInputElement | null) => void;
}

const InputField = ({ val, onChange, onKeyDown, onPaste, inputRef }: InputFieldProps) => {
    return (
        <input
            ref={inputRef}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
      onPaste={onPaste}
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
  onKeyEnter: (key: any) => void;
}

export function OtpCode({ otp, setOtp, onKeyEnter }: OtpCodeProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);
  const handleChange = (value: string, index: number) => {
    if (value !== "" && !/^\d+$/.test(value))
      return;
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
    if (e.key === "Enter") {
        onKeyEnter(e); 
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!pasted) return;

    const newOtp = [...otp];
    let writeIndex = index;

    for (const digit of pasted) {
      if (writeIndex > 5) break;
      newOtp[writeIndex] = digit;
      writeIndex += 1;
    }

    setOtp(newOtp);

    const focusIndex = Math.min(writeIndex, 5);
    inputRefs.current[focusIndex]?.focus();
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
          onPaste={(e) => handlePaste(e, idx)}
        />
      ))}
    </div>
  );
}
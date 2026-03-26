import React from "react";
import { digitsOnly, formatCPF, formatCNPJ } from "@/lib/validators";
import { Input } from "@/components/ui/input";

export default function CpfCnpjInput({
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = "00.000.000/0000-00",
  className = "",
  name,
}) {
  const [inner, setInner] = React.useState(value ?? "");

  React.useEffect(() => {
    setInner(value ?? "");
  }, [value]);

  const handleChange = (e) => {
    const digits = digitsOnly(e?.target?.value ?? "");
    const isCnpj = digits.length > 11;
    const trimmed = digits.slice(0, isCnpj ? 14 : 11);
    const formatted = isCnpj ? formatCNPJ(trimmed) : formatCPF(trimmed);
    setInner(formatted);
    onChange?.(formatted);
  };

  const normalizedDigits = digitsOnly(inner);
  const effectivePlaceholder = normalizedDigits.length > 11 ? "00.000.000/0000-00" : "000.000.000-00";

  return (
    <Input
      value={inner}
      name={name}
      onChange={handleChange}
      required={required}
      disabled={disabled}
      placeholder={effectivePlaceholder || placeholder}
      className={className}
    />
  );
}


import React from "react";
import Cleave from "cleave.js/react";

export default function MoneyInput({
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = "0,00",
  className = "",
  min = 0,
  style,
  ...rest
}) {
  return (
    <Cleave
      value={value ?? ""}
      options={{
        numeral: true,
        numeralDecimalMark: ",",
        delimiter: ".",
        numeralDecimalScale: 2,
        // Mantém apenas número com separadores (sem prefixo), para facilitar parse no submit.
        prefix: "",
      }}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${className}`}
      style={style}
      {...rest}
      onChange={(e) => {
        // rawValue é ideal para conversões; quando vazio, vem como "".
        const raw = e?.target?.rawValue ?? e?.target?.value ?? "";
        onChange?.(raw);
      }}
    />
  );
}


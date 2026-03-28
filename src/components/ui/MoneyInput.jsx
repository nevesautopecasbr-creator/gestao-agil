import React from "react";
import Cleave from "cleave.js/react";

const baseInputClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

export default function MoneyInput({
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = "0,00",
  className = "",
  style,
  /** Casas decimais (ex.: 2 para centavos, 4 para valor/km fino). */
  decimalScale = 2,
  /** Mostra "R$" à esquerda sem usar prefix do Cleave (evita confundir rawValue no parse). */
  leadingSymbol = null,
  ...rest
}) {
  const padClass = leadingSymbol ? "pl-9 pr-3" : "px-3";

  const cleave = (
    <Cleave
      value={value ?? ""}
      options={{
        numeral: true,
        numeralDecimalMark: ",",
        delimiter: ".",
        numeralDecimalScale: decimalScale,
        numeralPositiveOnly: true,
        prefix: "",
      }}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      inputMode="decimal"
      className={`${baseInputClass} ${padClass} ${className}`}
      style={style}
      {...rest}
      onChange={(e) => {
        const raw = e?.target?.rawValue ?? e?.target?.value ?? "";
        onChange?.(raw);
      }}
    />
  );

  if (!leadingSymbol) {
    return cleave;
  }

  return (
    <div className="relative w-full">
      <span
        className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-muted-foreground select-none"
        aria-hidden
      >
        {leadingSymbol}
      </span>
      {cleave}
    </div>
  );
}


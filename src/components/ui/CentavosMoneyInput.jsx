import React from 'react';
import {
  formatCentavosDigitsToBRL,
  MAX_CENTAVOS_DIGIT_STRING_LENGTH,
} from '@/lib/validators';

const baseClass =
  'flex h-9 w-full rounded-md border border-input bg-transparent py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';

/**
 * Entrada tipo caixa: só dígitos; os **dois últimos** são sempre centavos.
 * Ex.: digitar 2345 → exibe R$ 23,45
 *
 * @param {string} value - apenas dígitos (estado controlado), ex. "2345"
 * @param {(digits: string) => void} onChange
 */
export default function CentavosMoneyInput({
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = '0,00',
  className = '',
  leadingSymbol = 'R$',
  style,
  ...rest
}) {
  const display = formatCentavosDigitsToBRL(value);
  const showPlaceholder = !display;

  const handleChange = (e) => {
    const next = e.target.value
      .replace(/\D/g, '')
      .slice(0, MAX_CENTAVOS_DIGIT_STRING_LENGTH);
    onChange?.(next);
  };

  const input = (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      className={`${baseClass} ${leadingSymbol ? 'pl-9 pr-3' : 'px-3'} ${className}`}
      style={style}
      value={showPlaceholder ? '' : display}
      onChange={handleChange}
      {...rest}
    />
  );

  if (!leadingSymbol) {
    return input;
  }

  return (
    <div className="relative w-full">
      <span
        className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-muted-foreground select-none"
        aria-hidden
      >
        {leadingSymbol}
      </span>
      {input}
    </div>
  );
}

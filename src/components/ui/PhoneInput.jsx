import React from "react";
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.br";

export default function PhoneInput({
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = "(00) 00000-0000",
  className = "",
  style,
  ...rest
}) {
  return (
    <Cleave
      value={value ?? ""}
      options={{
        phone: true,
        phoneRegionCode: "BR",
      }}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${className}`}
      style={style}
      {...rest}
      onChange={(e) => {
        const v = e?.target?.value ?? "";
        onChange?.(v);
      }}
    />
  );
}


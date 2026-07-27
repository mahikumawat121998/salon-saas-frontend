'use client';

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { Search as SearchIcon, X as ClearIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export interface SearchProps extends Omit<TextFieldProps, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  debounceMs?: number;
  onClear?: () => void;
}

export function Search({
  value: externalValue = '',
  onChange,
  debounceMs = 300,
  onClear,
  placeholder = 'Search...',
  ...props
}: SearchProps) {
  const [value, setValue] = useState(externalValue);
  const [prevExternal, setPrevExternal] = useState(externalValue);

  if (prevExternal !== externalValue) {
    setPrevExternal(externalValue);
    setValue(externalValue);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange && value !== externalValue) {
        onChange(value);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, onChange, externalValue]);

  const handleClear = () => {
    setValue('');
    if (onChange) onChange('');
    if (onClear) onClear();
  };

  return (
    <TextField
      size="small"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon size={18} />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear} edge="end">
                <ClearIcon size={16} />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
      {...props}
    />
  );
}

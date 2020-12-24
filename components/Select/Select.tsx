import React from 'react';
import styles from './Select.module.scss';

interface Option {
  value: string | number;
  label: string;
}

interface Props {
  name: string;
  id: string;
  value: any;
  options: Option[];
  onChange: (value: any) => void;
}

export function Select({name, id, value, options, onChange}: Props) {
  return (
    <select
      className={styles.Select}
      name={name}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

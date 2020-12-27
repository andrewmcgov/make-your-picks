import React from 'react';
import {FiCheck} from 'react-icons/fi';
import styles from './RadioButton.module.scss';
import {classNames} from 'utilities/classNames';
import {Spinner} from 'components';

interface Props {
  id: string;
  name: string;
  label: string;
  value: string | number;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  loading?: boolean;
  row?: boolean;
}

export function RadioButton({
  id,
  name,
  value,
  label,
  checked,
  onChange,
  disabled,
  loading,
  row,
}: Props) {
  return (
    <>
      <input
        className={styles.Radio}
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <label
        className={classNames(styles.RadioLabel, row && styles.Row)}
        htmlFor={id}
      >
        {!loading && checked && (
          <div className={styles.Check}>
            <FiCheck size="16px" />
          </div>
        )}
        {loading && checked && (
          <div className={styles.Spinner}>
            <Spinner />
          </div>
        )}
        {label}
      </label>
    </>
  );
}

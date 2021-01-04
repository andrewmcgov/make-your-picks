import React, {useState} from 'react';
import {Select} from 'components';
import {weekOptions} from 'data/weeks';

export function useWeekSelect() {
  const [week, setWeek] = useState('WC');

  const weekSelect = (
    <Select
      name="week"
      id="week-select"
      value={week}
      onChange={setWeek}
      options={weekOptions}
    />
  );

  return {week, weekSelect};
}

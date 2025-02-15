import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const fiveAM = dayjs().set('hour', 5).startOf('hour');
const nineAM = dayjs().set('hour', 9).startOf('hour');

export default function TimeValidationMaxTime() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label="TimePicker">
          <TimePicker defaultValue={nineAM} maxTime={fiveAM} />
        </DemoItem>
        <DemoItem label="DateTimePicker">
          <DateTimePicker defaultValue={nineAM} maxTime={fiveAM} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

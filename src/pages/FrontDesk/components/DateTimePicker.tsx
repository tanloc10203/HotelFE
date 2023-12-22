import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker as MUIDateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import { FC } from "react";

type DateTimePickerProps = {
  label: string;
  value: Dayjs;
  minDate?: Dayjs;
  minTime?: Dayjs;
  minDatetime?: Dayjs;
  onChange?: (value: Dayjs | null) => void;
  disabled?: boolean;
};

const DateTimePicker: FC<DateTimePickerProps> = ({
  label,
  value,
  minDate,
  minTime,
  disabled,
  minDatetime,
  onChange,
}) => {
  return (
    <LocalizationProvider adapterLocale="vi" dateAdapter={AdapterDayjs}>
      <MUIDateTimePicker
        disabled={disabled}
        sx={{ p: 0 }}
        onChange={onChange}
        value={value}
        timeSteps={{ minutes: 1 }}
        minDate={minDate}
        minDateTime={minDatetime}
        dayOfWeekFormatter={(day) => `${day}`}
        slotProps={{
          textField: { size: "small", margin: "none" },
        }}
        label={label}
        minTime={minTime}
      />
    </LocalizationProvider>
  );
};

export default DateTimePicker;

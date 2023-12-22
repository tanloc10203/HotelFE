import { FormControl } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { FC, ReactNode } from "react";

type DatePickerPriceListProps = {
  label: string;
  error?: boolean;
  helperText?: ReactNode;
  value?: Dayjs | null;
  onChange?: (date: any) => void;
  minDate: Dayjs;
  disabled?: boolean;
};

const DatePickerPriceList: FC<DatePickerPriceListProps> = ({
  label,
  error,
  helperText,
  value,
  minDate,
  disabled,
  onChange,
}) => {
  return (
    <FormControl fullWidth margin="normal" error={error}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
        <DatePicker
          disabled={disabled}
          minDate={minDate}
          value={value}
          dayOfWeekFormatter={(day) => `${day}`}
          label={label}
          onChange={onChange}
          slotProps={{
            textField: {
              error: error,
              helperText: helperText,
            },
          }}
        />
      </LocalizationProvider>
    </FormControl>
  );
};

export default DatePickerPriceList;

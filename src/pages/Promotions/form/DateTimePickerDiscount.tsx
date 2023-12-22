import { FormControl, FormHelperText } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import { FC, ReactNode, memo, useCallback, useEffect, useState } from "react";
import { getLastDayOfYear } from "~/utils";

type DateTimePickerDiscountProps = {
  label: string;
  error?: boolean;
  helperText?: ReactNode;
  value?: string | Date | null;
  onChange?: (date: any) => void;
};

const endOf = dayjs();
const startOf = () => {
  const currentYear = dayjs().get("year");
  const lastDate = getLastDayOfYear(currentYear).toISOString();
  return dayjs(lastDate);
};

const DateTimePickerDiscount: FC<DateTimePickerDiscountProps> = ({
  label,
  error,
  value,
  helperText,
  onChange,
}) => {
  const [date, setDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (!value) {
      setDate(null);
      return;
    }

    setDate(dayjs(value));
  }, [value]);

  const changeDate = useCallback(
    (date: Dayjs | null) => {
      setDate(date);
      if (!onChange) return;
      onChange(date);
    },
    [onChange]
  );

  return (
    <FormControl fullWidth margin="normal" error={error}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
        <DateTimePicker
          value={date}
          dayOfWeekFormatter={(day) => `${day}`}
          label={label}
          minDate={endOf}
          maxDate={startOf()}
          onChange={changeDate}
          disableIgnoringDatePartForTimeValidation={true}
        />
      </LocalizationProvider>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default memo(DateTimePickerDiscount);

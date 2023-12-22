import { Box } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FieldChangeHandlerContext } from "@mui/x-date-pickers/internals";
import { viVN } from "@mui/x-date-pickers/locales";
import dayjs, { Dayjs } from "dayjs";
import { FC } from "react";

export type DatePickerMainProps = {
  label: string;
  value?: Dayjs | null;
  onChange?: (value: Dayjs | null, context: FieldChangeHandlerContext<string | null>) => void;
};

const DatePickerMain: FC<DatePickerMainProps> = ({ label, value, onChange }) => {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
      adapterLocale="vi"
    >
      <Box width={"100%"}>
        <DatePicker
          sx={{ width: "100%" }}
          dayOfWeekFormatter={(day) => `${day}`}
          label={label}
          value={value ? dayjs(value) : null}
          onChange={onChange}
          showDaysOutsideCurrentMonth
          views={["year", "month", "day"]}
          slotProps={{
            textField: {
              size: "small",
            },
          }}
          format="DD/MM/YYYY"
        />
      </Box>
    </LocalizationProvider>
  );
};

export default DatePickerMain;

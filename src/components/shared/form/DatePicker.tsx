import { Box } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FieldChangeHandlerContext } from "@mui/x-date-pickers/internals";
import { viVN } from "@mui/x-date-pickers/locales";
import dayjs, { Dayjs } from "dayjs";
import { FC } from "react";
import { env } from "~/constants";
import { getLastDayOfYear } from "~/utils";

type BasicDatePickerProps = {
  label: string;
  value?: Dayjs | null;
  onChange?: (value: Dayjs | null, context: FieldChangeHandlerContext<string | null>) => void;
};

const isInCurrentYear = (date: Dayjs) => {
  const minus = dayjs().get("year") - date.get("year");
  return minus <= env.AGE_LIMIT - 1;
};

const endOfQ12022 = () => {
  const currentYear = dayjs().get("year") - env.AGE_LIMIT;
  const lastDate = getLastDayOfYear(currentYear).toISOString();
  return dayjs(lastDate);
};

const BasicDatePicker: FC<BasicDatePickerProps> = ({ label, value, onChange }) => {
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
          shouldDisableYear={isInCurrentYear}
          disableFuture
          views={["year", "month", "day"]}
          maxDate={endOfQ12022()}
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

export default BasicDatePicker;

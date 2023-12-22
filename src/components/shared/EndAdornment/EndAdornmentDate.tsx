import DateRangeIcon from "@mui/icons-material/DateRange";
import { InputAdornment } from "@mui/material";
import { FC, memo } from "react";

const EndAdornmentDate: FC = () => {
  return (
    <InputAdornment position="end">
      <DateRangeIcon />
    </InputAdornment>
  );
};

export default memo(EndAdornmentDate);

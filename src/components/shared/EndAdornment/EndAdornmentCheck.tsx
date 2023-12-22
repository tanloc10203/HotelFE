import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { InputAdornment } from "@mui/material";
import { FC, memo } from "react";

const EndAdornmentCheck: FC = () => {
  return (
    <InputAdornment position="end">
      <CheckCircleIcon color="inherit" />
    </InputAdornment>
  );
};

export default memo(EndAdornmentCheck);

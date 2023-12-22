import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import { InputAdornment } from "@mui/material";
import { FC, memo } from "react";

const EndAdornmentInActive: FC = () => {
  return (
    <InputAdornment position="end">
      <DoNotDisturbIcon color="error" />
    </InputAdornment>
  );
};

export default memo(EndAdornmentInActive);

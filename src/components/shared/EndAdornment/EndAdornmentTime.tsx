import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { InputAdornment } from "@mui/material";
import { FC, memo } from "react";

const EndAdornmentTime: FC = () => {
  return (
    <InputAdornment position="end">
      <AccessTimeIcon />
    </InputAdornment>
  );
};

export default memo(EndAdornmentTime);

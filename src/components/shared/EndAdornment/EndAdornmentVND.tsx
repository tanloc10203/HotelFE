import { InputAdornment, Typography } from "@mui/material";
import { FC, memo } from "react";

const EndAdornmentVND: FC = () => {
  return (
    <InputAdornment position="end">
      <Typography fontSize={10} fontWeight={700}>
        VNĐ
      </Typography>
    </InputAdornment>
  );
};

export default memo(EndAdornmentVND);

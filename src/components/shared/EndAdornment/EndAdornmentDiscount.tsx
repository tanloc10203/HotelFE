import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { InputAdornment, Stack, Typography, useTheme } from "@mui/material";
import { FC } from "react";
import { HtmlTooltip } from "~/components";

type EndAdornmentDiscountProps = {
  discount?: number;
};

const EndAdornmentDiscount: FC<EndAdornmentDiscountProps> = ({ discount = 0 }) => {
  const theme = useTheme();

  return (
    <InputAdornment position="end">
      <HtmlTooltip
        arrow
        placement="left"
        title={
          <Stack gap={1}>
            <Typography fontSize={14}>
              Nếu giảm giá <b>lớn hơn 100</b> sẽ được tính là{" "}
              <b style={{ color: theme.palette.error.main }}>số tiền giảm giá.</b>
            </Typography>
            <Typography fontSize={14}>
              Ngược lại <b>nhỏ hơn bằng 100</b> sẽ tính là{" "}
              <b style={{ color: theme.palette.error.main }}>phần trăm giảm giá.</b>
            </Typography>
          </Stack>
        }
      >
        <Stack fontSize={14} flexDirection={"row"} gap={0.5}>
          <QuestionMarkIcon fontSize="inherit" />
          <Typography fontSize={12} fontWeight={700}>
            {discount <= 100 ? "%" : "VNĐ"}
          </Typography>
        </Stack>
      </HtmlTooltip>
    </InputAdornment>
  );
};

export default EndAdornmentDiscount;

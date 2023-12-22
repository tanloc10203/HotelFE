import { Stack, Typography } from "@mui/material";
import { FC } from "react";
import { IDiscount } from "~/types";
import { fNumber } from "~/utils";

type LabelDiscountProps = {
  discount?: null | IDiscount;
};

const LabelDiscount: FC<LabelDiscountProps> = ({ discount }) => {
  if (!discount || !Boolean(discount.is_public) || Boolean(discount.status === "expired"))
    return null;

  return (
    <Stack flexDirection={"row"} gap={1} mt={2} mb={2} flexWrap={"wrap"} maxWidth={264}>
      <Typography fontSize={14}>Giảm giá:</Typography>
      <Typography fontSize={14} color={(theme) => theme.palette.error.main}>
        {(discount.price > 100 ? `${fNumber(discount.price || 0)} VNĐ` : `${discount.price}%`) +
          ` cho tất các loại giá`}
      </Typography>
    </Stack>
  );
};

export default LabelDiscount;

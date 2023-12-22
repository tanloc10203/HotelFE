import { Stack, Typography } from "@mui/material";
import { FC, memo, useMemo } from "react";
import { Colors } from "~/constants";
import { IDiscount } from "~/types";
import { fCurrency } from "~/utils";
import { calcWithDiscount } from "~/utils/convert";

type LabelPriceProps = {
  priceHour: number;
  priceDay: number;
  discount?: IDiscount | null;
};

const LabelPrice: FC<LabelPriceProps> = ({ priceDay, priceHour, discount }) => {
  if (!discount || !Boolean(discount.is_public) || Boolean(discount.status === "expired"))
    return (
      <Stack flexDirection={"row"} my={2} gap={1} alignItems={"center"}>
        <Typography fontSize={13} color={Colors.redLight}>{`${fCurrency(
          priceHour
        )}/giờ`}</Typography>
        <Typography fontSize={13} color={Colors.pinkLight}>
          -
        </Typography>
        <Typography fontSize={13} color={Colors.pinkLight}>{`${fCurrency(
          priceDay
        )}/ngày`}</Typography>
      </Stack>
    );

  const priceHourRender = useMemo(() => {
    return calcWithDiscount(priceHour, discount.price);
  }, [discount, priceHour]);

  const priceDayRender = useMemo(() => {
    return calcWithDiscount(priceDay, discount.price);
  }, [discount, priceDay]);

  return (
    <>
      <Stack flexDirection={"row"} my={2} gap={1} alignItems={"center"}>
        <Typography fontSize={13} color={(theme) => theme.palette.success.main}>{`${fCurrency(
          priceHourRender
        )}/giờ`}</Typography>
        <Typography fontSize={13} color={Colors.pinkLight}>
          -
        </Typography>
        <Typography fontSize={13} color={(theme) => theme.palette.error.main}>{`${fCurrency(
          priceDayRender
        )}/ngày`}</Typography>
      </Stack>

      <Stack flexDirection={"row"} my={2} gap={1} alignItems={"center"}>
        <Typography
          sx={{ textDecoration: "line-through" }}
          fontSize={12}
          color={Colors.redLight}
        >{`${fCurrency(priceHour)}/giờ`}</Typography>
        <Typography fontSize={12} color={Colors.pinkLight}>
          -
        </Typography>
        <Typography
          sx={{ textDecoration: "line-through" }}
          fontSize={12}
          color={Colors.pinkLight}
        >{`${fCurrency(priceDay)}/ngày`}</Typography>
      </Stack>
    </>
  );
};

export default memo(LabelPrice);

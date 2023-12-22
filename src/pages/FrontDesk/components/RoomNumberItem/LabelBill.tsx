import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Box, Stack, Typography } from "@mui/material";
import { FC, memo } from "react";
import { IBill } from "~/types";
import { fNumber } from "~/utils";

type LabelBillProps = {
  bill?: null | IBill;
};

const LabelBill: FC<LabelBillProps> = ({ bill }) => {
  return (
    <Stack flexDirection={"row"} my={1} gap={1} alignItems={"center"}>
      <Box
        color="white"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        fontSize={18}
      >
        <AttachMoneyIcon color="inherit" fontSize={"inherit"} />
      </Box>
      <Typography fontWeight={"bold"} color={"white"} fontSize={14}>
        {bill ? fNumber(bill.total_price) : "Chưa có thông tin bill"}
      </Typography>
    </Stack>
  );
};

export default memo(LabelBill);

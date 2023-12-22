import { Stack, Typography } from "@mui/material";
import { FC, memo } from "react";
import { StatusRoom } from "~/types";

type LabelGuestInformationProps = {
  status: StatusRoom;
  guest: string;
};

const LabelGuestInformation: FC<LabelGuestInformationProps> = ({ status, guest }) => {
  return (
    <Stack
      flexDirection={"row"}
      gap={1}
      mt={2}
      ml={status === "unavailable" ? 0.7 : 0}
      flexWrap={"wrap"}
      maxWidth={264}
    >
      <Typography fontSize={14} color={(theme) => theme.palette.common.white}>
        Khách:{" "}
      </Typography>
      <Typography fontSize={14} color={(theme) => theme.palette.common.white}>
        {guest ? guest : `Chưa có thông tin lưu trú`}
      </Typography>
    </Stack>
  );
};

export default memo(LabelGuestInformation);

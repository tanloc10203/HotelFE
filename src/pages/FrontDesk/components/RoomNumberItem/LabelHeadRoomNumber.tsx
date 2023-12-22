import { Stack, Typography } from "@mui/material";
import { FC, memo } from "react";
import { Colors } from "~/constants";
import { StatusRoom } from "~/types";

type LabelHeadRoomNumberProps = {
  label: string;
  status: StatusRoom;
};

const LabelHeadRoomNumber: FC<LabelHeadRoomNumberProps> = ({ label, status }) => {
  return (
    <Stack flexDirection={"row"} gap={1} mt={2} ml={status === "unavailable" ? 0.7 : 0}>
      <Typography
        fontSize={14}
        color={(theme) =>
          status === "unavailable" ? theme.palette.common.white : Colors.pinkLight
        }
      >
        Loại phòng:{" "}
      </Typography>
      <Typography
        fontSize={14}
        color={(theme) =>
          status === "unavailable" ? theme.palette.common.white : Colors.pinkLight
        }
      >
        {label}
      </Typography>
    </Stack>
  );
};

export default memo(LabelHeadRoomNumber);

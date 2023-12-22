import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Box, Stack, Typography } from "@mui/material";
import { FC, memo } from "react";
import { Colors } from "~/constants";
import { StatusRoom } from "~/types";
import { fStatusRNumber } from "../../helpers/convertStatusRoomNumber";

type LabelStatusProps = {
  status: StatusRoom;
};

const LabelStatus: FC<LabelStatusProps> = ({ status }) => {
  return (
    <Stack flexDirection={"row"} gap={1} alignItems={"center"}>
      {status === "unavailable" ? (
        <Box
          color="white"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          fontSize={18}
        >
          <AccessTimeIcon color="inherit" fontSize="inherit" />
        </Box>
      ) : null}
      <Typography
        fontSize={14}
        color={(theme) =>
          status === "unavailable" ? theme.palette.common.white : Colors.pinkLight
        }
      >
        {fStatusRNumber(status!)}
      </Typography>
    </Stack>
  );
};

export default memo(LabelStatus);

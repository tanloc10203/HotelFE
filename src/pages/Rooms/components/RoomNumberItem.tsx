import { Box, Paper } from "@mui/material";
import { FC, useCallback } from "react";
import { IRoomNumber } from "~/types";

type RoomNumberItemProps = {
  onClick?: (roomNumber: IRoomNumber) => void;
  roomNumber: IRoomNumber;
};

const RoomNumberItem: FC<RoomNumberItemProps> = ({ onClick, roomNumber }) => {
  const handleOnClickRoomNumber = useCallback(() => {
    if (!onClick) return;
    onClick(roomNumber);
  }, [onClick, roomNumber]);

  return (
    <Box
      component={Paper}
      elevation={3}
      onClick={handleOnClickRoomNumber}
      sx={{
        minWidth: 100,
        minHeight: 60,
        cursor: "pointer",
        m: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.6,
        transition: ({ transitions }) => transitions.duration.shorter,
        "&:hover": {
          opacity: 1,
        },
      }}
    >
      {roomNumber.id}
    </Box>
  );
};

export default RoomNumberItem;

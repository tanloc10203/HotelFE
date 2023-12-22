import { Box, Paper, Stack, Typography } from "@mui/material";
import { FC, MouseEvent, memo, useCallback, useRef, useState } from "react";
import { ActionsRefsProps } from "~/components";
import { Colors } from "~/constants";
import { frontDeskActions } from "~/features/frontDesk";
import { useCalcTimeUsedInRoom } from "~/hooks/useCalcTimeUsedInRoom";
import { useAppDispatch } from "~/stores";
import { RoomNumberItemProps } from "~/types";
import ActionRoomNumberItem from "./ActionRoomNumberItem";
import LabelBill from "./LabelBill";
import LabelDiscount from "./LabelDiscount";
import LabelGuestInformation from "./LabelGuestInformation";
import LabelHeadRoomNumber from "./LabelHeadRoomNumber";
import LabelPrice from "./LabelPrice";
import LabelStatus from "./LabelStatus";
import PopupInformation from "./PopupInformation";

const RoomNumberItem: FC<RoomNumberItemProps> = (props) => {
  const { id, priceDay, priceHour, roomTypeName, discount, status, checked_in } = props;
  const dispatch = useAppDispatch();
  const [hover, setHover] = useState(false);
  const refActions = useRef<ActionsRefsProps | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<RoomNumberItemProps | null>(null);
  const duration = useCalcTimeUsedInRoom(checked_in);

  const handleClickPopup = useCallback(
    (event: MouseEvent<HTMLDivElement>, data: RoomNumberItemProps) => {
      const localX = event.clientX - event.currentTarget.offsetLeft;

      if (localX >= 200) return;

      refActions.current?.onClose();

      setSelectedRoomNumber(data);
      setAnchorEl(event.currentTarget);
    },
    [refActions]
  );

  const handleClosePopup = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClick = useCallback(() => {
    if (!refActions.current) return;

    refActions.current.onClose();
    dispatch(frontDeskActions.setToggleListCustomerBooked(true));
    dispatch(frontDeskActions.setSelectedRoomNumberId(id));
  }, [refActions, id]);

  const onMouseMove = useCallback(() => {
    setHover(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setHover(false);
  }, []);

  const handleCleanup = useCallback((data: RoomNumberItemProps) => {
    dispatch(frontDeskActions.setToggleCleanupDialog({ open: true, selected: data }));
  }, []);

  return (
    <>
      <Box
        component={Paper}
        p={2}
        elevation={hover ? 15 : 1}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        sx={{
          "&:hover": { cursor: "pointer", transition: "all 0.25s ease-in-out" },
          background: (theme) =>
            status === "unavailable"
              ? theme.palette.mode === "light"
                ? theme.palette.success.main
                : theme.palette.success.main
              : status === "cleanup"
              ? theme.palette.mode === "light"
                ? Colors.Orange
                : theme.palette.error.dark
              : "",
        }}
        minWidth={264}
        onMouseDown={
          status === "unavailable"
            ? (event) => handleClickPopup(event, props)
            : status === "cleanup"
            ? () => handleCleanup(props)
            : undefined
        }
      >
        <ActionRoomNumberItem
          status={status!}
          id={id}
          onClickListBooked={handleClick}
          ref={refActions}
        />

        <LabelHeadRoomNumber label={roomTypeName} status={status!} />

        {status === "unavailable" ? (
          props.guestInformations?.length ? (
            <LabelGuestInformation
              status={status!}
              guest={props.guestInformations.reduce(
                (result, value, index, old) =>
                  (result += `${value.full_name}${index >= old.length - 1 ? "" : ", "}`),
                ""
              )}
            />
          ) : (
            <LabelGuestInformation status={status!} guest={""} />
          )
        ) : null}

        <LabelDiscount discount={discount} />

        {status === "unavailable" ? (
          <LabelBill bill={props.bill} />
        ) : (
          <LabelPrice priceDay={priceDay} priceHour={priceHour} discount={discount} />
        )}

        <LabelStatus status={status!} />

        {status === "unavailable" ? (
          <Stack mt={1}>
            <Typography color={"white"}>{duration}</Typography>
          </Stack>
        ) : null}
      </Box>

      {status === "unavailable" ? (
        <PopupInformation
          roomNumber={selectedRoomNumber!}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClosePopup}
        />
      ) : null}
    </>
  );
};

export default memo(RoomNumberItem);

import BookIcon from "@mui/icons-material/Book";
import { Chip, Stack } from "@mui/material";
import { forwardRef, memo, useImperativeHandle, useRef } from "react";
import { Actions, ActionsRefsProps, ButtonActions } from "~/components";
import { StatusRoom } from "~/types";

type ActionRoomNumberItemProps = {
  id: string;
  onClickListBooked?: () => void;
  status: StatusRoom;
  onClickHandle?: () => void;
};

const ActionRoomNumberItem = forwardRef<ActionsRefsProps, ActionRoomNumberItemProps>(
  function ActionRoomNumberItem(props, ref) {
    const { id, status, onClickListBooked, onClickHandle } = props;
    const refActions = useRef<ActionsRefsProps | null>(null);

    useImperativeHandle(
      ref,
      () => {
        return {
          ...refActions.current!,
        };
      },
      [refActions]
    );

    return (
      <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Chip
          label={id}
          variant="outlined"
          sx={status === "unavailable" ? { background: "white", color: "black" } : {}}
        />
        <Actions
          onClickHandle={onClickHandle}
          ref={refActions}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "left",
          }}
        >
          <ButtonActions onClick={onClickListBooked} startIcon={<BookIcon />}>
            Danh sách khách hàng đã đặt
          </ButtonActions>
        </Actions>
      </Stack>
    );
  }
);

export default memo(ActionRoomNumberItem);

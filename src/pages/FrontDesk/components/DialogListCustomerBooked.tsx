import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import {
  Box,
  IconButton,
  LinearProgress,
  SelectChangeEvent,
  TableCell,
  TableRow,
  Tooltip,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import dayjs from "dayjs";
import { FC, useCallback } from "react";
import { ColumnState, TableCellOverride, Transition } from "~/components";
import { CheckInOutPayload } from "~/features/booking";
import { frontDeskActions, useFrontDeskSelector } from "~/features/frontDesk";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { GetCustomerBooked, ModeBookingType } from "~/types";
import { fCapitalizeFirstLetter, fDateDayjs } from "~/utils";
import FilterBooking from "./FilterBooking";

const { Table } = ForPage;

type DialogListCustomerBookedProps = {
  open: boolean;
  onClose?: () => void;
};

const DialogListCustomerBooked: FC<DialogListCustomerBookedProps> = ({ open, onClose }) => {
  const { selectRoomNumberId, checkIn, checkOut, modeBooking, customerBooked, isLoading } =
    useFrontDeskSelector();
  const dispatch = useAppDispatch();

  const columns: ColumnState[] = [
    { id: "customer_id", label: "Mã.KH", align: "center" },
    { id: "display_name", label: "Tên khách hàng" },
    {
      id: "check_in",
      label: "Ngày nhận phòng",
      format(value) {
        return fCapitalizeFirstLetter(fDateDayjs(dayjs(value)));
      },
    },
    {
      id: "check_out",
      label: "Ngày trả phòng",
      format(value) {
        return fCapitalizeFirstLetter(fDateDayjs(dayjs(value)));
      },
    },
    { id: "checkedIn", label: "Nhận phòng", align: "center" },
  ];

  const handleChangeCheckInOut = useCallback((payload: CheckInOutPayload) => {
    dispatch(frontDeskActions.setCheckInOut(payload));
  }, []);

  const handleChangeModeBooking = useCallback((event: SelectChangeEvent<unknown>) => {
    dispatch(frontDeskActions.setModeBooking(event.target.value as ModeBookingType));
  }, []);

  const handleSelectedCheckIn = useCallback((selected: GetCustomerBooked) => {
    dispatch(frontDeskActions.setToggleDialogCheckIn(true));
    dispatch(frontDeskActions.setCustomerBookedSelected(selected));
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="lg"
      fullWidth
      TransitionComponent={Transition}
    >
      <DialogTitle id="alert-dialog-title">
        Danh sách khách hàng sắp nhận phòng `{selectRoomNumberId}`
      </DialogTitle>
      <DialogContent>
        <FilterBooking
          modeValue={modeBooking}
          checkIn={checkIn}
          checkOut={checkOut}
          calcDateTime={""}
          onChangeMode={handleChangeModeBooking}
          onChangeCheckIn={(value) => handleChangeCheckInOut({ type: "check-in", value: value! })}
          onChangeCheckOut={(value) => handleChangeCheckInOut({ type: "check-out", value: value! })}
        />

        <Box position="relative">
          {isLoading === "pending" ? (
            <Box position="absolute" top={-4} left={0} right={0}>
              <LinearProgress />
            </Box>
          ) : null}
          <Table
            sxHeadCell={{
              background: (theme) => (theme.palette.mode === "dark" ? "#609966" : "#DDF7E3"),
            }}
            columns={columns}
          >
            {!customerBooked.length ? (
              <TableRow>
                <TableCell colSpan={columns.length}>Chưa có khách đặt phòng</TableCell>
              </TableRow>
            ) : (
              customerBooked.map((row) => (
                <TableRow key={row.booking_id}>
                  {columns.map((column) => {
                    const value = row[column.id as keyof GetCustomerBooked];

                    if (column.id === "checkedIn")
                      return (
                        <TableCellOverride key={column.id} {...column}>
                          <Tooltip title="Nhận phòng và thêm thông tin khách lưu trú">
                            <IconButton onClick={() => handleSelectedCheckIn(row)}>
                              <AssignmentTurnedInIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCellOverride>
                      );

                    return (
                      <TableCellOverride key={column.id} {...column}>
                        {column.format ? column.format(value) : (value as string)}
                      </TableCellOverride>
                    );
                  })}
                </TableRow>
              ))
            )}
          </Table>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy bỏ</Button>
        <Button onClick={onClose} autoFocus>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogListCustomerBooked;

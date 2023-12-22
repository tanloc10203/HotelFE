import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { FC, useCallback, useLayoutEffect, useMemo } from "react";
import {
  AppbarDialog,
  ColumnState,
  SelectInput,
  TableCellOverride,
  Transition,
} from "~/components";
import { SCROLLBAR_CUSTOM } from "~/constants";
import { appActions } from "~/features/app";
import { frontDeskActions, useFrontDeskSelector } from "~/features/frontDesk";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { RoomNumberItemProps, RoomNumberRender } from "~/types";
import { currentDate } from "~/utils";
import DateTimePicker from "../DateTimePicker";
import DialogConfirmChangeRoom from "./DialogConfirmChangeRoom";

const { Table } = ForPage;

type DialogChangeRoomProps = {
  open: boolean;
  onClose?: () => void;
  roomNumber: RoomNumberItemProps;
};

const DialogChangeRoom: FC<DialogChangeRoomProps> = ({ open, onClose, roomNumber }) => {
  const dispatch = useAppDispatch();
  const {
    screenGrid: { dataChangeRooms, selectedRoomNumberChange },
  } = useFrontDeskSelector();

  const guest = useMemo(() => {
    if (!roomNumber.guestInformations?.length) return "chưa có thông tin";

    return roomNumber.guestInformations.reduce(
      (results, value, idx, old) =>
        (results += `${value.full_name}${idx >= old.length - 1 ? "" : ", "}`),
      ""
    );
  }, [roomNumber]);

  useLayoutEffect(() => {
    if (!open || !roomNumber.roomTypeId || !roomNumber.check_in || !roomNumber.check_out) return;

    const { roomTypeId, check_out } = roomNumber;

    dispatch(appActions.openOverplay("Đang lấy dữ liệu..."));
    dispatch(
      frontDeskActions.getDataChangeRoomStart({
        checkIn: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        checkOut: check_out,
        roomTypeId,
      })
    );
  }, [open, roomNumber]);

  const dataRender = useMemo(() => {
    let data: RoomNumberRender[] = [];

    if (!dataChangeRooms.length || !roomNumber.booking_detail_id) return data;

    const length = dataChangeRooms.length;

    for (let index = 0; index < length; index++) {
      const row = dataChangeRooms[index];
      const { roomNumbers, prices } = row;
      const lengthRoomNumber = roomNumbers.length;

      if (!lengthRoomNumber) return data;

      for (let idx = 0; idx < lengthRoomNumber; idx++) {
        const _roomNumber = roomNumbers[idx];

        data.push({
          ..._roomNumber,
          prices,
          roomTypeId: row.roomTypeId,
          roomTypeName: row.name,
          bookingDetailsId: roomNumber.booking_detail_id!,
        });
      }
    }

    return data;
  }, [dataChangeRooms, roomNumber]);

  const columns: ColumnState[] = [
    { id: "id", label: "Số phòng" },
    { id: "roomTypeName", label: "Phòng" },
    { id: "actions", label: "Chọn Phòng", minWidth: 80, maxWidth: 80 },
  ];

  const handleCloseSelectedChangeRoomDialog = useCallback(() => {
    dispatch(frontDeskActions.setSelectedRoomNumberChange(null));
  }, []);

  const handleAgreeChangeRoom = useCallback(() => {
    if (!selectedRoomNumberChange) return;

    dispatch(appActions.openOverplay("Đang đổi phòng..."));
    dispatch(
      frontDeskActions.changeRoomStart({
        bookingDetailsId: selectedRoomNumberChange.bookingDetailsId,
        roomNumber: selectedRoomNumberChange.id,
      })
    );
  }, [selectedRoomNumberChange]);

  const handleSelectedChangeRoom = useCallback((value: RoomNumberRender) => {
    dispatch(frontDeskActions.setSelectedRoomNumberChange(value));
  }, []);

  return (
    <>
      {selectedRoomNumberChange ? (
        <DialogConfirmChangeRoom
          open
          roomNumber={selectedRoomNumberChange.id}
          onClose={handleCloseSelectedChangeRoomDialog}
          onAgree={handleAgreeChangeRoom}
        />
      ) : null}

      <Dialog
        TransitionComponent={Transition}
        maxWidth="lg"
        fullWidth
        open={open}
        onClose={onClose}
      >
        <AppbarDialog
          title={`Thay đổi phòng ${roomNumber.id} của khách \`${guest}\``}
          onClose={onClose}
        />

        <DialogContent sx={SCROLLBAR_CUSTOM}>
          <Stack flexDirection={"row"} gap={1}>
            <Box width={300}>
              <SelectInput
                value={roomNumber.mode_booking!}
                sizeForm="small"
                margin="none"
                options={[
                  { label: "Theo giờ", value: "time" },
                  { label: "Theo ngày", value: "day" },
                ]}
                label="Hình thức"
              />
            </Box>

            <Box>
              <DateTimePicker value={dayjs()} key={"check-in"} label="Ngày thay đổi" disabled />
            </Box>

            <Box>
              <DateTimePicker
                minDate={currentDate()}
                // onChange={onChangeCheckOut}
                value={dayjs(roomNumber.check_out!)}
                // value={checkOut}
                key={"check-out"}
                label="Trả phòng"
              />
            </Box>
          </Stack>

          <Box mt={2}>
            <Typography>Danh sách phòng trống</Typography>

            <Box my={2} mb={5}>
              <Table autoHeight={false} columns={columns}>
                {dataRender.length ? (
                  dataRender.map((row) => (
                    <TableRow key={row.id}>
                      {columns.map((column, idxColumn) => {
                        const value = row[column.id as keyof RoomNumberRender];

                        if (column.id === "actions") {
                          return (
                            <TableCellOverride {...column} key={idxColumn}>
                              <Button onClick={() => handleSelectedChangeRoom(row)}>
                                Chọn phòng
                              </Button>
                            </TableCellOverride>
                          );
                        }

                        return (
                          <TableCellOverride {...column} key={idxColumn}>
                            {column.format ? column.format(value) : (value as string)}
                          </TableCellOverride>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length}>Không có phòng trống</TableCell>
                  </TableRow>
                )}
              </Table>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogChangeRoom;

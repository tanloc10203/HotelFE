import Collapse from "@mui/material/Collapse";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import * as React from "react";
import { ColumnState, TableCellOverride } from "~/components";
import { FORMAT_DATETIME_SQL } from "~/constants/format";
import { appActions } from "~/features/app";
import { frontDeskActions, useFrontDeskSelector } from "~/features/frontDesk";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { GetCustomerBooked, IGuestStayInformation } from "~/types";
import { fCapitalizeFirstLetter, fDateDayjs, fNumber } from "~/utils";
import SaveGuestStay from "./SaveGuestStay";

const { Table } = ForPage;

function Row(props: {
  row: GetCustomerBooked;
  columns: ColumnState[];
  selected: string;
  onClick: (newName: string) => void;
  onSubmit?: (values: IGuestStayInformation, resetForm: () => void, mode: "edit" | "add") => void;
}) {
  const { row, columns, onClick, selected, onSubmit } = props;

  return (
    <React.Fragment>
      <TableRow onClick={() => onClick(row.id!)}>
        {columns.map((column, index) => {
          const value = row[column.id as keyof GetCustomerBooked];

          if (column.id === "prices") {
            const price =
              Number(row.bill?.cost_room || 0) + Number(row.bill?.cost_last_checkin || 0);

            return (
              <TableCellOverride key={index} {...column}>
                {`${fNumber(price)} VNĐ`}
              </TableCellOverride>
            );
          }

          return (
            <TableCellOverride key={index} {...column}>
              {column.format ? column.format(value as string) : (value as string)}
            </TableCellOverride>
          );
        })}
      </TableRow>

      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}
          colSpan={columns.length}
        >
          <Collapse in={Boolean(selected === row.id!)} timeout="auto" unmountOnExit>
            <SaveGuestStay
              onSubmit={onSubmit}
              bookingDetailsId={row.id!}
              roomNumber={row.room_number_id}
              guests={row.guestInformations}
              checkIn={row.check_in}
              checkOut={row.check_out}
              adults={row.adults}
              children={row.children ?? 0}
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const CollapsibleTable = () => {
  const {
    customerBookedCheckIns,
    selectRoomNumberId,
    customerBookedSelected,
    optionCheckIn,
    checkIn: _checkIn,
    checkOut: _checkOut,
    modeBooking,
  } = useFrontDeskSelector();

  const dispatch = useAppDispatch();

  const columns: ColumnState[] = React.useMemo(
    () => [
      {
        id: "roomTypeName",
        label: "Loại phòng",
      },
      {
        id: "room_number_id",
        label: "Phòng",
        align: "center",
      },
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
      {
        id: "prices",
        label: `Thành tiền`,
        align: "center",
      },
      {
        id: "status",
        label: `Trạng thái`,
        align: "center",
        format(value) {
          return value === "in_progress" ? "Đã nhận phòng" : "Chưa nhận phòng";
        },
      },
    ],
    []
  );

  const [id, setId] = React.useState("");

  const handleSubmit = React.useCallback(
    (values: IGuestStayInformation, resetForm: () => void, mode: "edit" | "add") => {
      if (!selectRoomNumberId) return;

      dispatch(appActions.openOverplay("Đang thêm thông tin"));

      if (mode === "add")
        dispatch(
          frontDeskActions.addIdentificationGuestStart({
            data: {
              ...values,
              ...(customerBookedSelected
                ? {
                    filters: {
                      checkIn: _checkIn.format(FORMAT_DATETIME_SQL),
                      checkOut: _checkOut.format(FORMAT_DATETIME_SQL),
                      modeBooking: modeBooking,
                      roomNumber: selectRoomNumberId,
                      customerId: customerBookedSelected.customer_id,
                      ...(optionCheckIn === "CHECK_IN_ONE"
                        ? { bookingDetailsId: customerBookedSelected.id }
                        : {}),
                      status: "in_progress",
                    },
                  }
                : {}),
            },
            resetForm: { resetForm: resetForm! },
          })
        );
    },
    [selectRoomNumberId, customerBookedSelected, optionCheckIn, _checkIn, _checkOut]
  );

  return (
    <Table
      stickyHeader={false}
      columns={columns}
      autoHeight
      sxHeadCell={{
        background: (theme) => (theme.palette.mode === "dark" ? "#609966" : "#DDF7E3"),
      }}
    >
      {customerBookedCheckIns?.length
        ? customerBookedCheckIns.map((row) => (
            <Row
              onSubmit={handleSubmit}
              key={row.id}
              row={row}
              columns={columns}
              selected={id}
              onClick={(newName) => setId((prev) => (prev === newName ? "" : newName))}
            />
          ))
        : null}
    </Table>
  );
};

export default CollapsibleTable;

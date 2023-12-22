import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Stack, TableCell, TableRow, Typography } from "@mui/material";
import dayjs from "dayjs";
import { FC, useMemo } from "react";
import { ColumnState, TableCellOverride } from "~/components";
import { Colors } from "~/constants";
import { ForPage } from "~/layouts";
import { IGuestStayInformation } from "~/types";
import { fDateDayjs } from "~/utils";

const { Table } = ForPage;

type TableGuestInfoProps = {
  guests: IGuestStayInformation[];
  checkIn: string;
  checkOut: string;
  hiddenColumn?: "full_name" | "nationality" | "room_number" | "created_at" | "timeInProgress";
  onEdit?: (value: IGuestStayInformation) => void;
};

const TableGuestInfo: FC<TableGuestInfoProps> = ({
  hiddenColumn,
  guests,
  checkIn,
  checkOut,
  onEdit,
}) => {
  const columns = useMemo(() => {
    let data: ColumnState[] = [
      { id: "full_name", label: "Họ và tên" },
      { id: "nationality", label: "Thông tin cá nhân" },
      { id: "room_number", label: "Phòng" },
      {
        id: "created_at",
        label: "Thời gian khai báo",
        format(value) {
          return fDateDayjs(dayjs(value), "ddd, DD/MM/YYYY hh:mm");
        },
      },
      { id: "timeInProgress", label: "Thời gian lưu trú" },
    ];

    if (hiddenColumn) {
      data = data.filter((t) => t.id !== hiddenColumn);
    }

    return data;
  }, [hiddenColumn]);

  return (
    <Table
      autoHeight
      stickyHeader={false}
      size="small"
      columns={columns}
      sxHeadCell={{
        background: (theme) =>
          theme.palette.mode === "dark" ? Colors.GreenDark : Colors.GreenLight,
      }}
    >
      {guests?.length ? (
        guests.map((row) => (
          <TableRow sx={{ "& > *": { border: "none !important" } }} key={row.id}>
            {columns.map((column, index) => {
              const value = row[column.id as keyof IGuestStayInformation];

              if (column.id === "timeInProgress") {
                return (
                  <TableCellOverride key={index} {...column}>
                    <Stack
                      flexDirection={"row"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Typography fontSize={14}>
                        {" "}
                        {`${fDateDayjs(dayjs(checkIn), "ddd, DD/MM/YYYY hh:mm")} - ${fDateDayjs(
                          dayjs(checkOut),
                          "ddd, DD/MM/YYYY hh:mm"
                        )}`}
                      </Typography>

                      {onEdit ? (
                        <IconButton onClick={() => onEdit(row)} size="small">
                          <EditIcon fontSize="inherit" />
                        </IconButton>
                      ) : null}
                    </Stack>
                  </TableCellOverride>
                );
              }

              if (column.id === "nationality") {
                return (
                  <TableCellOverride key={index} {...column}>
                    {`QT: ${row.nationality} ${
                      row.birthday ? `- NS: ${dayjs(row.birthday).format("DD/MM/YYYY")}` : ``
                    }`}
                  </TableCellOverride>
                );
              }

              return (
                <TableCellOverride key={index} {...column}>
                  {column.format ? column.format(value) : value}
                </TableCellOverride>
              );
            })}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} align="center">
            Chưa có thông tin trú
          </TableCell>
        </TableRow>
      )}
    </Table>
  );
};

export default TableGuestInfo;

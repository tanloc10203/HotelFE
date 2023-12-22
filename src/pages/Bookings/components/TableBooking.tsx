import { TableCell, TableRow, useTheme } from "@mui/material";
import { FC } from "react";
import { Actions, ButtonActions, ColumnState } from "~/components";
import { ForPage } from "~/layouts";
import { BookingStatus, IBooking } from "~/types";
import { fActionConfirmBooking, fBookingStatusColor } from "~/utils";

const { Table } = ForPage;

type TableBookingProps = {
  data: IBooking[];
  columns: ColumnState[];
  page: number;
  totalPage?: number;
  onChangePage?: (newPage: number) => void;
};

const TableBooking: FC<TableBookingProps> = ({ columns, data, page, totalPage, onChangePage }) => {
  const {
    palette: { mode },
  } = useTheme();

  return (
    <Table
      onPageChange={onChangePage}
      columns={columns}
      page={page}
      totalRow={totalPage}
      sxHeadCell={{
        background: (theme) =>
          theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
      }}
    >
      {data?.length > 0 ? (
        data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((column) => {
              const value = row[column.id as keyof IBooking];

              if (column.id === "actions") {
                return (
                  <TableCell
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      ...column.styles,
                    }}
                    key={column.id}
                    component="th"
                    scope="row"
                    align={column.align}
                  >
                    <Actions>
                      <ButtonActions>Hành động</ButtonActions>
                      {fActionConfirmBooking(row.status)}
                    </Actions>
                  </TableCell>
                );
              }

              return (
                <TableCell
                  style={{
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    ...column.styles,
                    ...(column.id === "status"
                      ? {
                          color: fBookingStatusColor(value as BookingStatus, mode),
                        }
                      : {}),
                  }}
                  key={column.id}
                  component="th"
                  scope="row"
                  align={column.align}
                >
                  {column.format ? column.format(value as string) : (value as string)}
                </TableCell>
              );
            })}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} component="th" scope="row">
            Chưa có nhân viên nào
          </TableCell>
        </TableRow>
      )}
    </Table>
  );
};

export default TableBooking;

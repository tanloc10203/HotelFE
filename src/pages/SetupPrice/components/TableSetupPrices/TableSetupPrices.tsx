import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { IconButton, TableCell, TableRow, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import { upperFirst } from "lodash";
import { FC } from "react";
import { ColumnState, TableCellOverride } from "~/components";
import { Colors } from "~/constants";
import { ForPage } from "~/layouts";
import { PriceListState } from "~/types/priceList.model";
import { fDateDayjs } from "~/utils";
import { convertIsDefaultPriceList } from "~/utils/convert";

const { Table } = ForPage;

type TableSetupPricesProps = {
  data: PriceListState[];
  page?: number;
  totalPage?: number;
  onSeeDetails?: (prices: PriceListState) => void;
  onSeeEdit?: (prices: PriceListState) => void;
  onChangePage?: (page: number) => void;
};

const TableSetupPrices: FC<TableSetupPricesProps> = ({
  data,
  page,
  totalPage,
  onChangePage,
  onSeeDetails,
  onSeeEdit,
}) => {
  const columns: ColumnState[] = [
    { id: "id", label: "Mã bảng giá", align: "center" },
    { id: "name", label: "Tên bảng giá", align: "center" },
    { id: "description", label: "Mô tả bảng giá", align: "center" },
    {
      id: "start_time",
      label: "Ngày bắt đầu",
      align: "center",
      format(value) {
        return fDateDayjs(dayjs(value), "DD/MM/YYYY");
      },
    },
    {
      id: "end_time",
      label: "Ngày kết thúc",
      align: "center",
      format(value) {
        return fDateDayjs(dayjs(value), "DD/MM/YYYY");
      },
    },
    {
      id: "is_default",
      label: "Trạng thái",
      align: "center",
      format(value) {
        return convertIsDefaultPriceList(value);
      },
    },
    {
      id: "created_at",
      label: "Ngày tạo",
      align: "center",
      format(value) {
        return upperFirst(fDateDayjs(dayjs(value)));
      },
    },
    {
      id: "actions",
      label: "",
      align: "center",
    },
  ];

  return (
    <Table
      columns={columns}
      sxHeadCell={{
        background: ({ palette: { mode } }) =>
          mode === "light" ? Colors.GreenLight : Colors.GreenDark,
      }}
      page={page}
      onPageChange={onChangePage}
      totalRow={totalPage}
    >
      {data.length ? (
        data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((column, index) => {
              const value = row[column.id as keyof PriceListState];

              if (column.id === "is_default") {
                return (
                  <TableCellOverride {...column} key={index}>
                    <Typography
                      fontSize={14}
                      fontWeight={row.is_default ? 700 : 500}
                      color={row.is_default ? Colors.GreenDark : Colors.Red}
                    >
                      {column.format ? column.format(value) : (value as string)}
                    </Typography>
                  </TableCellOverride>
                );
              }

              if (column.id === "actions") {
                return (
                  <TableCellOverride {...column} key={index}>
                    <Tooltip title="Xem chi tiết">
                      <IconButton color="primary" onClick={() => onSeeDetails?.(row)}>
                        <RemoveRedEyeIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Chỉnh sửa" onClick={() => onSeeEdit?.(row)}>
                      <IconButton color="secondary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCellOverride>
                );
              }

              return (
                <TableCellOverride {...column} key={index}>
                  {column.format ? column.format(value) : (value as string)}
                </TableCellOverride>
              );
            })}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} align="center">
            Không có bảng giá nào
          </TableCell>
        </TableRow>
      )}
    </Table>
  );
};

export default TableSetupPrices;

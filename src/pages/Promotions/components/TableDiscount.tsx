import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { TableCell, TableRow } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Actions, ButtonActions, ColumnState } from "~/components";
import { discountActions, useDiscount } from "~/features/discount";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { DashboardPaths, IDiscount } from "~/types";
import { fCurrency, fDateTime } from "~/utils";

const { Table } = ForPage;

type TableDiscountProps = {
  onDelete?: (item: IDiscount) => void;
  onDetails?: (item: IDiscount) => void;
  onChangePrice?: (item: IDiscount) => void;
  onPriceDetails?: (item: IDiscount) => void;
};

const TableDiscount: FC<TableDiscountProps> = ({
  onDelete,
  onDetails,
  onChangePrice,
  onPriceDetails,
}) => {
  const { data, pagination, filters } = useDiscount();
  const dispatch = useAppDispatch();

  const columns = useMemo(
    (): ColumnState[] => [
      { id: "id", label: "Mã khuyến mãi", minWidth: 80, align: "center" },
      { id: "num_discount", label: "Số lượng", minWidth: 80, align: "center" },
      {
        id: "price_discount",
        label: "Giá tiền giảm",
        minWidth: 200,
        format(value) {
          return fCurrency(value as number);
        },
      },
      { id: "percent_discount", label: "Phần trăm", minWidth: 80, align: "center" },
      {
        id: "time_start",
        label: "Thời gian bắt đầu",
        minWidth: 200,
        format(value) {
          return fDateTime(value as string, "dd / MM / yyyy p");
        },
      },
      {
        id: "time_end",
        label: "Thời gian kết thúc",
        minWidth: 200,
        format(value) {
          return fDateTime(value as string, "dd / MM / yyyy p");
        },
      },
      { id: "status", label: "Trạng thái", minWidth: 80, align: "center" },
      {
        id: "actions",
        label: "Hành động",
        maxWidth: 150,
        minWidth: 150,
        styles: { padding: 0 },
        align: "center",
      },
    ],
    []
  );

  const handleOnDelete = useCallback(
    (item: IDiscount) => {
      if (!onDelete) return;
      onDelete(item);
    },
    [onDelete]
  );

  const handleOnDetails = useCallback(
    (item: IDiscount) => {
      if (!onDetails) return;
      onDetails(item);
    },
    [onDetails]
  );

  const handleOnChangePrice = useCallback(
    (item: IDiscount) => {
      if (!onChangePrice) return;
      onChangePrice(item);
    },
    [onChangePrice]
  );

  const handleOnPriceDetails = useCallback(
    (item: IDiscount) => {
      if (!onPriceDetails) return;
      onPriceDetails(item);
    },
    [onPriceDetails]
  );

  const handleChangePage = useCallback(
    (newPage: number) => {
      dispatch(discountActions.setFilter({ ...filters, page: newPage }));
    },
    [filters]
  );

  return (
    <Table
      columns={columns}
      sxHeadCell={{
        background: (theme) =>
          theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
      }}
      page={pagination.page}
      totalRow={pagination.totalPage}
      onPageChange={handleChangePage}
      minHeight={450}
    >
      {!data.length ? (
        <TableRow>
          <TableCell colSpan={columns.length} component="th" scope="row">
            Chưa có dữ liệu
          </TableCell>
        </TableRow>
      ) : (
        data.map((item) => (
          <TableRow key={item.id + ""}>
            {columns.map((column) => {
              const value = item[column.id as keyof IDiscount];

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
                      <ButtonActions
                        onClick={() => handleOnDelete(item)}
                        aria-label="delete"
                        startIcon={<DeleteIcon />}
                        color={"error"}
                      >
                        Xóa phòng
                      </ButtonActions>

                      <ButtonActions
                        LinkComponent={Link}
                        aria-label="edit"
                        to={DashboardPaths.UpdateRoom + `/${item.id}`}
                        startIcon={<EditIcon />}
                      >
                        Chỉnh sửa
                      </ButtonActions>

                      <ButtonActions
                        startIcon={<RemoveRedEyeIcon />}
                        aria-label="details"
                        onClick={() => handleOnDetails(item)}
                        color="secondary"
                      >
                        Xem chi tiết
                      </ButtonActions>

                      <ButtonActions
                        startIcon={<ChangeCircleIcon />}
                        aria-label="details"
                        onClick={() => handleOnChangePrice(item)}
                        color="info"
                      >
                        Thay đổi giá
                      </ButtonActions>
                      <ButtonActions
                        startIcon={<ReceiptLongIcon />}
                        aria-label="details"
                        onClick={() => handleOnPriceDetails(item)}
                        color="warning"
                      >
                        Bảng giá
                      </ButtonActions>
                    </Actions>
                  </TableCell>
                );
              }

              // if (column.id === "status") {
              //   const status = convertStatusRoom(value as StatusRoom);

              //   const color = colors(status.color);

              //   return (
              //     <TableCell
              //       style={{
              //         minWidth: column.minWidth,
              //         maxWidth: column.maxWidth,
              //         ...column.styles,
              //       }}
              //       key={column.id}
              //       component="th"
              //       scope="row"
              //       align={column.align}
              //     >
              //       <ChipOverride
              //         label={status.text}
              //         background={color.bgActive}
              //         colorOverride={color.colorActive}
              //       />
              //     </TableCell>
              //   );
              // }

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
                  {column.format && (typeof value === "number" || typeof value === "string")
                    ? column.format(value)
                    : (value as string)}
                </TableCell>
              );
            })}
          </TableRow>
        ))
      )}
    </Table>
  );
};

export default TableDiscount;

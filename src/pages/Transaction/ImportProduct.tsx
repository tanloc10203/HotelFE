import { Box, Button, LinearProgress, TableCell, TableRow } from "@mui/material";
import { FC, useCallback, useEffect } from "react";
import { ColumnState } from "~/components";
import { appActions } from "~/features/app";
import { goodsReceiptNoteActions, useGoodsReceiptNoteSelector } from "~/features/goodsReceiptNote";
import { serviceActions } from "~/features/service";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import {
  GoodsReceiptNotePayloadAdd,
  convertStatusGoodsReceiptNote,
} from "~/types/goodsReceiptNote";
import { fDateTime, fNumber } from "~/utils";
import DialogImportProduct from "./components/DialogImportProduct";
import RowProduct from "./components/RowProduct";

const { HeadSeo, Container, Title, Card, StackCategory, Table, Breadcrumbs } = ForPage;

const ImportProduct: FC = () => {
  const dispatch = useAppDispatch();
  const {
    goodsReceiptNote: { filters, isLoading, data, openAdd },
  } = useGoodsReceiptNoteSelector();

  useEffect(() => {
    dispatch(goodsReceiptNoteActions.getGoodsReceiptNoteStart({ ...filters, order: "created_at" }));
  }, [filters]);

  const columns: ColumnState[] = [
    { id: "id", label: "Mã nhập hàng" },
    { id: "quantity_ordered", align: "center", label: "Tổng SL" },
    {
      id: "total_cost",
      label: "Tổng chi phí",
      align: "center",
      format(value) {
        return fNumber(value);
      },
    },
    {
      id: "discount",
      label: "Giảm giá",
      align: "center",
      format(value) {
        return value <= 100 ? `${value}%` : fNumber(value);
      },
    },
    {
      id: "employee",
      label: "NV",
      align: "center",
      format(value) {
        return value?.display_name;
      },
    },
    {
      id: "supplier",
      label: "NCC",
      align: "center",
      format(value) {
        return value?.name;
      },
    },
    {
      id: "status",
      align: "center",
      label: "Trạng thái",
      format(value) {
        return convertStatusGoodsReceiptNote(value);
      },
    },
    {
      id: "created_at",
      align: "center",
      label: "Ngày nhập",
      format(value) {
        return fDateTime(value);
      },
    },
  ];

  const columnsDetails: ColumnState[] = [
    { id: "product_id", label: "Mã SP" },
    { id: "product", label: "SP" },
    { id: "quantity_ordered", align: "center", label: "Tổng SL" },
    {
      id: "price",
      label: "Đơn giá",
      align: "center",
      format(value) {
        return fNumber(value);
      },
    },
    {
      id: "discount",
      label: "Giảm giá",
      align: "center",
      format(value) {
        return value <= 100 ? `${value || 0}%` : fNumber(value);
      },
    },
    {
      id: "sub_total",
      label: "Thành tiền",
      align: "center",
      format(value) {
        return fNumber(value);
      },
    },
  ];

  const handleClose = useCallback(() => {
    dispatch(goodsReceiptNoteActions.setToggleAdd(false));
    dispatch(serviceActions.setImportProductDataEmpty());
  }, []);

  const handleOpen = useCallback(() => {
    dispatch(serviceActions.getDataSuccess({ message: "", metadata: [], options: undefined }));
    dispatch(goodsReceiptNoteActions.setToggleAdd(true));
  }, []);

  const handleSubmit = useCallback((data: GoodsReceiptNotePayloadAdd) => {
    dispatch(appActions.openOverplay("Đang nhập hàng hóa..."));
    dispatch(goodsReceiptNoteActions.addGoodsReceiptNoteStart(data));
  }, []);

  return (
    <ForPage>
      {openAdd ? (
        <DialogImportProduct open={openAdd} onSubmit={handleSubmit} onClose={handleClose} />
      ) : null}

      <HeadSeo title="Phiếu nhập hàng" />

      <Container maxWidth="xl">
        <Title title="Danh sách nhập hàng" mb={2} />
        <Breadcrumbs data={[{ label: "Danh sách nhập hàng" }]} mb={3} />

        <Card title="" sx={{ position: "relative" }}>
          {isLoading === "pending" ? (
            <Box
              sx={{
                width: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
              }}
            >
              <LinearProgress />
            </Box>
          ) : null}

          <StackCategory my={3}>
            <Box>
              <Button onClick={handleOpen} variant="contained">
                Nhập hàng
              </Button>
            </Box>
          </StackCategory>

          <Table autoHeight columns={columns}>
            {data.length ? (
              data.map((row) => (
                <RowProduct
                  key={row.id}
                  columns={columns}
                  columnsDetails={columnsDetails}
                  row={row}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  Chưa có phiếu nhập hàng nào
                </TableCell>
              </TableRow>
            )}
          </Table>
        </Card>
      </Container>
    </ForPage>
  );
};

export default ImportProduct;

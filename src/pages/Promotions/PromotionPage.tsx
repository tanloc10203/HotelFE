import { Box, LinearProgress, TextField } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useSnackbar } from "~/features/app";
import { discountActions, useDiscount } from "~/features/discount";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { IDiscount } from "~/types";
import { columnPercentGrid } from "~/utils";
import ActionDiscount from "./components/ActionDiscount";
import TableDiscount from "./components/TableDiscount";

const { HeadSeo, Container, Title, Card, StackCategory, Dialog, Breadcrumbs } = ForPage;

const PromotionPage = () => {
  const dispatch = useAppDispatch();
  const { filters, isLoading } = useDiscount();
  const { severity } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<{
    mode: "delete" | "details" | "changePrice" | null;
    data: IDiscount | null;
  }>({
    mode: null,
    data: null,
  });

  useEffect(() => {
    dispatch(discountActions.getDataStart(filters));
  }, [filters]);

  useEffect(() => {
    if (severity === "success") {
      setSelected({ mode: null, data: null });
      if (open) {
        setOpen(false);
      }
    }
  }, [severity, open]);

  const handleOnDetails = useCallback((room: IDiscount) => {
    setSelected({ mode: "details", data: room });
  }, []);

  const handleOnChangePrice = useCallback((room: IDiscount) => {
    setSelected({ mode: "changePrice", data: room });
  }, []);

  const handleOnDelete = useCallback((room: IDiscount) => {
    setSelected({ mode: "delete", data: room });
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleAgreeDelete = useCallback(() => {
    if (selected.mode === "delete" && selected.data) {
      dispatch(discountActions.deleteDataStart(selected.data));
    }
  }, [selected]);

  const handleChangeSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value },
      } = event;

      setSearch(value);
      dispatch(discountActions.setDebounceSearch({ ...filters, page: 0, name_like: value }));
    },
    [filters]
  );

  // const openDialog = useMemo(
  //   () => Boolean(selected.mode === "details" && selected.data),
  //   [selected]
  // );

  // const openDialogChangePrice = useMemo(
  //   () => Boolean(selected.mode === "changePrice" && selected.data),
  //   [selected]
  // );

  // const handleCloseDialogChangePrice = useCallback(() => {
  //   setSelected({ mode: null, data: null });
  // }, []);

  // const handleCloseDialogDetails = useCallback(() => {
  //   setSelected({ mode: null, data: null });
  // }, []);

  return (
    <ForPage>
      <HeadSeo title="Danh sách mã khuyến mãi" />

      <Container maxWidth="xl">
        <Title title="Danh sách mã khuyến mãi" mb={2} />

        <Breadcrumbs data={[{ label: "Dang sách mã khuyến mãi" }]} mb={3} />

        <Dialog
          onAgree={handleAgreeDelete}
          onClose={handleClose}
          maxWidth="xs"
          open={open}
          textContent="Bạn có chắc chắn muốn xóa"
          title={`Xóa \`${selected.data?.id}\``}
        />

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
            <Box sx={{ width: "100%" }}>
              <TextField
                onChange={handleChangeSearch}
                value={search}
                id="outlined-basic"
                label="Tìm kiếm"
                placeholder="Nhập mã giảm giá muốn tìm"
                variant="outlined"
                fullWidth
              />
            </Box>

            <Box width={`${columnPercentGrid(0.3)}%`}>
              <ActionDiscount />
            </Box>
          </StackCategory>

          <TableDiscount
            onDetails={handleOnDetails}
            onChangePrice={handleOnChangePrice}
            onDelete={handleOnDelete}
          />
        </Card>
      </Container>
    </ForPage>
  );
};

export default PromotionPage;

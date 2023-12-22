import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { ChangeEvent, FC, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  AppbarDialog,
  ColumnState,
  HtmlTooltip,
  InputQuantity,
  NumericFormatCustom,
  SelectInputAutoComplete,
  TableCellOverride,
  Transition,
} from "~/components";
import { Colors } from "~/constants";
import { useAttributes } from "~/contexts/AttributeContext";
import { useUnits } from "~/contexts/UnitContext";
import { appActions, useOverplay } from "~/features/app";
import { useUser } from "~/features/auth";
import { goodsReceiptNoteActions, useGoodsReceiptNoteSelector } from "~/features/goodsReceiptNote";
import { serviceActions, useServiceSelector } from "~/features/service";
import { serviceTypesActions } from "~/features/serviceTypes";
import { ForPage } from "~/layouts";
import FormDialogAddEditProduct from "~/pages/Services/form/FormDialogAddEditProduct";
import { useAppDispatch } from "~/stores";
import { ImportProductDataType, ProductPayload, SupplierType } from "~/types";
import { GoodsReceiptNotePayloadAdd, GoodsReceiptNoteProduct } from "~/types/goodsReceiptNote";
import { fNumber } from "~/utils";
import DialogAddSupplier from "../DialogAddSupplier";

const { Container, Grid, Table } = ForPage;

type DialogImportProductProps = {
  open: boolean;
  onClose?: () => void;
  onSubmit?: (data: GoodsReceiptNotePayloadAdd) => void;
};

const DialogImportProduct: FC<DialogImportProductProps> = ({ open, onClose, onSubmit }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const {
    importProductData: unitData,
    openAddEditProduct,
    isLoading,
    searching,
  } = useServiceSelector();
  const { open: loading } = useOverplay();
  const { supplier } = useGoodsReceiptNoteSelector();
  const [name, setName] = useState<string>("");
  const user = useUser();

  const [behavior, setBehavior] = useState<{
    mode: "price" | "discount" | null;
    click: boolean;
    serviceUnitId: string;
  }>({
    serviceUnitId: "",
    mode: null,
    click: false,
  });
  const [note, setNote] = useState("");
  const [discount, setDiscount] = useState(0);
  const [totalCostPayment, setTotalCostPayment] = useState(0);
  const { getUnits } = useUnits();
  const { getAttributes } = useAttributes();

  const initialValuesProduct = useMemo((): ProductPayload => {
    return {
      name: "",
      desc: "",
      service_type_id: "",
      note: "",
      // @ts-ignore
      timer: "",
      photo_public: "",
      // @ts-ignore
      price_original: "",
      // @ts-ignore
      price_sell: "",
      attributes: [],
      units: [{ is_sell: true, is_default: true, unit_id: 0 }],
      min_quantity_product: 5,
      quantity: 0,
    };
  }, []);

  useEffect(() => {
    dispatch(appActions.openOverplay("Đang tải dữ liệu"));
    dispatch(goodsReceiptNoteActions.getDataSupplierStart({ page: 1, limit: 9999 }));
    dispatch(serviceTypesActions.getDataStart({ limit: 9999, page: 1 }));
    getUnits();
    getAttributes();
  }, []);

  const handleSearchAll = useCallback(() => {
    dispatch(appActions.openOverplay("Đang tải dữ liệu"));
    dispatch(serviceActions.getDataStart({ limit: 100, page: 1, is_product: 1 }));
  }, []);

  const columns: ColumnState[] = [
    {
      id: "delete",
      label: "",
      minWidth: 30,
      maxWidth: 30,
      align: "center",
      styles: { padding: 0 },
    },
    {
      id: "stt",
      label: "STT",
      minWidth: 30,
      maxWidth: 30,
      align: "center",
      styles: { padding: 0 },
    },
    {
      id: "id",
      label: "Mã HH",
      minWidth: 60,
      align: "center",
    },
    {
      id: "name",
      label: "Tên hàng",
      minWidth: 100,
    },
    {
      id: "quantity",
      label: "Số lượng",
      minWidth: 100,
      maxWidth: 120,
      align: "center",
    },
    {
      id: "price",
      label: "Đơn giá",
      minWidth: 100,
      maxWidth: 100,
      align: "center",
    },
    {
      id: "subTotal",
      label: "Thành tiền",
      minWidth: 100,
      maxWidth: 100,
      align: "center",
    },
  ];

  const handleRemoveItem = useCallback((unitServiceId: string) => {
    dispatch(serviceActions.setRemoveItemImportProduct(unitServiceId));
  }, []);

  const handleChangeQuantity = useCallback((unitServiceId: string, quantity: number) => {
    dispatch(serviceActions.setChangeQuantity({ unitServiceId, quantity }));
  }, []);

  const handleClick = useCallback((mode: "price" | "discount", serviceUnitId: string) => {
    setBehavior({ mode, serviceUnitId, click: true });
  }, []);

  const handleOnMoveLeave = useCallback((mode: "price" | "discount") => {
    setBehavior({ mode, serviceUnitId: "", click: false });
  }, []);

  const handleChangePrice = useCallback((price: number, serviceUnitId: string) => {
    dispatch(serviceActions.setChangePrice({ price, unitServiceId: serviceUnitId }));
  }, []);

  const totalQuantity = useMemo(() => {
    if (!unitData.length) return { lastTotal: 0, total: 0, quantity: 0 };

    let total = unitData.reduce((t, v) => (t += v.subTotal_import), 0);
    const lastTotal = total;

    if (discount <= 100) {
      total -= (total * discount) / 100;
    } else {
      total -= discount;
    }

    setTotalCostPayment(total);

    return {
      lastTotal: lastTotal,
      total: total,
      quantity: unitData.reduce((t, v) => (t += v.quantity_import), 0),
    };
  }, [unitData, discount]);

  const handleClickFished = useCallback(() => {
    if (!user) return;

    if (!unitData.some((u) => u.quantity_import !== 0)) {
      dispatch(
        appActions.setSnackbar({
          open: true,
          severity: "error",
          text: "Bạn chưa nhập hàng hóa nào",
        })
      );
      return;
    }

    if (!supplier.selected) {
      dispatch(
        appActions.setSnackbar({
          open: true,
          severity: "error",
          text: "Vui lòng chọn nhà cung  cấp",
        })
      );
      return;
    }

    const products: GoodsReceiptNoteProduct[] = unitData
      .filter((t) => t.quantity_import !== 0)
      .map((t) => ({
        product_id: t.id!,
        unit_service_id: t.unit_service_id!,
        subTotal_import: t.subTotal_import,
        quantity_import: t.quantity_import,
        price_origin: t.priceData?.price_original!,
        price: t.unit_price!,
      }));

    const data: GoodsReceiptNotePayloadAdd = {
      products,
      note,
      discount,
      supplier_id: supplier.selected.id!,
      employee_id: user.id,
      quantity_ordered: totalQuantity.quantity,
      total_cost: totalQuantity.lastTotal,
      total_cost_paymented: totalCostPayment,
    };

    if (!onSubmit) return;

    onSubmit(data);
  }, [unitData, note, totalQuantity, supplier, user, totalCostPayment, onSubmit]);

  const handleChangeDiscount = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      if (Number(value) < 0) {
        setDiscount(0);
        return;
      }

      if (Number(value) > totalQuantity.lastTotal) {
        setDiscount(totalQuantity.lastTotal);
        return;
      }

      setDiscount(Number(value));
    },
    [totalQuantity]
  );

  const handleSubmitAddSupplier = useCallback((values: SupplierType, resetForm?: () => void) => {
    dispatch(appActions.openOverplay("Đang thêm nhà cung câp..."));
    dispatch(goodsReceiptNoteActions.addSupplierStart({ data: values, resetForm: resetForm! }));
  }, []);

  const handleOpenAddSupplier = useCallback(() => {
    dispatch(goodsReceiptNoteActions.setToggleSupplierOpen(true));
  }, []);

  const handleCloseAddSupplier = useCallback(() => {
    dispatch(goodsReceiptNoteActions.setToggleSupplierOpen(false));
  }, []);

  const handleSelectedSupplier = useCallback((value: any) => {
    dispatch(goodsReceiptNoteActions.setSelectedSupplier(value as SupplierType));
  }, []);

  const handleOnCloseDialogAddEditProduct = useCallback(() => {
    dispatch(serviceActions.setToggleAddEditProduct(false));
  }, []);

  const handleOnOpenDialogAddEditProduct = useCallback(() => {
    dispatch(serviceActions.setToggleAddEditProduct(true));
  }, []);

  const handleOnSubmitProduct = useCallback((values: ProductPayload, resetForm: () => void) => {
    dispatch(appActions.openOverplay(`Đang Thêm dữ liệu...`));
    dispatch(serviceActions.addDataProductStart({ ...values, resetForm }));
  }, []);

  const handleChangeName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    dispatch(serviceActions.setDebounceSearchingProduct(event.target.value));
  }, []);

  const handleChangeSelected = useCallback((_: any, value: ImportProductDataType | null) => {
    setName("");
    dispatch(serviceActions.resetSearching());
    if (!value) return;
    dispatch(serviceActions.pushDataImport(value));
  }, []);

  return (
    <Dialog TransitionComponent={Transition} open={open} onClose={onClose} fullScreen>
      <AppbarDialog title="Nhập hàng" onClose={onClose} />

      {openAddEditProduct ? (
        <FormDialogAddEditProduct
          textButton={"Thêm hàng hóa"}
          onClose={handleOnCloseDialogAddEditProduct}
          onSubmit={handleOnSubmitProduct}
          loading={loading}
          initialValues={initialValuesProduct}
        />
      ) : null}

      {supplier.open ? (
        <DialogAddSupplier
          open={supplier.open}
          onClose={handleCloseAddSupplier}
          initialValues={{
            id: "",
            name: "",
            phone_number: "",
            address: "",
            email: "",
            company_name: "",
            code_tax: "",
            note: "",
          }}
          onSubmit={handleSubmitAddSupplier}
        />
      ) : null}

      <DialogContent>
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid item lg={9}>
              <Stack flexDirection={"row"} gap={2}>
                <Stack width={500}>
                  <Autocomplete
                    onChange={handleChangeSelected}
                    isOptionEqualToValue={(option, value) =>
                      `${option.name} (${option.unit_name}) - tồn kho ${
                        !option.unit_is_default && option.unit_quantity_in_stock === 1
                          ? `${option?.units?.find((t) => t.is_default)?.quantity_in_stock} ${
                              option?.units?.find((t) => t.is_default)?.unitData?.name
                            }`
                          : option.unit_quantity_in_stock
                      }` ===
                      `${value.name} (${value.unit_name}) - tồn kho ${
                        !value.unit_is_default && value.unit_quantity_in_stock === 1
                          ? `${value?.units?.find((t) => t.is_default)?.quantity_in_stock} ${
                              value?.units?.find((t) => t.is_default)?.unitData?.name
                            }`
                          : value.unit_quantity_in_stock
                      }`
                    }
                    getOptionLabel={(option) =>
                      `${option.name} (${option.unit_name}) - tồn kho ${
                        !option.unit_is_default && option.unit_quantity_in_stock === 1
                          ? `${option?.units?.find((t) => t.is_default)?.quantity_in_stock} ${
                              option?.units?.find((t) => t.is_default)?.unitData?.name
                            }`
                          : option.unit_quantity_in_stock
                      }`
                    }
                    options={searching}
                    loading={isLoading === "pending"}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
                        <Typography fontSize={14} fontWeight={700}>
                          {`${option.name} `}
                          <i style={{ fontSize: 12, color: theme.palette.error.main }}>{`(${
                            option.unit_name
                          }) - tồn kho ${
                            !option.unit_is_default && option.unit_quantity_in_stock === 1
                              ? `${option?.units?.find((t) => t.is_default)?.quantity_in_stock} ${
                                  option?.units?.find((t) => t.is_default)?.unitData?.name
                                }`
                              : option.unit_quantity_in_stock
                          }`}</i>
                        </Typography>
                      </Box>
                    )}
                    renderInput={(params) => (
                      <>
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Tìm kiếm hàng hóa"
                          value={name}
                          onChange={handleChangeName}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon fontSize="inherit" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <Fragment>
                                <InputAdornment position="end">
                                  <Button onClick={handleSearchAll} size="small">
                                    Tất cả
                                  </Button>
                                  {isLoading === "pending" ? (
                                    <CircularProgress color="inherit" size={20} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </InputAdornment>
                              </Fragment>
                            ),
                          }}
                        />
                      </>
                    )}
                  />
                </Stack>

                <Button
                  onClick={handleOnOpenDialogAddEditProduct}
                  variant="contained"
                  startIcon={<AddIcon fontSize="small" />}
                  size="small"
                >
                  Thêm hàng hóa
                </Button>
              </Stack>

              <Stack mt={2}>
                <Stack mb={2}>
                  <Alert color="warning">Đơn giá sẽ có giá theo giá vốn bạn đã nhập</Alert>
                </Stack>

                <Table
                  columns={columns}
                  autoHeight
                  sxHeadCell={{
                    background: (theme) =>
                      theme.palette.mode === "light" ? Colors.GreenLight : Colors.GreenDark,
                  }}
                >
                  {unitData.length ? (
                    unitData.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            background: (theme) =>
                              theme.palette.mode === "light"
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                          },
                        }}
                      >
                        {columns.map((column) => {
                          const value = row[column.id as keyof ImportProductDataType];

                          console.log("====================================");
                          console.log(`row`, row);
                          console.log("====================================");

                          if (column.id === "stt") {
                            return (
                              <TableCellOverride key={column.id} {...column}>
                                {index + 1}
                              </TableCellOverride>
                            );
                          }

                          if (column.id === "delete") {
                            return (
                              <TableCellOverride key={column.id} {...column}>
                                <Tooltip title="Bỏ chọn" placement="top" arrow>
                                  <IconButton
                                    onClick={() => handleRemoveItem(row.unit_service_id)}
                                    size="small"
                                  >
                                    <DeleteForeverIcon fontSize="inherit" />
                                  </IconButton>
                                </Tooltip>
                              </TableCellOverride>
                            );
                          }

                          if (column.id === "price") {
                            return (
                              <TableCellOverride
                                onClick={() => handleClick("price", row.unit_service_id)}
                                onMouseDown={() => handleClick("price", row.unit_service_id)}
                                onMouseLeave={() => handleOnMoveLeave("price")}
                                key={column.id}
                                {...column}
                              >
                                {behavior.click &&
                                behavior.mode === "price" &&
                                behavior.serviceUnitId === row.unit_service_id ? (
                                  <TextField
                                    size="small"
                                    value={row.unit_price}
                                    onChange={({ target: { value } }) =>
                                      handleChangePrice(+value, row.unit_service_id)
                                    }
                                    InputProps={{ inputComponent: NumericFormatCustom as any }}
                                  />
                                ) : (
                                  <Typography fontSize={14}>
                                    {fNumber(row.unit_price || 0)}
                                  </Typography>
                                )}
                              </TableCellOverride>
                            );
                          }

                          if (column.id === "quantity") {
                            return (
                              <TableCellOverride key={column.id} {...column}>
                                <InputQuantity
                                  max={350}
                                  key={row.unit_service_id}
                                  onChangeValue={(value) =>
                                    handleChangeQuantity(row.unit_service_id, value)
                                  }
                                  value={row.quantity_import}
                                />
                              </TableCellOverride>
                            );
                          }

                          if (column.id === "subTotal") {
                            return (
                              <TableCellOverride key={column.id} {...column}>
                                {fNumber(row.subTotal_import)}
                              </TableCellOverride>
                            );
                          }

                          if (column.id === "name") {
                            return (
                              <TableCellOverride key={column.id} {...column}>
                                <Typography fontSize={14} fontWeight={700}>
                                  {`${row.name} `}
                                  <i style={{ fontSize: 12, color: theme.palette.error.main }}>{`(${
                                    row.unit_name
                                  }) - tồn kho ${
                                    !row.unit_is_default && row.unit_quantity_in_stock === 1
                                      ? `${
                                          row?.units?.find((t) => t.is_default)?.quantity_in_stock
                                        } ${row?.units?.find((t) => t.is_default)?.unitData?.name}`
                                      : row.unit_quantity_in_stock
                                  }`}</i>
                                </Typography>
                              </TableCellOverride>
                            );
                          }

                          return (
                            <TableCellOverride key={column.id} {...column}>
                              {column.format ? column.format(value) : (value as string)}
                            </TableCellOverride>
                          );
                        })}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length}>Không có hàng hóa</TableCell>
                    </TableRow>
                  )}
                </Table>
              </Stack>
            </Grid>

            <Grid item lg={3}>
              <Stack component={Paper} elevation={2} height={"100%"} p={1} py={3}>
                <Stack width={"100%"}>
                  <SelectInputAutoComplete
                    multiple={false}
                    options={supplier.data}
                    keyOption="name"
                    size="small"
                    onChange={handleSelectedSupplier}
                    placeholder="Tìm nhà cung cấp"
                    disableCloseOnSelect={false}
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon fontSize="inherit" />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={handleOpenAddSupplier}>
                          <AddIcon fontSize="inherit" />
                        </IconButton>
                      </InputAdornment>
                    }
                    value={supplier.selected}
                    label={""}
                  />
                </Stack>

                <Stack mt={2} gap={3}>
                  <Stack
                    width={"100%"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Typography fontSize={13} fontWeight={700}>
                      Mã phiếu nhập
                    </Typography>

                    <Stack width={200}>
                      <TextField
                        sx={{
                          "& input": { fontSize: 14 },
                        }}
                        disabled
                        size="small"
                        variant="standard"
                        placeholder="Mã phiếu tự động"
                      />
                    </Stack>
                  </Stack>
                  <Stack
                    width={"100%"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Typography fontSize={13} fontWeight={700}>
                      Trạng thái
                    </Typography>

                    <Stack width={150}>
                      <TextField disabled size="small" variant="standard" placeholder="Phiếu tạm" />
                    </Stack>
                  </Stack>

                  <Stack
                    width={"100%"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Stack
                      flexDirection={"row"}
                      alignItems={"center"}
                      gap={1}
                      position={"relative"}
                    >
                      <Typography fontSize={13} fontWeight={700}>
                        Tổng tiền hàng
                      </Typography>

                      <Stack
                        position={"absolute"}
                        top={-16}
                        right={-16}
                        border={(theme) => `1px solid ${theme.palette.grey[200]}`}
                        minWidth={30}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Typography fontSize={12}>{totalQuantity.quantity}</Typography>
                      </Stack>
                    </Stack>

                    <Stack width={150}>
                      <TextField
                        sx={{
                          "& input": {
                            fontSize: 14,
                            color: (theme) => theme.palette.error.main,
                            "-webkit-text-fill-color": "unset !important",
                          },
                        }}
                        value={totalQuantity.lastTotal}
                        disabled
                        size="small"
                        variant="standard"
                        placeholder="0"
                        InputProps={{
                          inputComponent: NumericFormatCustom as any,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography fontSize={12} fontWeight={700}>
                                VNĐ
                              </Typography>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>
                  </Stack>

                  <Stack
                    width={"100%"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Typography fontSize={13} fontWeight={700}>
                      Giảm giá
                    </Typography>

                    <Stack width={150}>
                      <TextField
                        sx={{
                          "& input": { fontSize: 14 },
                        }}
                        size="small"
                        variant="standard"
                        value={discount}
                        onChange={handleChangeDiscount}
                        placeholder="0"
                        InputProps={{
                          inputComponent: NumericFormatCustom as any,
                          endAdornment: (
                            <InputAdornment position="end">
                              <HtmlTooltip
                                arrow
                                placement="left"
                                title={
                                  <Stack gap={1}>
                                    <Typography fontSize={14}>
                                      Nếu giảm giá <b>lớn hơn 100</b> sẽ được tính là{" "}
                                      <b style={{ color: theme.palette.error.main }}>
                                        số tiền giảm giá.
                                      </b>
                                    </Typography>
                                    <Typography fontSize={14}>
                                      Ngược lại <b>nhỏ hơn bằng 100</b> sẽ tính là{" "}
                                      <b style={{ color: theme.palette.error.main }}>
                                        phần trăm giảm giá.
                                      </b>
                                    </Typography>
                                  </Stack>
                                }
                              >
                                <Stack fontSize={14} flexDirection={"row"} gap={0.5}>
                                  <QuestionMarkIcon fontSize="inherit" />
                                  <Typography fontSize={12} fontWeight={700}>
                                    {discount <= 100 ? "%" : "VNĐ"}
                                  </Typography>
                                </Stack>
                              </HtmlTooltip>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>
                  </Stack>

                  <Divider />

                  <Stack
                    width={"100%"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    gap={0.1}
                  >
                    <Stack
                      flexDirection={"row"}
                      alignItems={"center"}
                      gap={1}
                      position={"relative"}
                    >
                      <Typography fontSize={12} fontWeight={700}>
                        Cần trả nhà cung cấp
                      </Typography>
                    </Stack>

                    <Stack width={150}>
                      <TextField
                        sx={{
                          "& input": {
                            color: (theme) => theme.palette.primary.main,
                            fontSize: 14,
                            "-webkit-text-fill-color": "unset !important",
                          },
                        }}
                        value={totalCostPayment}
                        onChange={({ target: { value } }) => setTotalCostPayment(Number(value))}
                        size="small"
                        variant="standard"
                        placeholder="0"
                        InputProps={{
                          inputComponent: NumericFormatCustom as any,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography fontSize={12} fontWeight={700}>
                                VNĐ
                              </Typography>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>
                  </Stack>

                  <Stack
                    width={"100%"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    gap={0.1}
                  >
                    <Stack
                      flexDirection={"row"}
                      alignItems={"center"}
                      gap={1}
                      position={"relative"}
                    >
                      <Typography fontSize={12} fontWeight={700}>
                        Tiền trả nhà cung cấp
                      </Typography>
                    </Stack>

                    <Stack width={150}>
                      <TextField
                        sx={{
                          "& input": {
                            color: (theme) => theme.palette.primary.main,
                            fontSize: 14,
                            "-webkit-text-fill-color": "unset !important",
                          },
                        }}
                        value={totalQuantity.total}
                        disabled
                        size="small"
                        variant="standard"
                        placeholder="Phiếu tạm"
                        InputProps={{
                          inputComponent: NumericFormatCustom as any,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography fontSize={12} fontWeight={700}>
                                VNĐ
                              </Typography>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>
                  </Stack>

                  <Stack>
                    <TextField
                      multiline
                      sx={{
                        "& textarea": {
                          fontSize: 14,
                        },
                      }}
                      size="small"
                      variant="standard"
                      placeholder="Ghi chú"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EditNoteIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      value={note}
                      onChange={({ target: { value } }) => setNote(value)}
                    />
                  </Stack>

                  <Stack>
                    <Button
                      startIcon={<CheckIcon />}
                      onClick={handleClickFished}
                      color="success"
                      variant="contained"
                    >
                      Hoàn thành
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default DialogImportProduct;

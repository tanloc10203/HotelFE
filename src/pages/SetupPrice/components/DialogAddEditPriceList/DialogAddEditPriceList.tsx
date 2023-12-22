import {
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { Form, FormikProvider, useFormik } from "formik";
import { cloneDeep } from "lodash";
import { FC, Fragment, useCallback, useState } from "react";
import { toast } from "react-toastify";
import {
  AppbarDialog,
  ColumnState,
  EndAdornmentVND,
  NumericFormatCustom,
  TableCellOverride,
  Transition,
} from "~/components";
import { Colors, SCROLLBAR_CUSTOM } from "~/constants";
import { ForPage } from "~/layouts";
import SwitchShowDiscount from "~/pages/Rooms/form/SwitchShowDiscount";
import { IPriceByHour, IRoomType } from "~/types";
import { PriceListState } from "~/types/priceList.model";
import { priceListSchema } from "../../schema/priceListSchema";
import DatePickerPriceList from "./DatePickerPriceList";
import PriceByHour from "./PriceByHour";
import { RenderItemPriceByHour } from "./RenderItemPriceByHour";

const { Card, Table } = ForPage;

type DialogAddEditPriceListProps = {
  initialValues: PriceListState;
  open: boolean;
  onClose?: () => void;
  onSubmit?: (data: PriceListState, resetForm: () => void) => void;
};

const DialogAddEditPriceList: FC<DialogAddEditPriceListProps> = ({
  open,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const [showTimeEnd, setShowTimeEnd] = useState(false);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: priceListSchema,
    onSubmit: (values, { resetForm, setErrors }) => {
      let timeEnd = dayjs(values.end_time);
      let timeStart = dayjs(values.start_time);
      let compare = timeEnd.diff(timeStart, "days", true);

      if (timeStart.isToday()) {
        compare = timeEnd.diff(timeStart, "days", true);
      }

      if (compare < 7) {
        setErrors({ end_time: "Ngày kết thúc ít nhất 7 ngày kể từ ngày bắt đầu." });
        return;
      }

      const data = [...values?.roomTypes!];

      if (data.some((t) => +t?.prices!.price_offline === 0 || +t?.prices!.price_online === 0)) {
        toast.error("Có giá đã bằng 0");
        return;
      }

      let isCheckPriceHourIsZero = false;

      data.forEach((t) => {
        if (!t.prices?.price_hours.every((t) => t.start_hour)) {
          toast.error(`Loại phòng \`${t.name}\`. Không được phép tạo giờ = ${0}`);
          isCheckPriceHourIsZero = true;
          return;
        }
      });

      if (isCheckPriceHourIsZero) {
        return;
      }

      if (!onSubmit) return;
      onSubmit?.(values, resetForm);
    },
  });

  const {
    errors,
    touched,
    values,
    handleSubmit,
    setFieldError,
    setFieldTouched,
    getFieldProps,
    setFieldValue,
  } = formik;

  const handleChangeDateTimePicker = useCallback(
    async (type: "start_time" | "end_time", date: Dayjs) => {
      await Promise.all([setFieldTouched(type, true), setFieldValue(type, date.toDate())]);

      let currentValue = dayjs(date);
      let dateOfType = dayjs(values.start_time);

      let compare: number = 0;
      let message = "";

      if (type === "start_time") {
        setShowTimeEnd(true);
        dateOfType = dayjs(values.end_time);
        compare = dateOfType.diff(currentValue, "days", true);
      }

      if (type === "end_time") {
        compare = currentValue.diff(dateOfType, "days", true);
      }

      message = "Ngày kết thúc ít nhất 7 ngày kể từ ngày bắt đầu.";

      if (compare < 6) {
        setFieldError("end_time", message);
        return;
      }
    },
    [values]
  );

  const handleAddNewPriceByHour = useCallback(
    async (price: IPriceByHour) => {
      const results = price.price - 200000;

      const add: IPriceByHour = {
        price: results < 0 ? 100000 : results,
        room_type_id: price.room_type_id,
        start_hour: price.start_hour + 1,
      };

      const lastData: IRoomType[] = cloneDeep([...values?.roomTypes!]);

      const index = lastData.findIndex((t) => t.id === price.room_type_id);

      if (index === -1) return;

      lastData[index]!.prices!.price_hours.push(add);

      await setFieldValue("roomTypes", lastData);
    },
    [values]
  );

  const handleRemove = useCallback(
    async (index: number, price: IPriceByHour) => {
      const lastData: IRoomType[] = cloneDeep([...values?.roomTypes!]);

      const idx = lastData.findIndex((t) => t.id === price.room_type_id);

      if (idx === -1) return;

      lastData[idx]!.prices!.price_hours = [
        ...lastData[idx]!.prices!.price_hours.filter((_, idxx) => idxx !== index),
      ];

      await setFieldValue("roomTypes", lastData);
    },
    [values]
  );

  const handleChangePriceDay = useCallback(
    async (type: "price_online" | "price_offline", value: string, roomTypeId: number) => {
      const lastData: IRoomType[] = cloneDeep([...values?.roomTypes!]);

      const idx = lastData.findIndex((t) => t.id === roomTypeId);

      if (idx === -1) return;

      lastData[idx]!.prices! = {
        ...lastData[idx]?.prices!,
        [type]: Number(value),
      };

      await setFieldValue("roomTypes", lastData);
    },
    [values]
  );

  const handleChangeValue = useCallback(
    async (type: "price" | "start_hour", value: string, price: IPriceByHour, index: number) => {
      const lastData: IRoomType[] = cloneDeep([...values?.roomTypes!]);

      const idx = lastData.findIndex((t) => t.id === price.room_type_id);

      if (idx === -1) return;

      if (type === "start_hour") {
        if (Number(value) === 0) {
          toast.error(`Không được phép tạo giờ = ${value}`);
          return;
        }

        const idxx = lastData[idx]!.prices!.price_hours.findIndex(
          (t) => t.start_hour === Number(value)
        );

        if (idxx !== -1 && idxx !== index) {
          toast.error(`Giờ ${value} đã bị trùng`);
          return;
        }
      }

      lastData[idx]!.prices!.price_hours[index] = {
        ...lastData[idx]!.prices!.price_hours[index],
        [type]: Number(value),
      };

      await setFieldValue("roomTypes", lastData);
    },
    [values]
  );

  const handleChangeIsDefault = useCallback(async (value: boolean) => {
    await setFieldValue("is_default", value);
  }, []);

  const columns: ColumnState[] = [
    { id: "name", label: "Loại phòng", minWidth: 50, maxWidth: 50 },
    {
      id: "type_price",
      label: "Loại giá",
      minWidth: 30,
      maxWidth: 30,
      styles: { padding: 0 },
      align: "center",
    },
    { id: "set_price", label: "Mức giá", minWidth: 40, maxWidth: 160 },
  ];

  return (
    <FormikProvider value={formik}>
      <Dialog TransitionComponent={Transition} open={open} fullScreen onClose={onClose}>
        <AppbarDialog
          title={initialValues.id ? `Cập nhật bảng giá` : `Thêm bảng giá loại phòng`}
          onClose={onClose}
        />

        <DialogContent sx={SCROLLBAR_CUSTOM}>
          <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3} mt={2}>
              <Grid item md={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item md={4}>
                    <Typography variant="h6">Chi tiết</Typography>
                    <Typography variant="body2" color={"text.secondary"}>
                      Thông tin chi tiết về bảng giá
                    </Typography>
                  </Grid>

                  <Grid item md={8}>
                    <Card
                      title=""
                      sx={{
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item lg={12}>
                          <TextField
                            fullWidth
                            disabled
                            label="Mã bảng giá"
                            placeholder="VD: Mã tự động tạo"
                            {...getFieldProps("id")}
                            error={touched.id && Boolean(errors.id)}
                            helperText={touched.id && errors.id}
                          />
                        </Grid>
                        <Grid item lg={12}>
                          <TextField
                            fullWidth
                            label="Tên bảng giá"
                            placeholder="VD: Bảng giá tháng 1"
                            {...getFieldProps("name")}
                            error={touched?.name && Boolean(errors?.name)}
                            helperText={touched?.name && errors?.name}
                          />
                        </Grid>

                        <Grid item lg={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Mô tả bảng giá"
                            placeholder="VD: Không bắt buộc"
                            {...getFieldProps("description")}
                            error={touched.description && Boolean(errors.description)}
                            helperText={touched.description && errors.description}
                          />
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={12} xs={12}>
                <Grid container spacing={2} justifyContent="flex-end" direction="row">
                  <Grid item md={4} xs={12}>
                    <Typography variant="h6">Thời gian sử dụng bảng giá</Typography>
                    <Typography variant="body2" color={"text.secondary"}>
                      Thời gian bắt đầu, thời gian kết thúc.
                    </Typography>
                  </Grid>
                  <Grid item md={8} xs={12}>
                    <Card
                      title=""
                      sx={{
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <Grid container spacing={1}>
                        <Grid item lg={6}>
                          <DatePickerPriceList
                            disabled={Boolean(initialValues.id)}
                            minDate={dayjs(
                              initialValues.start_time ? initialValues.start_time : undefined
                            )}
                            value={dayjs(values.start_time)}
                            onChange={(date) => handleChangeDateTimePicker("start_time", date)}
                            error={touched.start_time && Boolean(errors.start_time)}
                            helperText={touched.start_time && errors.start_time}
                            label="Ngày bắt đầu"
                          />
                        </Grid>

                        <Grid item lg={6}>
                          {showTimeEnd || Boolean(values.end_time) ? (
                            <DatePickerPriceList
                              minDate={dayjs(values.start_time)}
                              value={dayjs(values.end_time)}
                              onChange={(date) => handleChangeDateTimePicker("end_time", date)}
                              error={touched.end_time && Boolean(errors.end_time)}
                              helperText={touched.end_time && errors.end_time}
                              label="Ngày kết thúc"
                            />
                          ) : null}
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={12} xs={12}>
                <Grid container spacing={2} justifyContent="flex-end" direction="row">
                  <Grid item md={4} xs={12}>
                    <Typography variant="h6">Thiết lập giá phòng</Typography>
                    <Typography variant="body2" color={"text.secondary"}>
                      Cho giá chi tiết từng phòng
                    </Typography>
                  </Grid>
                  <Grid item md={8} xs={12}>
                    <Card
                      title=""
                      sx={{
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <Table
                        autoHeight
                        columns={columns}
                        sxHeadCell={{
                          background: ({ palette: { mode } }) =>
                            mode === "light" ? Colors.GreenLight : Colors.GreenDark,
                        }}
                      >
                        {values.roomTypes?.length ? (
                          values.roomTypes.map((row, idxP) => (
                            <Fragment key={row.id}>
                              {/* Set time */}
                              <TableRow
                                sx={{
                                  background: ({ palette: { mode, grey } }) =>
                                    idxP % 2 === 0
                                      ? mode === "light"
                                        ? grey[100]
                                        : grey[800]
                                      : mode === "light"
                                      ? "white"
                                      : grey[800],
                                  "& th:nth-of-type(1)": { borderBottom: "none !important" },
                                }}
                              >
                                {columns.map((column, index) => {
                                  const value = row[column.id as keyof IRoomType];

                                  if (column.id === "type_price") {
                                    return (
                                      <TableCellOverride {...column} key={index}>
                                        Mỗi giờ
                                      </TableCellOverride>
                                    );
                                  }

                                  if (column.id === "set_price") {
                                    return (
                                      <TableCellOverride {...column} key={index}>
                                        <PriceByHour data={row?.prices?.price_hours || []}>
                                          {row?.prices?.price_hours?.map((priceHour, idx, old) => (
                                            <Collapse key={idx}>
                                              <RenderItemPriceByHour
                                                isShowAdd={Boolean(old.length - 1 === idx)}
                                                index={idx}
                                                price={priceHour}
                                                onAddNewPrice={handleAddNewPriceByHour}
                                                onRemove={handleRemove}
                                                onChangeValue={handleChangeValue}
                                              />
                                            </Collapse>
                                          ))}
                                        </PriceByHour>
                                      </TableCellOverride>
                                    );
                                  }

                                  return (
                                    <TableCellOverride key={index} {...column}>
                                      {value as string}
                                    </TableCellOverride>
                                  );
                                })}
                              </TableRow>

                              {/* Set days */}
                              <TableRow
                                sx={{
                                  background: ({ palette: { mode, grey } }) =>
                                    idxP % 2 === 0
                                      ? mode === "light"
                                        ? grey[100]
                                        : grey[800]
                                      : mode === "light"
                                      ? "white"
                                      : grey[800],
                                  "& th:nth-of-type(1)": {
                                    borderBottom: "none !important",
                                    borderTop: "none !important",
                                  },
                                }}
                              >
                                {columns.map((column, index) => {
                                  if (column.id === "type_price") {
                                    return (
                                      <TableCellOverride {...column} key={index}>
                                        Mỗi ngày
                                      </TableCellOverride>
                                    );
                                  }

                                  if (column.id === "set_price") {
                                    return (
                                      <TableCellOverride {...column} key={index}>
                                        <Stack flexDirection={"row"} gap={1}>
                                          <Stack>
                                            <TextField
                                              label="Giá offline"
                                              size="small"
                                              onChange={({ target: { value } }) =>
                                                handleChangePriceDay(
                                                  "price_offline",
                                                  value,
                                                  row.id!
                                                )
                                              }
                                              value={row?.prices?.price_offline}
                                              InputProps={{
                                                inputComponent: NumericFormatCustom as any,
                                                endAdornment: <EndAdornmentVND />,
                                              }}
                                            />
                                          </Stack>

                                          <Stack>
                                            <TextField
                                              label="Giá online"
                                              size="small"
                                              onChange={({ target: { value } }) =>
                                                handleChangePriceDay("price_online", value, row.id!)
                                              }
                                              value={row?.prices?.price_online}
                                              InputProps={{
                                                inputComponent: NumericFormatCustom as any,
                                                endAdornment: <EndAdornmentVND />,
                                              }}
                                            />
                                          </Stack>
                                        </Stack>
                                      </TableCellOverride>
                                    );
                                  }

                                  return (
                                    <TableCellOverride key={index} {...column}>
                                      <></>
                                    </TableCellOverride>
                                  );
                                })}
                              </TableRow>
                            </Fragment>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={columns.length}>Chưa có loại phòng nào</TableCell>
                          </TableRow>
                        )}
                      </Table>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        </DialogContent>

        <DialogActions>
          <SwitchShowDiscount
            {...getFieldProps("is_default")}
            value={Boolean(values.is_default)}
            onChecked={handleChangeIsDefault}
            label="Đây là bảng giá mặc định"
          />
          <Button
            onClick={handleSubmit as () => void}
            variant="contained"
            sx={{ px: 5, py: 1, ml: 2 }}
            color={initialValues.id ? "success" : "primary"}
          >
            {initialValues.id ? `Lưu bảng giá` : `Tạo bảng giá`}
          </Button>
        </DialogActions>
      </Dialog>
    </FormikProvider>
  );
};

export default DialogAddEditPriceList;

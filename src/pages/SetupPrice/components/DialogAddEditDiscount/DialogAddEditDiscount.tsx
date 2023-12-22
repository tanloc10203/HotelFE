import {
  Alert,
  AutocompleteChangeDetails,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { Form, FormikProvider, useFormik } from "formik";
import { cloneDeep } from "lodash";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  AppbarDialog,
  ColumnState,
  EndAdornmentDiscount,
  NumericFormatCustom,
  SelectInputAutoComplete,
  TableCellOverride,
  Transition,
} from "~/components";
import { Colors, SCROLLBAR_CUSTOM } from "~/constants";
import { ForPage } from "~/layouts";
import DateTimePickerDiscount from "~/pages/Rooms/form/DateTimePickerDiscount";
import SwitchShowDiscount from "~/pages/Rooms/form/SwitchShowDiscount";
import { IDiscount, IRoomType } from "~/types";
import { PriceListState } from "~/types/priceList.model";
import { priceListSchema } from "../../schema/priceListSchema";
import { fNumber } from "~/utils";

const { Card, Table } = ForPage;

type DialogAddEditDiscountProps = {
  initialValues: PriceListState;
  roomType: IRoomType[];
  open: boolean;
  onClose?: () => void;
  onSubmit?: (data: PriceListState, resetForm: () => void) => void;
};

const DialogAddEditDiscount: FC<DialogAddEditDiscountProps> = ({
  open,
  initialValues,
  roomType,
  onClose,
  onSubmit,
}) => {
  const [showTimeEnd, setShowTimeEnd] = useState(false);
  const lastRoomTypes = useRef<IRoomType[]>(initialValues.roomTypes);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: priceListSchema,
    onSubmit: (values, { resetForm, setErrors }) => {
      let timeEnd = dayjs(values.end_time);
      let timeStart = dayjs(values.start_time);

      let compare = timeEnd.diff(timeStart, "hours", true);

      if (timeStart.isToday()) {
        compare = timeEnd.diff(timeStart, "hours", true);
      }

      if (compare < 5) {
        setErrors({ end_time: "Thời gian kết thúc ít nhất 5h đồng hồ kể từ khi bắt đầu." });
        return;
      }

      const data = cloneDeep([...values?.roomTypes!]) as IRoomType[];

      let isPriceOutMin = false;

      data.forEach((detail) => {
        const priceMinOfPriceHours = detail?.prices?.price_hours.sort(
          (a, b) => a.price - b.price
        )[0];

        const priceMin = Math.min(
          priceMinOfPriceHours?.price || 0,
          detail.prices!.price_offline,
          detail.prices!.price_online
        );

        if (Number(detail?.discount?.price) <= 100 && Number(detail?.discount?.price) > 50) {
          isPriceOutMin = true;
          toast.error(`Loại phòng ${detail.name} có giá tiền khuyến mãi lớn hơn ${50} %`);
          return;
        }

        if ((detail?.discount?.price || 0) > priceMin / 2) {
          isPriceOutMin = true;
          toast.error(
            `Loại phòng ${detail.name} có giá tiền khuyến mãi lớn hơn ${fNumber(priceMin / 2)}`
          );
          return;
        }
      });

      if (isPriceOutMin) return;

      if (!data.length) {
        toast.error("Vui lòng chọn phòng khuyến mãi");
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

  useEffect(() => {
    lastRoomTypes.current = values.roomTypes;
  }, [values]);

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
        compare = dateOfType.diff(currentValue, "hours", true);
      }

      if (type === "end_time") {
        compare = currentValue.diff(dateOfType, "hours", true);
      }

      message = "Thời gian kết thúc ít nhất 5h đồng hồ kể từ khi bắt đầu.";

      if (compare < 5) {
        setFieldError("end_time", message);
        return;
      }
    },
    [values]
  );

  const handleChangeIsDefault = useCallback(async (value: boolean) => {
    setFieldValue("is_default", value);
  }, []);

  const handleChangeRoomTypes = useCallback(
    (
      value: Record<string, any> | Record<string, any>[] | null,
      _: any,
      details?: AutocompleteChangeDetails<Record<string, any> | Record<string, any>[] | null>
    ) => {
      if (!Array.isArray(value) || !details?.option) {
        setFieldValue("roomTypes", []);
        return;
      }

      if (!value.length) {
        setFieldValue("roomTypes", []);
        return;
      }

      let detail = cloneDeep(details.option) as IRoomType;
      let roomTypes = cloneDeep(value) as IRoomType[];

      const priceMinOfPriceHours = detail?.prices?.price_hours.sort((a, b) => a.price - b.price)[0];

      const priceMin = Math.min(
        priceMinOfPriceHours?.price || 0,
        detail.prices!.price_offline,
        detail.prices!.price_online
      );

      const discount: IDiscount = {
        code_used: 0,
        is_public: true,
        num_discount: 0,
        price: priceMin / 2,
        price_list_id: "",
        room_type_id: detail.id!,
        status: "using",
        time_end: "",
        time_start: "",
        ...detail.discount,
      };

      detail = { ...detail, discount };

      const index = roomTypes.findIndex((rt) => rt.id === detail.id);

      if (index === -1) {
        setFieldValue("roomTypes", [...roomTypes.filter((t) => t.id !== detail.id)]);
        return;
      }

      roomTypes[index] = detail;

      setFieldValue("roomTypes", roomTypes);
    },
    []
  );

  const handleChangeValue = useCallback(
    (type: "price" | "num_discount" | "is_public", value: string | boolean, roomTypeId: number) => {
      const roomTypes = cloneDeep([...lastRoomTypes.current]);

      const index = roomTypes.findIndex((t) => t.id === roomTypeId);

      if (index === -1) return;

      if (type === "is_public") {
        roomTypes[index]!.discount = {
          ...roomTypes[index]?.discount!,
          is_public: Boolean(value),
        };
      }

      if (type === "num_discount") {
        roomTypes[index]!.discount = {
          ...roomTypes[index]?.discount!,
          num_discount: Number(value),
        };
      }

      if (type === "price") {
        roomTypes[index]!.discount = {
          ...roomTypes[index]?.discount!,
          price: Number(value),
        };
      }

      lastRoomTypes.current = roomTypes;

      setFieldValue("roomTypes", roomTypes);
    },
    [lastRoomTypes.current]
  );

  const columns: ColumnState[] = [
    { id: "name", label: "Loại phòng", minWidth: 80, maxWidth: 80 },
    {
      id: "price",
      label: "Giá tiền khuyến mãi",
      minWidth: 80,
      maxWidth: 80,
      align: "center",
    },
    {
      id: "num_discount",
      label: "SL KM",
      minWidth: 30,
      maxWidth: 30,
      align: "center",
    },
    { id: "is_public", label: "Hiển thị / Ẩn", minWidth: 40, maxWidth: 40, align: "center" },
  ];

  return (
    <FormikProvider value={formik}>
      <Dialog TransitionComponent={Transition} open={open} fullScreen onClose={onClose}>
        <AppbarDialog
          title={initialValues.id ? `Cập nhật bảng giá khuyến mãi` : `Thêm bảng giá khuyến mãi`}
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
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
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
                    <Typography variant="h6">Thời gian sử dụng bảng giá khuyến mãi</Typography>
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
                          <DateTimePickerDiscount
                            disabled={Boolean(initialValues.id)}
                            minDateTime={dayjs(
                              initialValues.start_time ? initialValues.start_time : undefined
                            )}
                            value={values.start_time}
                            onChange={(date) => handleChangeDateTimePicker("start_time", date)}
                            error={touched.start_time && Boolean(errors.start_time)}
                            helperText={touched.start_time && errors.start_time}
                            label="Thời gian bắt đầu"
                          />
                        </Grid>

                        <Grid item lg={6}>
                          {showTimeEnd || Boolean(values.end_time) ? (
                            <DateTimePickerDiscount
                              value={values.end_time}
                              minDateTime={dayjs(values.start_time)}
                              onChange={(date) => handleChangeDateTimePicker("end_time", date)}
                              error={touched.end_time && Boolean(errors.end_time)}
                              helperText={touched.end_time && errors.end_time}
                              label="Thời gian kết thúc"
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
                    <Typography variant="h6">Thiết lập giá khuyến mãi</Typography>
                    <Typography variant="body2" color={"text.secondary"}>
                      Cho giá khuyến mãi mà loại phòng bạn chọn
                    </Typography>
                  </Grid>

                  <Grid item md={8} xs={12}>
                    <Card title="">
                      <SelectInputAutoComplete
                        keyOption="name"
                        label="Chọn loại phòng"
                        options={roomType}
                        value={values.roomTypes}
                        onChange={handleChangeRoomTypes}
                      />

                      <Box my={2}>
                        <Alert
                          title="Nếu số lượng bằng 0 sẽ không có giới hạn sử dụng"
                          color="warning"
                        >
                          Nếu số lượng bằng 0 sẽ không có giới hạn sử dụng
                        </Alert>
                      </Box>

                      <Table
                        autoHeight
                        sxHeadCell={{
                          background: ({ palette: { mode } }) =>
                            mode === "light" ? Colors.GreenLight : Colors.GreenDark,
                        }}
                        columns={columns}
                      >
                        {values?.roomTypes?.length ? (
                          values.roomTypes.map((row) => {
                            if (!row?.prices?.price_hours?.length) return null;

                            const pricesHours = cloneDeep(row?.prices?.price_hours);

                            const priceMinOfPriceHours = [
                              ...pricesHours.sort((a, b) => a?.price - b?.price),
                            ];

                            let priceMin = Math.min(
                              priceMinOfPriceHours ? priceMinOfPriceHours[0]?.price : 0,
                              row.prices?.price_offline || 0,
                              row.prices?.price_online || 0
                            );

                            priceMin = priceMin / 2;

                            return (
                              <TableRow key={row.id}>
                                {columns.map((column, idx) => {
                                  const value = row[column.id as keyof IRoomType];

                                  if (column.id === "price") {
                                    return (
                                      <TableCellOverride {...column} key={idx}>
                                        <TextField
                                          label="Giá tiền khuyến mãi"
                                          size="small"
                                          value={row?.discount?.price}
                                          fullWidth
                                          onChange={({ target: { value } }) =>
                                            handleChangeValue("price", value, row.id!)
                                          }
                                          InputProps={{
                                            inputComponent: NumericFormatCustom as any,
                                            endAdornment: (
                                              <EndAdornmentDiscount
                                                discount={row?.discount?.price}
                                              />
                                            ),
                                          }}
                                        />

                                        <Box mt={0.4}>
                                          <Typography fontSize={13} fontStyle={"italic"}>
                                            Giá thấp nhất{" "}
                                            {priceMin > 0
                                              ? fNumber(priceMin)
                                              : "`hiện tại chưa có`"}
                                          </Typography>
                                        </Box>
                                      </TableCellOverride>
                                    );
                                  }

                                  if (column.id === "num_discount") {
                                    return (
                                      <TableCellOverride {...column} key={idx}>
                                        <TextField
                                          label="SLKM"
                                          size="small"
                                          onChange={({ target: { value } }) =>
                                            handleChangeValue("num_discount", value, row.id!)
                                          }
                                          value={row?.discount?.num_discount}
                                        />
                                      </TableCellOverride>
                                    );
                                  }

                                  if (column.id === "is_public") {
                                    return (
                                      <TableCellOverride {...column} key={idx}>
                                        <SwitchShowDiscount
                                          key={idx}
                                          value={Boolean(row?.discount?.is_public)}
                                          onChecked={(value) =>
                                            handleChangeValue("is_public", value, row.id!)
                                          }
                                          label=""
                                        />
                                      </TableCellOverride>
                                    );
                                  }

                                  return (
                                    <TableCellOverride {...column} key={idx}>
                                      {value as string}
                                    </TableCellOverride>
                                  );
                                })}
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={columns.length}>
                              Chưa có loại phòng nào khuyến mãi
                            </TableCell>
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
            label="Đây là bảng giá khuyến mãi mặc định"
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

export default DialogAddEditDiscount;

import { LoadingButton } from "@mui/lab";
import { Alert, Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, memo, useCallback, useEffect, useState } from "react";
import {
  AppbarDialog,
  EndAdornmentDiscount,
  EndAdornmentVND,
  NumericFormatCustom,
  RadioInput,
  Transition,
} from "~/components";
import { SCROLLBAR_CUSTOM } from "~/constants";
import { useRoom } from "~/features/room";
import { ForPage } from "~/layouts";
import { IRoomResponse, RoomPayloadChangePrice } from "~/types";
import { changePriceSchema } from "../schema/changePriceSchema";
import DateTimePickerDiscount from "./DateTimePickerDiscount";
import SwitchShowDiscount from "./SwitchShowDiscount";

type FormDialogAddDiscountProps = {
  selected: IRoomResponse;
  initialValues: RoomPayloadChangePrice;
  open: boolean;
  onClose: () => void;
  onSubmit?: (...args: any[]) => void;
};

const { Grid, Card } = ForPage;

const FormDialogAddDiscount: FC<FormDialogAddDiscountProps> = ({
  selected,
  open,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const [showTimeEnd, setShowTimeEnd] = useState(false);

  useEffect(() => {
    if (!initialValues.time_start) return;
    setShowTimeEnd(true);
  }, [initialValues]);

  const { isLoading } = useRoom();

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: changePriceSchema(
      Math.min(
        initialValues.price_day,
        initialValues.price_day_online,
        initialValues.price_hour,
        initialValues.price_hour_online
      )
    ),
    onSubmit: (values, { resetForm, setErrors }) => {
      let timeEnd = dayjs(values.time_end);
      let timeStart = dayjs(values.time_start);
      const timeNow = dayjs();

      const compareWithTimeEnd = timeEnd.diff(timeNow, "h", true);
      const compareWithTimeStart = timeStart.diff(timeNow, "h", true);

      if (!values.id) {
        if (compareWithTimeStart < 0) {
          setErrors({
            time_start: `Thời gian bắt đầu phải lớn hơn thời gian hiện tại \`${timeNow.format(
              "HH:mm"
            )}\``,
          });
          return;
        }

        if (compareWithTimeEnd < 0) {
          setErrors({
            time_end: `Thời gian kết thúc phải lớn hơn thời gian hiện tại \`${timeNow.format(
              "HH:mm"
            )}\` và lớn hơn thời gian bắt đầu 5h.`,
          });
          return;
        }
      }

      const compare = timeEnd.diff(timeStart, "hours", true);
      const after = timeEnd.isAfter(timeStart, "hours");

      if (compare < 5) {
        if (after) {
          setErrors({ time_end: "Thời gian kết thúc ít nhất 5h đồng hồ kể từ khi bắt đầu." });
          return;
        }

        setErrors({
          time_start: "Thời gian bắt đầu lơn hơn hoặc từ 5h đồng hồ so với thời gian kết thúc.",
        });
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
    async (type: "time_end" | "time_start", date: Dayjs) => {
      await Promise.all([setFieldTouched(type, true), setFieldValue(type, date.toDate())]);

      let currentValue = dayjs(date);
      let dateOfType = dayjs(values.time_start);

      let compare: number = 0;
      let message = "";

      if (type === "time_start") {
        setShowTimeEnd(true);
        dateOfType = dayjs(values.time_end);
        compare = dateOfType.diff(currentValue, "hours", true);
        message = "Thời gian bắt đầu lơn hơn hoặc từ 5h đồng hồ so với thời gian kết thúc.";
      }

      if (type === "time_end") {
        compare = currentValue.diff(dateOfType, "hours", true);
        message = "Thời gian kết thúc ít nhất 5h đồng hồ kể từ khi bắt đầu.";
      }

      if (compare < 5) {
        setFieldError(type, message);
        return;
      }
    },
    [values]
  );

  const handleChangeSwitch = useCallback(
    async (value: boolean) => await setFieldValue("is_public", value),
    []
  );

  return (
    <FormikProvider value={formik}>
      <Dialog TransitionComponent={Transition} open={open} onClose={onClose} fullScreen>
        <AppbarDialog
          title={`Giảm giá cho loại phòng ${selected.roomType?.name}`}
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
                      Số lượng sử dụng, loại giảm giá, giá hoặc phần trăm giảm...
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
                      <Grid container spacing={1}>
                        <Grid item lg={6}>
                          <TextField
                            fullWidth
                            disabled
                            label="Giá theo ngày"
                            placeholder="VD: 1.000.000"
                            {...getFieldProps("price_day")}
                            error={touched.price_day && Boolean(errors.price_day)}
                            helperText={touched.price_day && errors.price_day}
                            margin="normal"
                            InputProps={{
                              endAdornment: <EndAdornmentVND />,
                              inputComponent: NumericFormatCustom as any,
                            }}
                          />
                        </Grid>
                        <Grid item lg={6}>
                          <TextField
                            fullWidth
                            disabled
                            label="Giá theo giờ"
                            placeholder="VD: 1.000.000"
                            {...getFieldProps("price_hour")}
                            error={touched.price_hour && Boolean(errors.price_hour)}
                            helperText={touched.price_hour && errors.price_hour}
                            margin="normal"
                            InputProps={{
                              endAdornment: <EndAdornmentVND />,
                              inputComponent: NumericFormatCustom as any,
                            }}
                          />
                        </Grid>

                        <Grid item lg={6}>
                          <TextField
                            fullWidth
                            disabled
                            label="Giá đặt phòng online theo ngày"
                            placeholder="VD: 1.000.000"
                            {...getFieldProps("price_day_online")}
                            error={touched.price_day_online && Boolean(errors.price_day_online)}
                            helperText={touched.price_day_online && errors.price_day_online}
                            margin="normal"
                            InputProps={{
                              endAdornment: <EndAdornmentVND />,
                              inputComponent: NumericFormatCustom as any,
                            }}
                          />
                        </Grid>

                        <Grid item lg={6}>
                          <TextField
                            fullWidth
                            disabled
                            label="Giá đặt phòng online theo giờ"
                            placeholder="VD: 1.000.000"
                            {...getFieldProps("price_hour_online")}
                            error={touched.price_hour_online && Boolean(errors.price_hour_online)}
                            helperText={touched.price_hour_online && errors.price_hour_online}
                            margin="normal"
                            InputProps={{
                              endAdornment: <EndAdornmentVND />,
                              inputComponent: NumericFormatCustom as any,
                            }}
                          />
                        </Grid>
                      </Grid>

                      <TextField
                        label="Số lượng sử dụng"
                        placeholder="VD: 3"
                        fullWidth
                        {...getFieldProps("num_discount")}
                        error={touched.num_discount && Boolean(errors.num_discount)}
                        helperText={touched.num_discount && errors.num_discount}
                        margin="normal"
                      />

                      <Alert
                        title="Nếu số lượng bằng 0 sẽ không có giới hạn sử dụng"
                        color="warning"
                      >
                        Nếu số lượng bằng 0 sẽ không có giới hạn sử dụng
                      </Alert>

                      <RadioInput
                        label="Loại giảm giá"
                        {...getFieldProps("type")}
                        data={[
                          { label: "Giảm theo giá", value: "price" },
                          { label: "Giảm theo phân trăm", value: "percent" },
                        ]}
                        error={touched.type && Boolean(errors.type)}
                        helperText={touched.type && errors.type}
                      />

                      {values.type === "price" ? (
                        <TextField
                          fullWidth
                          label="Giá"
                          placeholder="VD: 330000"
                          {...getFieldProps("price_discount")}
                          error={touched.price_discount && Boolean(errors.price_discount)}
                          helperText={touched.price_discount && errors.price_discount}
                          margin="normal"
                          id="formatted-numberformat-input"
                          InputProps={{
                            inputComponent: NumericFormatCustom as any,
                            endAdornment: <EndAdornmentVND />,
                          }}
                        />
                      ) : null}

                      {values.type === "percent" ? (
                        <TextField
                          fullWidth
                          label="Phần trăm"
                          placeholder="VD: 330000"
                          {...getFieldProps("percent_discount")}
                          error={touched.percent_discount && Boolean(errors.percent_discount)}
                          helperText={touched.percent_discount && errors.percent_discount}
                          margin="normal"
                          InputProps={{
                            endAdornment: <EndAdornmentDiscount />,
                          }}
                        />
                      ) : null}

                      <Alert title="Sử dụng cho tất cả các loại giá" color="warning">
                        Sử dụng cho tất cả các loại giá
                      </Alert>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={12} xs={12}>
                <Grid container spacing={2} justifyContent="flex-end" direction="row">
                  <Grid item md={4} xs={12}>
                    <Typography variant="h6">Thời gian khuyến mãi</Typography>
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
                            value={values.time_start}
                            onChange={(date) => handleChangeDateTimePicker("time_start", date)}
                            error={touched.time_start && Boolean(errors.time_start)}
                            helperText={touched.time_start && errors.time_start}
                            label="Thời gian bắt đầu"
                          />
                        </Grid>
                        <Grid item lg={6}>
                          {showTimeEnd ? (
                            <DateTimePickerDiscount
                              value={values.time_end}
                              onChange={(date) => handleChangeDateTimePicker("time_end", date)}
                              error={touched.time_end && Boolean(errors.time_end)}
                              helperText={touched.time_end && errors.time_end}
                              label="Thời gian kết thúc"
                            />
                          ) : null}
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>

                  <Grid item md={8} xs={12}>
                    <Stack
                      justifyContent={"space-between"}
                      flexDirection={"row"}
                      alignItems={"center"}
                    >
                      <SwitchShowDiscount
                        {...getFieldProps("is_public")}
                        onChecked={handleChangeSwitch}
                        label="Phát hành khuyến mãi"
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        </DialogContent>
        <DialogActions sx={{ pb: 3, pr: 3 }}>
          <Button onClick={onClose} variant="contained" color="error">
            Hủy bỏ
          </Button>
          <LoadingButton
            type="submit"
            size="medium"
            onClick={handleSubmit as () => void}
            variant="contained"
            disabled={isLoading === "pending"}
            loading={isLoading === "pending"}
          >
            <span>Lưu thay đổi</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </FormikProvider>
  );
};

export default memo(FormDialogAddDiscount);

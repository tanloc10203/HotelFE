import { LoadingButton } from "@mui/lab";
import { Box, Stack, TextField, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useCallback, useState } from "react";
import { NumericFormatCustom, RadioInput } from "~/components";
import { useDiscount } from "~/features/discount";
import { ForPage } from "~/layouts";
import { DiscountPayload } from "~/types";
import { discountSchema } from "../schema/discountSchema";
import DateTimePickerDiscount from "./DateTimePickerDiscount";
import SwitchShowDiscount from "./SwitchShowDiscount";

const { Grid, Card } = ForPage;

interface FormAddEditDiscountProps {
  initialValues: DiscountPayload;
  onSubmit?: (...args: any[]) => void;
  textButton: string;
}

const FormAddEditDiscount: FC<FormAddEditDiscountProps> = ({
  onSubmit,
  initialValues,
  textButton,
}) => {
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: discountSchema,
    onSubmit: (values, { resetForm, setErrors }) => {
      if (!onSubmit) return;

      let timeEnd = dayjs(values.time_end);
      let timeStart = dayjs(values.time_start);

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

      onSubmit?.(values, resetForm);
    },
  });

  const { isLoading } = useDiscount();
  const [showTimeEnd, setShowTimeEnd] = useState(false);

  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    values,
    setFieldError,
    setFieldValue,
    setFieldTouched,
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
      <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
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
                  <TextField
                    label="Số lượng sử dụng"
                    placeholder="VD: 3"
                    fullWidth
                    {...getFieldProps("num_discount")}
                    error={touched.num_discount && Boolean(errors.num_discount)}
                    helperText={touched.num_discount && errors.num_discount}
                    margin="normal"
                  />

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
                    />
                  ) : null}
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
                  <DateTimePickerDiscount
                    value={values.time_start}
                    onChange={(date) => handleChangeDateTimePicker("time_start", date)}
                    error={touched.time_start && Boolean(errors.time_start)}
                    helperText={touched.time_start && errors.time_start}
                    label="Thời gian bắt đầu"
                  />
                  {showTimeEnd ? (
                    <DateTimePickerDiscount
                      value={values.time_end}
                      onChange={(date) => handleChangeDateTimePicker("time_end", date)}
                      error={touched.time_end && Boolean(errors.time_end)}
                      helperText={touched.time_end && errors.time_end}
                      label="Thời gian kết thúc"
                    />
                  ) : null}
                </Card>
              </Grid>

              <Grid item md={8} xs={12}>
                <Stack justifyContent={"space-between"} flexDirection={"row"} alignItems={"center"}>
                  <SwitchShowDiscount
                    {...getFieldProps("is_public")}
                    onChecked={handleChangeSwitch}
                    label="Được phép sử dụng"
                  />
                  <Box>
                    <LoadingButton
                      type="submit"
                      size="large"
                      variant="contained"
                      sx={{ mt: 2 }}
                      disabled={isLoading === "pending"}
                      loading={isLoading === "pending"}
                    >
                      <span>{textButton}</span>
                    </LoadingButton>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
};

export default FormAddEditDiscount;

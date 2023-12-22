import CheckIcon from "@mui/icons-material/Check";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Button, Divider, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { ChangeEvent, FC, useCallback } from "react";
import {
  EndAdornmentDiscount,
  EndAdornmentVND,
  InputBill,
  NumericFormatCustom,
} from "~/components";
import { BillInfoPayload } from "~/types";
import { calcWithDiscount } from "~/utils/convert";
import { billSchema } from "../../schemas/billSchema";

type BillProps = {
  initialValues: BillInfoPayload;
  isPaid: boolean;
  onSubmit?: (values: BillInfoPayload, resetForm?: () => void) => void;
  disabled?: boolean;
  isBookingTime?: boolean;
};

const Bill: FC<BillProps> = ({ initialValues, onSubmit, isPaid, disabled }) => {
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: billSchema(initialValues.customerRequirePay > 0 ? false : true),
    onSubmit(values, formikHelpers) {
      if (!isPaid && Number(values.customerPay) < Number(values.customerRequirePay)) {
        formikHelpers.setErrors({ customerPay: "Số tiền thanh toán không đủ" });
        return;
      }

      if (!onSubmit) return;
      onSubmit(values, formikHelpers.resetForm);
    },
  });

  const { errors, touched, values, handleSubmit, getFieldProps, handleChange } = formik;

  const onChangeDiscount = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      handleChange("discount")(value);

      const discount = Number(value);

      let totalCostCustomerRequiredPay = calcWithDiscount(
        values.totalCostRoom + values.totalCostService,
        discount
      );

      handleChange("customerRequirePay")(`${Math.round(totalCostCustomerRequiredPay)}`);
    },
    [values]
  );

  const onChangeDeposit = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      handleChange("deposit")(value);

      const deposit = Number(value);

      let totalCostCustomerRequiredPay =
        values.totalCostRoom +
        values.totalCostService -
        (values.discount > 100
          ? values.discount
          : values.customerRequirePay * (values.discount / 100)) -
        deposit;

      let change = values.customerPay > 0 ? totalCostCustomerRequiredPay - values.customerPay : 0;

      handleChange("change")(`${Math.round(change)}`);

      handleChange("customerRequirePay")(`${Math.round(totalCostCustomerRequiredPay)}`);
    },
    [values]
  );

  const onChangeCustomerPay = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      handleChange("customerPay")(value);

      const customerPay = Number(value);

      let change = customerPay - values.customerRequirePay;

      handleChange("change")(`${Math.round(change)}`);
    },
    [values]
  );

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
        <Stack height={"100%"}>
          <Stack gap={3}>
            <InputBill
              label="Tổng tiền phòng"
              inputProps={{
                disabled: true,
                sx: {
                  "& input": {
                    fontSize: 14,
                    WebkitTextFillColor: "unset !important",
                    fontWeight: 700,
                    ...(isPaid
                      ? {
                          color: (theme) => theme.palette.success.main,
                        }
                      : { color: (theme) => theme.palette.error.main }),
                  },
                },
                ...getFieldProps("totalCostRoom"),
                error: touched.totalCostRoom && Boolean(errors.totalCostRoom),
                helperText: touched.totalCostRoom && errors.totalCostRoom,
                placeholder: "0",
                InputProps: {
                  inputComponent: NumericFormatCustom as any,
                  endAdornment: <EndAdornmentVND />,
                },
              }}
            />

            <InputBill
              label="Tổng tiền hàng"
              subLabel={
                <Stack
                  position={"absolute"}
                  top={-16}
                  right={-16}
                  border={(theme) => `1px solid ${theme.palette.grey[200]}`}
                  minWidth={30}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Typography fontSize={12}>{initialValues.totalQuantityOrdered}</Typography>
                </Stack>
              }
              inputProps={{
                disabled: true,
                sx: {
                  "& input": {
                    fontSize: 14,
                    WebkitTextFillColor: "unset !important",
                    color: (theme) => theme.palette.success.main,
                    fontWeight: 700,
                  },
                },
                ...getFieldProps("totalCostService"),
                error: touched.totalCostService && Boolean(errors.totalCostService),
                helperText: touched.totalCostService && errors.totalCostService,
                placeholder: "0",
                InputProps: {
                  inputComponent: NumericFormatCustom as any,
                  endAdornment: <EndAdornmentVND />,
                },
              }}
            />

            <InputBill
              label="Đã thanh toán tiền phòng"
              inputProps={{
                disabled: true,
                sx: {
                  "& input": {
                    fontSize: 14,
                    WebkitTextFillColor: "unset !important",
                    fontWeight: 700,
                    ...(isPaid
                      ? {
                          textDecoration: "line-through",
                          color: (theme) => theme.palette.success.main,
                        }
                      : { color: (theme) => theme.palette.error.main }),
                  },
                },
                ...getFieldProps("paymentCost"),
                error: touched.paymentCost && Boolean(errors.paymentCost),
                helperText: touched.paymentCost && errors.paymentCost,
                placeholder: "0",
                InputProps: {
                  inputComponent: NumericFormatCustom as any,
                  endAdornment: <EndAdornmentVND />,
                },
              }}
            />

            <Divider />

            <InputBill
              label="Giảm giá"
              inputProps={{
                placeholder: "0",
                ...getFieldProps("discount"),
                onChange: onChangeDiscount,
                error: touched.discount && Boolean(errors.discount),
                helperText: touched.discount && errors.discount,
                InputProps: {
                  inputComponent: NumericFormatCustom as any,
                  endAdornment: <EndAdornmentDiscount discount={values.discount} />,
                },
              }}
            />

            <InputBill
              label="Tiền trả phòng trễ"
              inputProps={{
                disabled: true,
                sx: {
                  "& input": {
                    fontSize: 14,
                    color: (theme) => theme.palette.error.main,
                    WebkitTextFillColor: "unset !important",
                    fontWeight: 700,
                  },
                },
                ...getFieldProps("costOverCheckOut"),
                error: touched.costOverCheckOut && Boolean(errors.costOverCheckOut),
                helperText: touched.costOverCheckOut && errors.costOverCheckOut,
                placeholder: "0",
                InputProps: {
                  inputComponent: NumericFormatCustom as any,
                  endAdornment: <EndAdornmentVND />,
                },
              }}
            />

            <InputBill
              label="Tiền nhận phòng sớm"
              inputProps={{
                disabled: true,
                sx: {
                  "& input": {
                    fontSize: 14,
                    color: (theme) => theme.palette.error.main,
                    WebkitTextFillColor: "unset !important",
                    fontWeight: 700,
                  },
                },
                ...getFieldProps("costLateCheckIn"),
                error: touched.costLateCheckIn && Boolean(errors.costLateCheckIn),
                helperText: touched.costLateCheckIn && errors.costLateCheckIn,
                placeholder: "0",
                InputProps: {
                  inputComponent: NumericFormatCustom as any,
                  endAdornment: <EndAdornmentVND />,
                },
              }}
            />

            <InputBill
              label="Tiền khách cọc trước"
              inputProps={{
                placeholder: "0",
                ...getFieldProps("deposit"),
                onChange: onChangeDeposit,
                error: touched.deposit && Boolean(errors.deposit),
                helperText: touched.deposit && errors.deposit,
                InputProps: {
                  inputComponent: NumericFormatCustom as any,
                  endAdornment: <EndAdornmentVND />,
                },
              }}
            />

            <InputBill
              label="Khách cần trả"
              inputProps={{
                disabled: true,
                sx: {
                  "& input": {
                    fontSize: 14,
                    color: (theme) => theme.palette.error.main,
                    fontWeight: 700,
                    WebkitTextFillColor: "unset !important",
                  },
                },
                ...getFieldProps("customerRequirePay"),
                error: touched.customerRequirePay && Boolean(errors.customerRequirePay),
                helperText: touched.customerRequirePay && errors.customerRequirePay,
                placeholder: "0",
                InputProps: {
                  inputComponent: NumericFormatCustom as any,
                  endAdornment: <EndAdornmentVND />,
                },
              }}
            />

            <InputBill
              label="Khách thanh toán"
              inputProps={{
                placeholder: "0",
                ...getFieldProps("customerPay"),
                onChange: onChangeCustomerPay,
                error: touched.customerPay && Boolean(errors.customerPay),
                helperText: touched.customerPay && errors.customerPay,
                InputProps: {
                  inputComponent: NumericFormatCustom as any,
                  endAdornment: <EndAdornmentVND />,
                },
              }}
            />

            <InputBill
              label="Tiền thừa khách trả"
              inputProps={{
                disabled: true,
                placeholder: "0",
                ...getFieldProps("change"),
                error: touched.change && Boolean(errors.change),
                helperText: touched.change && errors.change,
                InputProps: {
                  inputComponent: NumericFormatCustom as any,
                  endAdornment: <EndAdornmentVND />,
                },
              }}
            />

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
                {...getFieldProps("note")}
                error={touched.note && Boolean(errors.note)}
                helperText={touched.note && errors.note}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EditNoteIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <Stack>
              <Button
                disabled={disabled}
                startIcon={<CheckIcon />}
                type="submit"
                color="success"
                variant="contained"
              >
                Hoàn thành
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Form>
    </FormikProvider>
  );
};

export default Bill;

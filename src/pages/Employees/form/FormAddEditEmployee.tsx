import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { LoadingButton } from "@mui/lab";
import {
  AutocompleteChangeReason,
  Box,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { InputSecure, SelectInput } from "~/components";
import { RadioState } from "~/components/shared/form/RadioInput";
import { ForPage } from "~/layouts";
import FormSelectChangeRole from "~/pages/RoleEmployee/components/FormSelectChangeRole";
import { IDepartment, IEmployeePayload, IPosition, RolePayload } from "~/types";
import { addEditEmployeeSchema } from "../schema";

const { Grid, Card } = ForPage;

const statues = [
  { label: "Hoạt động", value: "active" },
  { label: "Không hoạt động", value: "inactive" },
  { label: "Cấm hoạt động", value: "banned" },
  { label: "Về hưu", value: "retired" },
];

interface FormAddEditEmployeeProps {
  initialValues: IEmployeePayload;
  onSubmit?: (...args: any[]) => void;
  optionsRoles?: RolePayload[];
  defaultRoles?: RolePayload[];
  optionsDepartment?: IDepartment[];
  optionsPosition?: IPosition[];
  isEditMode: boolean;
}

const dataRadio = [
  { label: "Nam", value: "MALE" },
  { label: "Nữ", value: "FEMALE" },
];

const SPACING = 150;
const BORDER_RADIUS = SPACING / 2;
const SPACING_CHILD = 150 - 16;
const BORDER_RADIUS_CHILD = SPACING_CHILD / 2;

const FormAddEditEmployee: FC<FormAddEditEmployeeProps> = ({
  onSubmit,
  initialValues,
  optionsRoles,
  optionsDepartment,
  optionsPosition,
  defaultRoles,
  isEditMode,
}) => {
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: addEditEmployeeSchema(isEditMode),
    onSubmit: (values, { resetForm }) => {
      if (!onSubmit) return;
      onSubmit?.(values, resetForm);
    },
  });
  const theme = useTheme();

  const [values, setValues] = useState<RolePayload[]>([]);

  useEffect(() => {
    if (!defaultRoles?.length) return;
    setValues(defaultRoles);
  }, [defaultRoles]);

  const { errors, touched, handleSubmit, getFieldProps, setFieldValue } = formik;

  const handleChangeValues = useCallback(
    async (values: RolePayload[], _reason: AutocompleteChangeReason, _payload?: RolePayload) => {
      const uniqueSet = new Set(values);
      setValues([...uniqueSet]);
      if (!values.length) return await setFieldValue("roles", null);
      const roles = values.map((value) => ({ id: value.id! }));
      await setFieldValue("roles", roles);
    },
    []
  );

  const optionsDepartmentConvert = useMemo((): RadioState[] => {
    if (!optionsDepartment?.length) return [];
    const options = optionsDepartment.map((value) => ({ value: value.id + "", label: value.name }));
    return options as RadioState[];
  }, [optionsDepartment]);

  const optionsPositionConvert = useMemo((): RadioState[] => {
    if (!optionsPosition?.length) return [];
    return optionsPosition.map((value) => ({
      value: value.id + "",
      label: value.name,
    })) as RadioState[];
  }, [optionsPosition]);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item lg={4}>
            <Card
              title=""
              sx={{
                height: "100%",
                width: "100%",
              }}
              sxCardContent={{
                height: "inherit",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Box
                width={SPACING}
                height={SPACING}
                borderRadius={BORDER_RADIUS}
                border={`1px dashed ${theme.palette.grey[300]}`}
                p={1}
              >
                <Box
                  textAlign={"center"}
                  width={SPACING_CHILD}
                  height={SPACING_CHILD}
                  borderRadius={BORDER_RADIUS_CHILD}
                  sx={{
                    background:
                      theme.palette.mode === "dark"
                        ? theme.palette.grey[900]
                        : theme.palette.grey[300],
                  }}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  flexDirection={"column"}
                >
                  <IconButton aria-label="upload photo">
                    <AddAPhotoIcon color="inherit" />
                  </IconButton>
                  <Typography color={"inherit"}>Upload photo</Typography>
                </Box>
              </Box>
              <Box mt={5}>
                <Typography color="text.secondary" fontSize={14}>
                  Cho phép *.jpeg, *jpg, *png, *gif
                </Typography>
                <Typography color="text.secondary" textAlign={"center"} fontSize={14}>
                  Tối đa 3.1 MB
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item lg={8}>
            <Card title="">
              <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Grid item lg={6}>
                  <TextField
                    fullWidth
                    label="Họ và chữ lót"
                    placeholder="VD: Nguyễn Văn"
                    {...getFieldProps("last_name")}
                    error={touched.last_name && Boolean(errors.last_name)}
                    helperText={touched.last_name && errors.last_name}
                  />
                </Grid>

                <Grid item lg={6}>
                  <TextField
                    fullWidth
                    label="Tên của nhân viên"
                    placeholder="VD: A"
                    {...getFieldProps("first_name")}
                    error={touched.first_name && Boolean(errors.first_name)}
                    helperText={touched.first_name && errors.first_name}
                  />
                </Grid>

                <Grid item lg={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại nhân viên"
                    placeholder="VD: 0123456789"
                    {...getFieldProps("phone_number")}
                    error={touched.phone_number && Boolean(errors.phone_number)}
                    helperText={touched.phone_number && errors.phone_number}
                  />
                </Grid>
                <Grid item lg={6}>
                  <TextField
                    fullWidth
                    autoComplete="none"
                    aria-autocomplete="none"
                    label="Email nhân viên"
                    placeholder="VD: nhanvienA@gmail.com"
                    {...getFieldProps("email")}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>

                <Grid item lg={6}>
                  <TextField
                    fullWidth
                    label="Tài khoản"
                    placeholder="VD: nhanvienA"
                    {...getFieldProps("username")}
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                    disabled={isEditMode}
                  />
                </Grid>

                <Grid item lg={6}>
                  <InputSecure
                    fullWidth
                    label="Mật khẩu nhân viên"
                    placeholder="Nhập mật khẩu"
                    {...getFieldProps("password")}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    disabled={isEditMode}
                  />
                </Grid>

                <Grid item lg={6}>
                  <SelectInput
                    {...getFieldProps("gender")}
                    options={dataRadio}
                    label="Giới tính"
                    placeholder="Chọn giới tính"
                    error={touched.gender && Boolean(errors.gender)}
                    helperText={touched.gender && errors.gender}
                  />
                </Grid>

                <Grid item lg={6}>
                  {optionsRoles && optionsRoles.length ? (
                    <FormSelectChangeRole
                      error={touched.roles && Boolean(errors.roles)}
                      helperText={touched.roles && (errors.roles as string)}
                      sizeLarge
                      options={optionsRoles}
                      value={values}
                      onChange={handleChangeValues}
                    />
                  ) : null}
                </Grid>

                <Grid item lg={6}>
                  {optionsDepartmentConvert.length ? (
                    <SelectInput
                      {...getFieldProps("department")}
                      options={optionsDepartmentConvert}
                      label="Bộ phận"
                      placeholder="Chọn bộ phận"
                      error={touched.department && Boolean(errors.department)}
                      helperText={touched.department && errors.department}
                    />
                  ) : null}
                </Grid>

                <Grid item lg={6}>
                  {optionsPositionConvert.length ? (
                    <SelectInput
                      {...getFieldProps("position")}
                      options={optionsPositionConvert}
                      label="Chức vụ"
                      placeholder="Chọn chức vụ"
                      error={touched.position && Boolean(errors.position)}
                      helperText={touched.position && errors.position}
                    />
                  ) : null}
                </Grid>

                {isEditMode ? (
                  <>
                    <Grid item lg={6}>
                      <SelectInput
                        {...getFieldProps("status")}
                        options={statues}
                        label="Trạng thái"
                        placeholder="Cập nhật trạng thái"
                        error={touched.status && Boolean(errors.status)}
                        helperText={touched.status && errors.status}
                      />
                    </Grid>
                    <Grid item lg={6}>
                      {null}
                    </Grid>
                  </>
                ) : null}

                <Grid item lg={12}>
                  <LoadingButton
                    type="submit"
                    size="medium"
                    loading={false}
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    <span>{isEditMode ? "Lưu thay đổi" : "Tạo Nhân viên"}</span>
                  </LoadingButton>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
};

export default FormAddEditEmployee;

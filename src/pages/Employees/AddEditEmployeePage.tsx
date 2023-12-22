import { Alert, Box, LinearProgress, Snackbar, Typography } from "@mui/material";
import { useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ForPage } from "~/layouts";
import { DashboardPaths, IEmployeePayload, TypeEmployeeResponse } from "~/types";
import { useLoadRole } from "../Role/helpers/loadData";
import { FormAddEditEmployee } from "./form";
import { useLoadDataDepartment } from "../Departments/helpers/loadDataDepartment";
import { useLoadDataPosition } from "../Positions/helpers/loadDataPosition";
import { useApp } from "~/contexts/AppContext";
import { employeeAPI } from "~/services/apis/emloyee";
import { toast } from "react-toastify";
import { useLoadDataRouteEditEmployee } from "./helpers/loadDataRouteEditEmployee";
import { getInfoData } from "~/utils";

const { HeadSeo, Container, Title, Breadcrumbs } = ForPage;

const AddEditEmployeePage = () => {
  const { id } = useParams();
  const isAddMode = !Boolean(id);
  const { data: dataRole, error: errorRole, isLoading: loadingRole } = useLoadRole();
  const {
    data: dataDepartment,
    error: errorDepartment,
    isLoading: loadingDepartment,
  } = useLoadDataDepartment();

  const {
    data: dataPosition,
    error: errorPosition,
    isLoading: loadingPosition,
  } = useLoadDataPosition();
  const dataEdit = useLoadDataRouteEditEmployee();

  const { onCloseOverlay, onOpenOverlay } = useApp();
  const navigation = useNavigate();

  const [error, setError] = useState<{ open: boolean; text: string }>({ open: false, text: "" });

  const titleHeadSeo = useMemo(
    () => (isAddMode ? "Thêm nhân viên" : "Cập nhật nhân viên"),
    [isAddMode]
  );

  const initialValues = useMemo((): IEmployeePayload => {
    if (!dataEdit?.data)
      return {
        first_name: "",
        last_name: "",
        password: "",
        phone_number: "",
        email: "",
        gender: "",
        username: "",
        roles: null,
        position: null,
        department: null,
      };

    const { data } = dataEdit;

    return {
      first_name: data.employeeInfo.first_name,
      last_name: data.employeeInfo.last_name,
      password: "",
      phone_number: data.phone_number ?? "",
      email: data.email ?? "",
      gender: data.employeeInfo.gender!,
      username: data.username,
      roles: data.roles?.map((role) => ({ id: role.id! })) ?? null,
      position: data.position?.id ?? null,
      department: data.department?.id ?? null,
      status: data.status,
    };
  }, [dataEdit?.data]);

  const handleCloseToast = useCallback(() => setError((prev) => ({ ...prev, open: false })), []);

  const handleSubmit = async (values: IEmployeePayload, resetForm: () => void) => {
    try {
      setError((prev) => ({ ...prev, text: "" }));
      onOpenOverlay("Đang tạo nhân viên");

      let response: TypeEmployeeResponse;
      let message = "";

      if (isAddMode) {
        response = await employeeAPI.post(values);
        message = "Thêm nhân viên thành công";
      } else {
        const data = getInfoData(values, [
          "email",
          "department",
          "position",
          "last_name",
          "first_name",
          "gender",
          "roles",
          "phone_number",
          "status",
        ]);
        response = await employeeAPI.patch(dataEdit.id, {
          ...data,
          position: data.position + "",
          department: data.department + "",
        } as any);
        message = "Cập nhật nhân viên thành công";
      }

      if (response) {
        resetForm();
        toast.success(message);
        navigation(DashboardPaths.Employee, { replace: true });
      }
    } catch (error: any) {
      const { response } = error;

      let message = "Thêm nhân viên không thành công";

      if (response && response.data) {
        message = response.data.message;
        navigation;
      }

      setError({ open: true, text: message });
    } finally {
      onCloseOverlay();
    }
  };

  return (
    <ForPage>
      <HeadSeo title={titleHeadSeo} />
      <Container maxWidth="xl">
        <Box sx={{ position: "relative" }}>
          <Title title={titleHeadSeo} mb={2} />

          <Breadcrumbs
            data={[
              { label: "Dang sách nhân viên", to: DashboardPaths.Amenity },
              { label: isAddMode ? "Thêm nhân viên" : "Cập nhật nhân viên" },
            ]}
            mb={3}
          />

          {loadingRole || loadingDepartment || loadingPosition ? (
            <Box
              sx={{
                width: "100%",
                position: "absolute",
                bottom: -30,
                left: 0,
                right: 0,
              }}
            >
              <LinearProgress />
            </Box>
          ) : null}

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={error.open}
            autoHideDuration={1500}
            onClose={handleCloseToast}
          >
            <Alert
              variant="filled"
              onClose={handleCloseToast}
              severity={"error"}
              sx={{ width: "100%" }}
            >
              {error.text}
            </Alert>
          </Snackbar>

          {errorRole ? (
            <Typography my={2} color="error">
              Đã xảy ra lỗi khi tải dữ liệu. Không lấy được danh sách vai trò.
            </Typography>
          ) : null}

          {errorDepartment ? (
            <Typography my={2} color="error">
              Đã xảy ra lỗi khi tải dữ liệu. Không lấy được danh sách bộ phận.
            </Typography>
          ) : null}

          {errorPosition ? (
            <Typography my={2} color="error">
              Đã xảy ra lỗi khi tải dữ liệu. Không lấy được danh sách chức vụ.
            </Typography>
          ) : null}

          {error.text ? (
            <Typography my={2} color="error">
              {error.text}
            </Typography>
          ) : null}
        </Box>

        <FormAddEditEmployee
          isEditMode={!isAddMode}
          optionsRoles={dataRole?.metadata}
          optionsDepartment={dataDepartment?.metadata}
          optionsPosition={dataPosition?.metadata}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          defaultRoles={dataEdit?.data?.roles ?? []}
        />
      </Container>
    </ForPage>
  );
};

export default AddEditEmployeePage;

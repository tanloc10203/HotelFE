import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import {
  Box,
  Button,
  Checkbox,
  LinearProgress,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ColumnState, SelectInput, TabOptions } from "~/components";
import { departmentActions, useOptionDepartment } from "~/features/department";
import { employeeActions, useEmployee } from "~/features/employee";
import { positionActions, useOptionPosition } from "~/features/position";
import { ForPage, ResultFilterOptions } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { DashboardPaths } from "~/types";
import TableRoleEmployee from "../RoleEmployee/components/TableRoleEmployee";
import ActionEmployee from "./components/ActionEmployee";
import { convertStatusToTabIndex, convertTabToStatus } from "./helpers/employee.helper";
import { columnPercentGrid } from "~/utils";

const { HeadSeo, Container, Title, Card, StackCategory, Tab, ResultFilter, Breadcrumbs } = ForPage;

const EmployeePageV2: FC = () => {
  const { data, error, filters, isLoading, pagination, tabStatus } = useEmployee();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const optionsPosition = useOptionPosition();
  const optionsDepartment = useOptionDepartment();

  const theme = useTheme();

  useEffect(() => {
    dispatch(employeeActions.getDataStart(filters));
  }, [filters]);

  useEffect(() => {
    dispatch(positionActions.getDataStart({}));
    dispatch(departmentActions.getDataStart({}));
  }, []);

  const columns: ColumnState[] = [
    {
      id: "select",
      label: <Checkbox disabled />,
      maxWidth: 40,
      align: "center",
      styles: { padding: 0 },
    },
    { id: "id", label: "", maxWidth: 30, minWidth: 30, align: "center" },
    { id: "display_name", label: "Tên nhân viên", minWidth: 170 },
    { id: "email", label: "Email", minWidth: 170 },
    { id: "roles", label: "Vai trò", minWidth: 170 },
    { id: "position", label: "Chức vụ", minWidth: 170 },
    { id: "department", label: "Bộ phận", minWidth: 170 },
    { id: "gender", label: "Giới tính", minWidth: 40, align: "center" },
    { id: "status", label: "Trạng thái", maxWidth: 100, align: "center" },
    { id: "action", label: "Hành động", maxWidth: 80, align: "center" },
  ];

  const tabsData = useMemo(
    (): TabOptions[] => [
      {
        id: 0,
        label: "Tất cả",
        bg: theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black,
        bgActive:
          theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black,
        color:
          theme.palette.mode === "dark" ? theme.palette.common.black : theme.palette.common.white,
        colorActive:
          theme.palette.mode === "dark" ? theme.palette.common.black : theme.palette.common.white,
      },
      {
        id: 1,
        label: "Không hoạt động",
        bg: "rgba(255, 86, 48, 0.16)",
        bgActive: "rgb(255, 86, 48)",
        color: "rgb(255, 172, 130)",
        colorActive: "rgb(255, 255, 255)",
      },
      {
        id: 2,
        label: "Xác thực",
        bg: "rgba(34, 197, 94, 0.16)",
        bgActive: "rgb(34, 197, 94)",
        color: "rgb(17, 141, 87)",
        colorActive: "rgb(255, 255, 255)",
      },
      {
        id: 3,
        label: "Bị cấm",
        bg: "rgba(255, 171, 0, 0.16)",
        bgActive: "rgb(255, 171, 0)",
        color: "rgb(183, 110, 0)",
        colorActive: "rgb(255, 255, 255)",
      },
      {
        id: 4,
        label: "Nghỉ hưu",
        bg: "rgba(145, 158, 171, 0.16)",
        bgActive: "rgb(145, 158, 171)",
        color: "rgb(99, 115, 129)",
        colorActive: "rgb(255, 255, 255)",
      },
    ],
    [theme]
  );

  const handleChangeSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearch(value);
      dispatch(
        employeeActions.setDebounceSearch({ ...filters, page: 0, display_name_like: value })
      );
    },
    [filters]
  );

  const handleChangeOperation = useCallback(
    (type: "department" | "position", value: number) => {
      if (type === "department") {
        dispatch(employeeActions.setFilter({ ...filters, page: 0, department: value }));
      } else {
        dispatch(employeeActions.setFilter({ ...filters, page: 0, position: value }));
      }
    },
    [filters]
  );

  const handleCleanFilter = useCallback(() => {
    dispatch(employeeActions.setFilter({ limit: filters.limit, page: 1 }));
    dispatch(employeeActions.setTabStatus(0));
    setSearch("");
  }, [filters]);

  const handleChangeTab = useCallback(
    (value: number) => {
      if (value === 0) {
        handleCleanFilter();
        return;
      }

      dispatch(
        employeeActions.setFilter({ ...filters, page: 1, status: convertTabToStatus(value) })
      );
      dispatch(employeeActions.setTabStatus(value));
    },
    [filters]
  );

  const onChangePage = useCallback(
    (newPage: number) => dispatch(employeeActions.setFilter({ ...filters, page: newPage })),
    []
  );

  const visible = useMemo(
    () => Boolean(filters?.status || filters?.department || filters?.position),
    [filters]
  );

  const filtersResults = useMemo((): ResultFilterOptions[] => {
    let results: ResultFilterOptions[] = [];

    if (filters?.status) {
      const index = convertStatusToTabIndex(filters.status);
      results = [...results, { label: "Trạng  thái", data: tabsData[index].label as string }];
    }

    if (filters?.position) {
      const position = optionsPosition.find((o) => o.value === filters.position);
      results = [...results, { label: "Chức vụ", data: position?.label as string }];
    }

    if (filters?.department) {
      const department = optionsDepartment.find((o) => o.value === filters.department);
      results = [...results, { label: "Bộ phận", data: department?.label as string }];
    }

    return results;
  }, [filters]);

  return (
    <ForPage>
      <HeadSeo title="Quản lý nhân viên" />

      <Container maxWidth="xl">
        <Title title="Quản lý nhân viên" mb={2} />

        <Breadcrumbs data={[{ label: "Dang sách nhân viên" }]} mb={3} />

        <Card
          action={
            <Button
              component={Link}
              to={DashboardPaths.AddEmployee}
              variant="contained"
              startIcon={<PersonAddAlt1Icon />}
            >
              Thêm nhân viên
            </Button>
          }
          title=""
          sx={{ position: "relative", mt: 5 }}
        >
          <Tab value={tabStatus} tabsData={tabsData} onChange={handleChangeTab} />

          <StackCategory my={3}>
            <Box width={`${columnPercentGrid(1.725)}%`}>
              <SelectInput
                value={filters?.department ?? ""}
                onChange={(event) =>
                  handleChangeOperation("department", event.target.value as number)
                }
                options={optionsDepartment}
                label="Bộ phận"
              />
            </Box>

            <Box width={`${columnPercentGrid(1.725)}%`}>
              <SelectInput
                value={filters?.position ?? ""}
                onChange={(event) =>
                  handleChangeOperation("position", event.target.value as number)
                }
                options={optionsPosition}
                label="Chức vụ"
              />
            </Box>

            <Box width={`${columnPercentGrid(12 - 1.725 * 2 - 0.3)}%`}>
              <TextField
                id="outlined-basic"
                label="Tìm kiếm"
                placeholder="Nhập tên nhân viên muốn tìm"
                variant="outlined"
                fullWidth
                value={search}
                onChange={handleChangeSearch}
              />
            </Box>

            <Box width={`${columnPercentGrid(0.3)}%`}>
              <ActionEmployee />
            </Box>
          </StackCategory>

          <ResultFilter
            visible={visible}
            filters={filtersResults}
            numberResult={pagination.totalRows}
            onReset={handleCleanFilter}
          />

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
          ) : error ? (
            <Typography>Đã xảy ra lỗi khi tải dữ liệu: {error}</Typography>
          ) : null}

          <TableRoleEmployee
            totalRow={pagination.totalPage}
            checkedEmployee={null}
            columns={columns}
            data={data}
            page={pagination.page}
            rowsPerPage={pagination.limit}
            onPageChange={onChangePage}
          />
        </Card>
      </Container>
    </ForPage>
  );
};

export default EmployeePageV2;

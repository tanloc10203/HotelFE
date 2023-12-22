import { Box, LinearProgress, Typography } from "@mui/material";
import { AxiosError } from "axios";
import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useApp } from "~/contexts/AppContext";
import { ForPage } from "~/layouts";
import { roleAPI } from "~/services/apis/role";
import { ChildrenPermissionModule, DashboardPaths, IPermissionModule, IRole } from "~/types";
import { sleep } from "~/utils";
import useLoaderPermission from "../Permission/useLoaderPermission";
import FormAddEditRole from "./form/FormAddEditRole";
import { useLoadRoleById } from "./helpers/loadData";

const { Container, HeadSeo, Title, Card } = ForPage;

type AddEditRolePageProps = {};

const AddEditRolePage: React.FC<AddEditRolePageProps> = () => {
  const {
    data,
    error: errorGetPermission,
    isLoading,
    isValidating,
  } = useLoaderPermission({ name: "" });

  const [selected, setSelected] = useState<ChildrenPermissionModule[]>([]);
  const [error, setError] = useState<string>("");
  const { onCloseOverlay, onOpenOverlay } = useApp();
  const navigation = useNavigate();
  const { data: dataSelectedUpdate, isEditMode, roleId } = useLoadRoleById();

  const permissions = useMemo(() => {
    if (!data || !data?.metadata.length) return [];

    const { metadata } = data;
    const metadataLength = metadata.length;
    let moduleName = "";
    let permissionModules: IPermissionModule[] = [];

    for (let index = 0; index < metadataLength; index++) {
      const element = metadata[index];
      const { alias } = element;
      const slipt = alias.split("."); /** alias = product.add => ['product', 'add'] */

      if (!moduleName || moduleName != slipt[0]) {
        moduleName = slipt[0];
      }

      if (!permissionModules.length) {
        const module: IPermissionModule = {
          moduleName,
          children: [{ ...element, selected: false }],
        };

        permissionModules.push(module);
      } else {
        const index = permissionModules.findIndex((p) => p.moduleName === moduleName);

        if (index === -1) {
          const module: IPermissionModule = {
            moduleName,
            children: [{ ...element, selected: false }],
          };

          permissionModules.push(module);
        } else {
          permissionModules[index].children = [
            { ...element, selected: false },
            ...permissionModules[index].children,
          ];
        }
      }
    }

    if (dataSelectedUpdate?.permissions) {
      const permissions = dataSelectedUpdate.permissions;
      setSelected(permissions.map((p) => ({ ...p, selected: true })));

      permissionModules = permissionModules.map((pM) => {
        const children = pM.children.map((c) => {
          const index = permissions.findIndex((p) => +p.id! === +c.id!);
          return index === -1 ? { ...c, selected: false } : { ...c, selected: true };
        });
        return { ...pM, children };
      });
    }

    return permissionModules;
  }, [data, dataSelectedUpdate?.permissions]);

  const handleSelected = useCallback(
    (selected: ChildrenPermissionModule[]) => {
      if (error) setError("");
      setSelected(selected);
    },
    [error]
  );

  const handleSubmit = useCallback(
    async (values: IRole, resetForm: () => void) => {
      if (!selected.length) {
        const message = "Vui lòng chọn quyền cho vai trò này";
        toast.error(message);
        setError(message);
        return;
      }

      const data = {
        ...values,
        permissions: selected.map((s) => {
          const { selected, ...others } = s;
          return others;
        }),
      };

      console.log(`data`, data);
      setError("");

      try {
        onOpenOverlay("Đang đăng nhập...");
        await sleep(300);

        if (isEditMode && roleId) {
          await roleAPI.patch(+roleId, data);
        } else {
          await roleAPI.post(data);
        }

        resetForm();
        setSelected([]);
        toast.success(isEditMode ? `Cập nhật vai trò thành công` : "Thêm vai trò thành công");

        navigation(DashboardPaths.Role, {
          replace: true,
        });
      } catch (error: any) {
        let msg = "";

        if (error instanceof AxiosError) {
          msg = error?.response?.data?.message ?? error.message;
        } else {
          msg = error.message;
        }

        setError(msg);
        toast.error(msg);
      } finally {
        onCloseOverlay();
      }
    },
    [selected, isEditMode, roleId]
  );

  const initialValues = useMemo(() => {
    if (!dataSelectedUpdate) return { desc: "", name: "" };
    return { desc: dataSelectedUpdate.desc, name: dataSelectedUpdate.name };
  }, [dataSelectedUpdate]);

  const title = useMemo(
    () =>
      isEditMode && dataSelectedUpdate
        ? `Cập nhật vai trò ${dataSelectedUpdate.name}`
        : "Thêm vai trò",
    [isEditMode, dataSelectedUpdate]
  );

  return (
    <ForPage>
      <HeadSeo title={title} />
      <Container>
        <Title title={title} />

        <Card title="" sx={{ position: "relative" }}>
          {isLoading || isValidating ? (
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
          ) : errorGetPermission ? (
            <Typography>Đã xảy ra lỗi khi tải dữ liệu</Typography>
          ) : null}

          {error ? (
            <Typography
              mb={1}
              variant="body2"
              color={"error"}
              fontStyle={"italic"}
              fontWeight={700}
            >
              {error}
            </Typography>
          ) : null}

          <FormAddEditRole
            textSubmit={title}
            permissionModules={permissions}
            initialValues={initialValues}
            onSelected={handleSelected}
            onSubmit={handleSubmit}
          />
        </Card>
      </Container>
    </ForPage>
  );
};

export default AddEditRolePage;

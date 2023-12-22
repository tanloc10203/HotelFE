import { Box, TextField, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import * as React from "react";
import { ChildrenPermissionModule, IPermissionModule, IRole } from "~/types";
import FormGroupPermissionV2 from "../components/FormGroupPermissionV2";
import { addEditRoleSchema } from "../schema/addEditRole.schema";
import { LoadingButton } from "@mui/lab";

type FormAddEditRoleProps = {
  initialValues: IRole;
  permissionModules?: IPermissionModule[];
  onSubmit?: (...args: any[]) => void;
  onSelected?: (permissions: ChildrenPermissionModule[]) => void;
  textSubmit: string;
};

const FormAddEditRole: React.FC<FormAddEditRoleProps> = ({
  initialValues,
  permissionModules,
  textSubmit,
  onSubmit,
  onSelected,
}) => {
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: addEditRoleSchema,
    onSubmit: (values, { resetForm }) => {
      if (!onSubmit) return;
      onSubmit?.(values, resetForm);
    },
  });

  const [selected, setSelected] = React.useState<IPermissionModule[]>([]);

  React.useEffect(() => {
    if (!permissionModules) return;
    setSelected(permissionModules);
  }, [permissionModules]);

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  const handleSelected = React.useCallback(
    (selected: IPermissionModule[]) => {
      setSelected(selected);
      if (!onSelected) return;

      const permissionSelected: ChildrenPermissionModule[] = [];
      const selectedLength = selected.length;

      for (let index = 0; index < selectedLength; index++) {
        const select = selected[index];

        const childrenLength = select.children.length;
        for (let i = 0; i < childrenLength; i++) {
          const children = select.children[i];

          if (children.selected) {
            permissionSelected.push(children);
          }
        }
      }

      onSelected(permissionSelected);
    },
    [onSelected]
  );

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Tên vai trò"
          margin="normal"
          {...getFieldProps("name")}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
        />

        <TextField
          fullWidth
          label="Mô tả"
          multiline
          rows={3}
          margin="normal"
          {...getFieldProps("desc")}
          error={touched.desc && Boolean(errors.desc)}
          helperText={touched.desc && errors.desc}
        />

        <Box my={2}>
          <Typography fontWeight="bold">Vai trò này có quyền gì?</Typography>
          <Typography fontWeight={300} fontSize={14} mt={1} color="gray">
            Check vào module hoặc các hành động bên dưới để chọn quyền.
          </Typography>
        </Box>

        {selected?.length ? (
          <Box height={"100%"}>
            <FormGroupPermissionV2 permissions={selected} onChange={handleSelected} />
          </Box>
        ) : null}

        <LoadingButton type="submit" variant="contained" sx={{ mt: 4 }}>
          {textSubmit}
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
};

export default FormAddEditRole;

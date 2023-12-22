import { Box, Checkbox, FormControlLabel, Typography, useTheme } from "@mui/material";
import * as React from "react";
import { IPermissionModule } from "~/types";
import { convertAlias } from "../helpers/convertAlias";

type FormGroupPermissionProps = {
  permissions: IPermissionModule[];
  onChange?: () => void;
};

const FormGroupPermission: React.FC<FormGroupPermissionProps> = ({ permissions, onChange }) => {
  const theme = useTheme();
  const handleChange = React.useCallback(() => {
    if (!onChange) return;
  }, [onChange]);

  if (!permissions.length) {
    return (
      <Box border="1px solid #dedede" borderRadius={1}>
        <Box
          bgcolor="#ededed"
          px={2}
          py={1}
          display="flex"
          justifyContent="space-between"
          flexWrap="wrap"
          alignItems="center"
          borderRadius="8px 8px 0  0px"
        >
          Chưa có quyền nào.
        </Box>
      </Box>
    );
  }

  return permissions.map((row, index) => (
    <Box
      border={`1px solid ${theme.palette.grey[500]}`}
      borderRadius={"8px 8px 0 0px"}
      key={index}
      mt={2}
    >
      <Box
        bgcolor={theme.palette.grey[500]}
        px={2}
        py={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="8px 8px 0 0px"
        textTransform="capitalize"
      >
        <FormControlLabel
          sx={{ fontWeight: 700 }}
          label={row.moduleName}
          control={
            <Checkbox
              color={theme.palette.mode === "dark" ? "primary" : "success"}
              name={`all.${row.moduleName}`}
              checked={row.children.every((i) => i.selected)}
              onChange={handleChange}
            />
          }
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1,
          gap: 2,
        }}
      >
        {row.children && row.children.length ? (
          row.children.map((item, idx) => (
            <FormControlLabel
              key={idx}
              label={convertAlias(item.alias)}
              control={
                <Checkbox
                  name={item.id + ""}
                  onChange={handleChange}
                  checked={item.selected || false}
                />
              }
            />
          ))
        ) : (
          <Typography>Chưa có quyền nào.</Typography>
        )}
      </Box>
    </Box>
  ));
};

export default FormGroupPermission;

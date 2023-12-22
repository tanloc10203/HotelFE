import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { FormControl } from "@mui/material";
import Autocomplete, {
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
} from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { RolePayload } from "~/types";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type FormSelectChangeRoleProps = {
  options: RolePayload[];
  value: RolePayload[];
  sizeLarge?: boolean;
  helperText?: React.ReactNode;
  error?: boolean;
  onChange?: (
    value: RolePayload[],
    reason: AutocompleteChangeReason,
    payload?: RolePayload
  ) => void;
};

const FormSelectChangeRole: React.FC<FormSelectChangeRoleProps> = ({
  options,
  value,
  sizeLarge,
  helperText,
  error,
  onChange,
}) => {
  const handleChange = React.useCallback(
    (
      _: React.SyntheticEvent,
      value: RolePayload[],
      reason: AutocompleteChangeReason,
      details?: AutocompleteChangeDetails<RolePayload>
    ) => {
      if (!onChange) return;
      onChange(value, reason, details?.option);
    },
    []
  );

  return (
    <FormControl fullWidth error={error}>
      <Autocomplete
        multiple
        id="checkboxes-tags-demo"
        options={options}
        fullWidth
        value={value}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        disableCloseOnSelect
        size={sizeLarge ? "medium" : "small"}
        onChange={handleChange}
        getOptionLabel={(option) => option.name}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            helperText={helperText}
            error={error}
            fullWidth
            label="Danh sách vai trò"
            placeholder="Vai trò..."
          />
        )}
      />
    </FormControl>
  );
};

export default FormSelectChangeRole;

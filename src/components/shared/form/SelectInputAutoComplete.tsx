import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { FormControl } from "@mui/material";
import Autocomplete, {
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteOwnerState,
  AutocompleteRenderGetTagProps,
  AutocompleteRenderOptionState,
} from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { FC, ReactElement, ReactNode, SyntheticEvent, useCallback } from "react";

type SelectInputAutoCompleteProps = {
  error?: boolean;
  helperText?: ReactNode;
  onChange?: (
    value: Record<string, any>[] | Record<string, any> | null,
    reason?: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<Record<string, any>[] | Record<string, any> | null>
  ) => void;
  options: Record<string, any>[];
  keyOption: keyof Record<string, any>;
  value: Record<string, any>[] | Record<string, any> | null;
  label: string;
  placeholder?: string;
  multiple?: boolean;
  disableCloseOnSelect?: boolean;
  size?: "small" | "medium";
  endAdornment?: ReactElement;
  startAdornment?: ReactElement;
  limitTags?: number;
  renderTags?: (
    value: any,
    getTagProps: AutocompleteRenderGetTagProps,
    ownerState: AutocompleteOwnerState<any, boolean, boolean, boolean, any>
  ) => React.ReactNode;
  renderOptions?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: any,
    state: AutocompleteRenderOptionState,
    ownerState: AutocompleteOwnerState<any, boolean, boolean, boolean, any>
  ) => ReactNode;
  getOptionLabel?: (option: any) => string;
};

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const SelectInputAutoComplete: FC<SelectInputAutoCompleteProps> = (props) => {
  const {
    onChange,
    renderTags,
    renderOptions,
    getOptionLabel,
    error,
    helperText,
    options,
    keyOption,
    value,
    label,
    placeholder,
    size,
    multiple = true,
    disableCloseOnSelect = true,
    endAdornment,
    startAdornment,
    limitTags,
  } = props;

  const handleChange = useCallback(
    (
      _: SyntheticEvent,
      value: Record<string, any>[] | Record<string, any> | null,
      reason: AutocompleteChangeReason,
      details?: AutocompleteChangeDetails<Record<string, any>[] | Record<string, any> | null>
    ) => {
      if (!onChange) return;
      onChange(value, reason, details);
    },
    []
  );

  return (
    <FormControl fullWidth error={error} margin="normal" size={size}>
      <Autocomplete
        limitTags={limitTags}
        multiple={multiple}
        id="checkboxes-tags-demo"
        options={options}
        fullWidth
        value={value}
        isOptionEqualToValue={(option, value) => option[keyOption] === value[keyOption]}
        disableCloseOnSelect={disableCloseOnSelect}
        size={"small"}
        onChange={handleChange as () => void}
        getOptionLabel={getOptionLabel ? getOptionLabel : (option) => option[keyOption]}
        renderTags={renderTags}
        renderOption={
          renderOptions
            ? renderOptions
            : (props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option[keyOption]}
                </li>
              )
        }
        renderInput={(params) => (
          <TextField
            {...params}
            size={size}
            helperText={helperText}
            error={error}
            fullWidth
            label={label}
            placeholder={placeholder}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  {startAdornment}
                  {params.InputProps.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {endAdornment}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </FormControl>
  );
};

export default SelectInputAutoComplete;

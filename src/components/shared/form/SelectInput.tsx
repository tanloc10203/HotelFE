import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import React, { ReactNode } from "react";
import { RadioState } from "./RadioInput";

type SelectInputProps = {
  options: RadioState[];
  helperText?: ReactNode;
  sizeForm?: "small" | "medium";
} & SelectProps;

const SelectInput: React.FC<SelectInputProps> = ({ options, helperText, sizeForm, ...props }) => {
  return (
    <FormControl
      fullWidth
      error={props.error}
      margin={props.margin ?? "normal"}
      size={props.size || sizeForm}
    >
      <InputLabel>{props.label}</InputLabel>

      <Select {...props}>
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};

export default SelectInput;

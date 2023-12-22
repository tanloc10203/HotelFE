import { FormHelperText } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup, { RadioGroupProps } from "@mui/material/RadioGroup";
import { FC, ReactNode } from "react";

export type RadioState = {
  label: string;
  value: string | number;
};

type RadioInputProps = {
  helperText?: ReactNode;
  error?: boolean;
  data: RadioState[];
  label: string;
} & RadioGroupProps;

const RadioInput: FC<RadioInputProps> = ({ helperText, error, data, label, ...props }) => {
  return (
    <FormControl error={error} margin="normal" fullWidth>
      <FormLabel id="demo-row-radio-buttons-group-label">{label}</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        {...props}
      >
        {data.map((t, index) => (
          <FormControlLabel key={index} value={t.value} control={<Radio />} label={t.label} />
        ))}
      </RadioGroup>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default RadioInput;

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { FC } from "react";
import { countries } from "~/_mock/country";
import { CountryType } from "~/types";

type CountrySelectProps = {
  value: CountryType | null;
  onChange?: (event: any, value: CountryType | null) => void;
};

const CountrySelect: FC<CountrySelectProps> = ({ value, onChange }) => {
  return (
    <Autocomplete
      value={value}
      size="small"
      id="country-select-demo"
      fullWidth
      options={countries}
      onChange={onChange}
      autoHighlight
      getOptionLabel={(option) => option.label}
      renderOption={(props, option) => (
        <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
          <img
            loading="lazy"
            width="20"
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            alt=""
          />
          {option.label} ({option.code}) +{option.phone}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Quốc tịch"
          margin="dense"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
};

export default CountrySelect;

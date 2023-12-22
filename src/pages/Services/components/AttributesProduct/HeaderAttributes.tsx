import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box, Stack, Typography } from "@mui/material";
import { FC } from "react";

type HeaderAttributesProps = {
  onToggle?: () => void;
  toggle?: boolean;
  label: string;
};

const HeaderAttributes: FC<HeaderAttributesProps> = ({ onToggle, toggle, label }) => {
  return (
    <Stack
      p={1}
      sx={{
        cursor: "pointer",
        background: (theme) =>
          theme.palette.mode === "light" ? theme.palette.grey[200] : theme.palette.grey[700],
      }}
      flexDirection={"row"}
      justifyContent={"space-between"}
      onClick={onToggle}
      alignItems={"center"}
    >
      <Typography fontWeight={"bold"} fontSize={14}>
        {label}
      </Typography>

      <Box fontSize={18}>
        {toggle ? (
          <KeyboardArrowUpIcon fontSize="inherit" />
        ) : (
          <ExpandMoreIcon fontSize="inherit" />
        )}
      </Box>
    </Stack>
  );
};

export default HeaderAttributes;

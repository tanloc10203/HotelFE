import { styled } from "@mui/material/styles";

const StyledRoot = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const useStyles = () => ({ StyledRoot });

export default useStyles;

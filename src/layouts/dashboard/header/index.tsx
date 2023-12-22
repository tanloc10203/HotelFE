import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { AppBar, Box, IconButton, Stack, Toolbar } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { FC, memo, useContext } from "react";
import { Iconify } from "~/components/ui/iconify";
import { ColorModeContext } from "~/theme";
import { bgBlur } from "~/utils";
import AccountPopover from "./AccountPopover";
import LanguagePopover from "./LanguagePopover";
import NotificationsPopover from "./NotificationsPopover";
import Searchbar from "./Searchbar";

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...(bgBlur({ color: theme.palette.background.default }) as any),
  boxShadow: "none",
  transition: theme.transitions.easing.easeIn,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up("lg")]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

interface HeaderProps {
  onOpenNav: () => void;
  open: boolean;
}

const Header: FC<HeaderProps> = ({ onOpenNav, open }) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <StyledRoot sx={{ width: !open ? `100%` : `calc(100% - ${NAV_WIDTH + 1}px)` }}>
      <StyledToolbar>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: "text.primary",
          }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        <Searchbar />

        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="default">
            {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <LanguagePopover />
          <NotificationsPopover />
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
};

export default memo(Header);

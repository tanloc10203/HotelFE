import { useEffect, useState } from "react";
// @mui
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
// mocks_
import { NavLink as RouterLink, useNavigate } from "react-router-dom";
import account from "~/_mock/account";
import { Iconify } from "~/components/ui/iconify";
import { authActions, useGetAccessToken, useGetRole, useGetUser } from "~/features/auth";
import { AuthAPI, logoutEmployeeEndPoint, logoutOwnerEndPoint } from "~/services/apis/auth";
import { useAppDispatch } from "~/stores";
import { DashboardPaths, SinglePaths } from "~/types";

interface IMenuOptions {
  label: string;
  icon: string;
  to: DashboardPaths | SinglePaths;
}

const MENU_OPTIONS: IMenuOptions[] = [
  {
    label: "Home",
    icon: "eva:home-fill",
    to: DashboardPaths.DashboardApp,
  },
  {
    label: "Thông tin cá nhân",
    icon: "eva:person-fill",
    to: DashboardPaths.Profile,
  },
  {
    label: "Thay đổi mật khẩu",
    icon: "eva:settings-2-fill",
    to: DashboardPaths.ChangePassword,
  },
];

function AccountPopover() {
  const [open, setOpen] = useState<any>(null);
  const role = useGetRole()!;
  const user = useGetUser(role);
  const tokenOwner = useGetAccessToken("OWNER");
  const tokenEmployee = useGetAccessToken("EMPLOYEE");
  const dispatch = useAppDispatch();
  const navigation = useNavigate();

  const handleOpen = (event: any) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  useEffect(() => {
    if (!role) return;

    const label = "Đổi tài khoản";
    const to = role === "EMPLOYEE" ? SinglePaths.LoginOwner : SinglePaths.LoginEmployee;

    const index = MENU_OPTIONS.findIndex((t) => t.label === label);

    if (!tokenOwner || !tokenEmployee) {
      if (index === -1) return;
      MENU_OPTIONS.pop();
      return;
    }

    if (index === -1) {
      MENU_OPTIONS.push({
        label: "Đổi tài khoản",
        icon: "icon-park-solid:exchange-three",
        to: to,
      });
    } else {
      MENU_OPTIONS[index] = {
        ...MENU_OPTIONS[index],
        to,
      };
    }
  }, [tokenOwner, tokenEmployee, role]);

  const handleLogout = async () => {
    if (!role) return;

    const url = role === "EMPLOYEE" ? logoutEmployeeEndPoint : logoutOwnerEndPoint;
    const to = role === "EMPLOYEE" ? SinglePaths.LoginEmployee : SinglePaths.LoginOwner;

    try {
      await AuthAPI.logout(url);
      dispatch(authActions.setResetState(role));
      navigation(to, { replace: true });
    } catch (error) {
      console.log(`logout error`, error);
    }

    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={user?.photo ?? account.photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              p: 0,
              mt: 1.5,
              ml: 0.75,
              width: 240,
              "& .MuiMenuItem-root": {
                typography: "body2",
                borderRadius: 0.75,
              },
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.display_name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem
              component={RouterLink}
              to={option.to}
              key={option.label}
              onClick={handleClose}
              sx={{ "&.active": { background: "rgba(255, 255, 255, 0.08);" } }}
            >
              <Iconify icon={option.icon} sx={{ mr: 2 }} />
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Đăng xuất
        </MenuItem>
      </Popover>
    </>
  );
}

export default AccountPopover;

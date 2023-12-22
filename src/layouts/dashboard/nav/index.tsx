import { Avatar, Box, Drawer, Link, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { FC, memo, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import account from "~/_mock/account";
import { Logo, NavSection, Scrollbar } from "~/components";
import { useGetRole, useGetUser } from "~/features/auth";
import useResponsive from "~/hooks/useResponsive";
import { employeeAPI } from "~/services/apis/emloyee";
import { RolePayload } from "~/types";
import { navConfigEmployee, navConfigOwner } from "./config";

// ----------------------------------------------------------------------

const NAV_WIDTH = 300;

const StyledAccount = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

interface NavProps {
  openNav: boolean;
  onCloseNav: () => void;
}

const Nav: FC<NavProps> = ({ openNav, onCloseNav }) => {
  const { pathname } = useLocation();
  const role = useGetRole()!;
  const user = useGetUser(role);
  const [roles, setRoles] = useState<RolePayload[]>([]);

  const isDesktop = useResponsive("up", "lg");

  useEffect(() => {
    if (!isDesktop && openNav) {
      onCloseNav();
    }
  }, [pathname]);

  useEffect(() => {
    if (!role || role === "OWNER") return;

    (async () => {
      try {
        const response = await employeeAPI.getPermissions();

        setRoles(response as RolePayload[]);
      } catch (error) {
        console.log("====================================");
        console.log(`error  get Permission`);
        console.log("====================================");
      }
    })();

    return () => {
      setRoles([]);
    };
  }, [role]);

  const navConfig = useMemo(() => {
    if (!role) return [];

    if (role === "EMPLOYEE") return navConfigEmployee;

    return navConfigOwner;
  }, [role]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": { height: 1, display: "flex", flexDirection: "column" },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: "inline-flex" }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar src={user?.photo ?? account.photoURL} alt="photoURL" />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                {user?.display_name}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {role === "EMPLOYEE" ? "Nhân viên" : "Chủ khách sạn"}
              </Typography>

              {roles.length ? (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {roles.reduce(
                    (text, value, index, old) =>
                      (text += `${value.name} ${index === old.length - 1 ? "" : ", "}`),
                    ""
                  )}
                </Typography>
              ) : null}
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      <NavSection data={navConfig} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        transition: "all 0.25s ease-in-out",
        width: { lg: openNav ? NAV_WIDTH : 0 },
      }}
    >
      {isDesktop ? (
        <Drawer
          anchor="left"
          open={openNav}
          variant="persistent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: "background.default",
              borderRightStyle: "dashed",
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
};

export default memo(Nav);

import { NavLink as RouterLink } from "react-router-dom";
// @mui
import { Box, List, ListItemText, Collapse } from "@mui/material";
//
import { StyledNavItem, StyledNavItemIcon } from "./styles";
import { BoxTypeProps, INavConfig } from "~/types";
import { useState } from "react";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

// ----------------------------------------------------------------------

type NavSectionProps = {
  data: Array<INavConfig>;
} & BoxTypeProps;

export default function NavSection({ data = [], ...other }: NavSectionProps) {
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

interface NavItemProps {
  item: INavConfig;
}

function NavItem({ item }: NavItemProps) {
  const [open, setOpen] = useState(false);
  const { title, path, icon, info, children } = item;

  const handleClick = (path: string) => {
    if (path) return;
    setOpen(!open);
  };

  return (
    <>
      <StyledNavItem
        onClick={() => handleClick(path!)}
        component={path ? RouterLink : "nav"}
        to={path!}
        sx={{
          "&.active": {
            color: "text.primary",
            bgcolor: "action.selected",
            fontWeight: "fontWeightBold",
          },
        }}
        end="true"
      >
        <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

        <ListItemText disableTypography primary={title} />

        {info && info}
        {!path ? open ? <ExpandLess /> : <ExpandMore /> : null}
      </StyledNavItem>

      {children &&
        children.length &&
        children.map((item) => (
          <Collapse in={open} key={item.path} timeout="auto" unmountOnExit>
            <StyledNavItem
              component={RouterLink}
              to={item.path!}
              sx={{
                "&.active": {
                  color: "text.primary",
                  bgcolor: "action.selected",
                  fontWeight: "fontWeightBold",
                },
              }}
              end="true"
            >
              <Box sx={{ borderLeft: "2px dashed", height: "100%", ml: 3 }}></Box>

              <StyledNavItemIcon>{item.icon && item.icon}</StyledNavItemIcon>

              <ListItemText disableTypography primary={item.title} />
            </StyledNavItem>
          </Collapse>
        ))}
    </>
  );
}

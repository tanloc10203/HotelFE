import {
  CardTypeMap,
  ContainerTypeMap,
  GridTypeMap,
  StackTypeMap,
  TypographyTypeMap,
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { Theme as MaterialTheme, SxProps } from "@mui/material/styles";
import { BoxTypeMap } from "@mui/system";
import { ComponentProps } from "react";
import { Theme } from "@mui/system/createTheme";
import { ExtendButtonBase } from "@mui/material/ButtonBase";
import { ListItemButtonTypeMap } from "@mui/material/ListItemButton";

export type CardType = ComponentProps<OverridableComponent<CardTypeMap<{}, "div">>>;
export type ListItemButtonProps = ComponentProps<ExtendButtonBase<ListItemButtonTypeMap>>;
export type GridType = ComponentProps<OverridableComponent<GridTypeMap<{}, "div">>>;
export type ContainerType = ComponentProps<OverridableComponent<ContainerTypeMap<{}, "div">>>;
export type StackType = ComponentProps<OverridableComponent<StackTypeMap<{}, "div">>>;
export type TypographyType = ComponentProps<OverridableComponent<TypographyTypeMap<{}, "span">>>;
export type SXProps = SxProps<Theme>;
export type BoxTypeProps = ComponentProps<
  OverridableComponent<BoxTypeMap<{}, "div", MaterialTheme>>
>;

export type Variants = "filled" | "outlined" | "ghost" | "soft";
export type Colors = "default" | "primary" | "secondary" | "info" | "success" | "warning" | "error";

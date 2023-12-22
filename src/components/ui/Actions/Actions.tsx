import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Button, ButtonProps, IconButton } from "@mui/material";
import {
  MouseEvent,
  ReactNode,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { PopoverOverride } from "..";
import { PopoverOverrideProps } from "../PopoverOverride/PopoverOverride";

type ActionsProps = {
  children: ReactNode;
  onClickHandle?: () => void;
} & Omit<PopoverOverrideProps, "open" | "anchorEl" | "onClose" | "id">;

export type ActionsRefsProps = {
  onClose: () => void;
  active: boolean;
};

const Actions = forwardRef<ActionsRefsProps, ActionsProps>(function Actions(props, ref) {
  const { children, onClickHandle, ...othersProps } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);

      if (onClickHandle) onClickHandle();
    },
    [onClickHandle]
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const id = useMemo(() => (open ? "simple-popover" : undefined), [open]);

  useImperativeHandle(
    ref,
    () => {
      return {
        onClose() {
          setAnchorEl(null);
        },
        active: Boolean(anchorEl),
      };
    },
    [anchorEl]
  );

  return (
    <div>
      <IconButton
        aria-describedby={id}
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <PopoverOverride
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        {...othersProps}
      >
        <Box display={"flex"} flexDirection={"column"}>
          {children}
        </Box>
      </PopoverOverride>
    </div>
  );
});

export default Actions;

export const ButtonActions = (props: ButtonProps & { to?: string }) => (
  <Button
    sx={{
      paddingInlineEnd: 3,
      paddingInlineStart: 2,
      paddingY: 1,
      justifyContent: "flex-start",
      alignItems: "center",
    }}
    {...props}
  />
);

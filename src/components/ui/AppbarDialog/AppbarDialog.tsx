import { AppBar, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

type AppbarDialogProps = {
  children?: ReactNode;
  title?: string;
  onClose?: () => void;
};

const AppbarDialog: FC<AppbarDialogProps> = ({ children, title, onClose }) => {
  return (
    <AppBar sx={{ position: "relative" }} color="inherit">
      <Toolbar>
        {title ? (
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {title}
          </Typography>
        ) : null}
        <Stack flexDirection={"row"} gap={1}>
          {children}

          {onClose ? (
            <IconButton onClick={onClose} color="error">
              <HighlightOffIcon fontSize="inherit" />
            </IconButton>
          ) : null}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default AppbarDialog;

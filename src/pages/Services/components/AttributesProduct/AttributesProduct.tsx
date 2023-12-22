import AddIcon from "@mui/icons-material/Add";
import { Box, Fade, Paper, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import * as React from "react";
import { TransitionGroup } from "react-transition-group";
import HeaderAttributes from "./HeaderAttributes";

interface AttributesProductProps {
  label: string;
  children?: React.ReactNode;
  data: any[];
  textButton?: string;
  toggle: boolean;
  maxAddValue?: number;
  onAdd?: () => void;
  onRemove?: (item: any) => void;
}

export default function AttributesProduct({
  label,
  children,
  textButton,
  toggle,
  maxAddValue,
  data,
  onAdd,
}: AttributesProductProps) {
  const [checked, setChecked] = React.useState(toggle);

  const addFruitButton = (
    <Button
      startIcon={<AddIcon />}
      variant="contained"
      disabled={data?.length >= (maxAddValue ?? 10)}
      onClick={onAdd}
    >
      {textButton}
    </Button>
  );

  return (
    <Stack flexDirection={"column"} component={Paper} elevation={4}>
      <HeaderAttributes
        toggle={checked}
        label={label}
        onToggle={() => setChecked((prev) => !prev)}
      />

      <Fade in={checked}>
        <Stack height={checked ? "100%" : 0} sx={{ transition: "all 0.1s ease-in-out" }}>
          <Box mx={2} mt={2}>
            {textButton ? addFruitButton : null}
          </Box>

          <List
            sx={{
              mt: 1,
              visibility: !checked ? "hidden" : "visible",
              height: checked ? "100%" : 0,
              transition: "all 0.25s ease-in-out",
            }}
          >
            <TransitionGroup
              style={{
                display: !checked ? "none" : "unset",
              }}
            >
              {children}
            </TransitionGroup>
          </List>
        </Stack>
      </Fade>
    </Stack>
  );
}

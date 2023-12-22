import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Box, Button, Stack, Typography } from "@mui/material";
import { FC, MouseEvent, useCallback, useMemo, useState } from "react";
import { InputQuantity, PopoverOverride } from "~/components";

export type OnChangeTypeGuest = { type: "adults" | "children"; value: number; index: number };

type GuestQuantityProps = {
  adults: number;
  children: number;
  maxPeople: {
    adults: number;
    children: number;
  };
  index: number;
  onChange?: (payload: OnChangeTypeGuest) => void;
};

const GuestQuantity: FC<GuestQuantityProps> = ({
  adults,
  children,
  maxPeople,
  index,
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const id = useMemo(() => (open ? "guest-popover" : undefined), [open]);

  const onChangeGuest = useCallback(
    (payload: OnChangeTypeGuest) => {
      if (!onChange) return;
      onChange(payload);
    },
    [onChange]
  );

  return (
    <>
      <Button
        variant="text"
        sx={{ textTransform: "none" }}
        color="inherit"
        startIcon={<PeopleAltIcon />}
        onClick={handleClick}
      >
        {adults} người lớn, {children} trẻ em
      </Button>

      <PopoverOverride
        slotProps={{
          paper: {
            sx: {
              px: 1,
              py: 2,
            },
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        <Box display={"flex"} flexDirection={"column"}>
          <Stack
            flexDirection={"row"}
            width={200}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography fontSize={13}>Người lớn</Typography>

            <InputQuantity
              key={"adults"}
              value={adults}
              max={maxPeople.adults}
              min={1}
              onChangeValue={(value) => onChangeGuest({ type: "adults", index, value })}
            />
          </Stack>

          <Stack
            mt={1}
            flexDirection={"row"}
            width={200}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography fontSize={13}>Trẻ em</Typography>

            <InputQuantity
              key={"children"}
              value={children}
              max={maxPeople.children}
              min={0}
              onChangeValue={(value) => onChangeGuest({ type: "children", index, value })}
            />
          </Stack>
        </Box>
      </PopoverOverride>
    </>
  );
};

export default GuestQuantity;

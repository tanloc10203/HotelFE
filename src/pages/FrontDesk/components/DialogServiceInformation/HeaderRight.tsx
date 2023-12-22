import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import SingleBedIcon from "@mui/icons-material/SingleBed";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { FC, useCallback } from "react";
import { SelectInput } from "~/components";
import { useFrontDeskSelector } from "~/features/frontDesk";

type HeaderRightProps = {
  onCheckOut?: (bookingDetailsId: string) => void;
  disabled?: boolean;
};

const HeaderRight: FC<HeaderRightProps> = ({ onCheckOut, disabled }) => {
  const {
    informationRoom: { data },
  } = useFrontDeskSelector();

  const handleCheckOut = useCallback(() => {
    if (!data || !onCheckOut) return;
    onCheckOut(data.bookingDetails.id!);
  }, [data]);

  const handleOverCheckOut = useCallback(() => {}, []);

  return (
    <Stack justifyContent={"space-between"} flexDirection={"row"} gap={1} mt={2}>
      <Stack flexDirection={"row"} gap={1}>
        <Stack
          flexDirection={"row"}
          minWidth={80}
          justifyContent={"center"}
          p={1}
          alignItems={"center"}
          component={Paper}
          elevation={2}
          sx={{ background: (theme) => theme.palette.success.main, color: "white" }}
        >
          <Stack fontSize={18}>
            <SingleBedIcon fontSize="inherit" />
          </Stack>
          <Typography fontSize={14} fontWeight={"bold"}>
            {data?.room?.roomNumber?.id}
          </Typography>
        </Stack>

        <Stack width={140}>
          <SelectInput
            size="small"
            value={data?.bookingDetails?.bookingData?.mode_booking}
            options={[
              { label: "Theo giờ", value: "time" },
              { label: "Theo ngày", value: "day" },
            ]}
            label="Hình thức"
            margin="none"
          />
        </Stack>

        <Stack
          flexDirection={"row"}
          width={200}
          p={1}
          alignItems={"center"}
          component={Paper}
          elevation={2}
          gap={1}
        >
          <Stack fontSize={18}>
            <PersonOutlineIcon fontSize="inherit" />
          </Stack>
          <Typography
            fontSize={14}
            fontWeight={"bold"}
            color={(theme) => theme.palette.success.main}
          >
            {data?.guestsData?.length
              ? data.guestsData[0].full_name
              : data?.bookingDetails?.bookingData?.customerData?.display_name}
          </Typography>
        </Stack>

        <Stack
          flexDirection={"row"}
          width={140}
          p={1}
          alignItems={"center"}
          component={Paper}
          elevation={2}
          justifyContent={"center"}
          gap={1}
        >
          <Stack flexDirection={"row"} alignItems={"center"} gap={0.2}>
            <Stack fontSize={14}>
              <PersonOutlineIcon fontSize="inherit" />
            </Stack>
            <Typography
              fontSize={14}
              fontWeight={"bold"}
              color={(theme) => theme.palette.success.main}
            >
              {data?.bookingDetails?.adults}
            </Typography>
          </Stack>
          <Stack
            flexDirection={"row"}
            alignItems={"center"}
            gap={0.2}
            sx={{
              "&:after": {
                content: `''`,
                height: 8,
                width: `1px`,
                background: (theme) => theme.palette.grey[400],
                m: 1,
              },
              "&:before": {
                content: `''`,
                height: 8,
                width: `1px`,
                background: (theme) => theme.palette.grey[400],
                m: 1,
              },
            }}
          >
            <Stack fontSize={14}>
              <EmojiPeopleIcon fontSize="inherit" />
            </Stack>
            <Typography
              fontSize={14}
              fontWeight={"bold"}
              color={(theme) => theme.palette.success.main}
            >
              {data?.bookingDetails?.children}
            </Typography>
          </Stack>
          <Stack flexDirection={"row"} alignItems={"center"} gap={0.2}>
            <Stack fontSize={14}>
              <RecentActorsIcon fontSize="inherit" />
            </Stack>
            <Typography
              fontSize={14}
              fontWeight={"bold"}
              color={(theme) => theme.palette.success.main}
            >
              {data?.guestsData?.length}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Button size="small" variant="contained" onClick={handleCheckOut}>
        Trả phòng
      </Button>

      {/* <Button
        size="small"
        disabled={disabled}
        variant="contained"
        color="error"
        onClick={handleOverCheckOut}
      >
        Trả phòng trễ
      </Button> */}
    </Stack>
  );
};

export default HeaderRight;

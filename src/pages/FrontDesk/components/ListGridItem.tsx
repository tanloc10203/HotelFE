import { Alert, Box, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { FrontDesk } from "~/types";
import RoomNumberItem from "./RoomNumberItem";
import { fDateTime } from "~/utils";

type ListGridItem = {} & FrontDesk;

const ListGridItem: FC<ListGridItem> = (props) => {
  const { name, rooms } = props;

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          mb: 2,
          "&:after": {
            content: `''`,
            position: "absolute",
            width: "100%",
            height: 2,
            mt: 0.5,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette.common.white
                : theme.palette.common.black,
          },
        }}
      >
        <Typography fontWeight={"bold"} fontSize={14}>
          {name}
        </Typography>
      </Box>

      <Stack flexDirection={"row"} flexWrap={"wrap"} gap={2}>
        {rooms?.length
          ? rooms.map((r) => {
              if (
                !r?.discount ||
                !Boolean(r?.discount?.is_public) ||
                Boolean(r?.discount?.status === "expired")
              )
                return r.room_numbers.map((t) => (
                  <RoomNumberItem
                    discount={r.discount}
                    key={t.id}
                    roomTypeId={r.room_type_id}
                    roomTypeName={r.roomType.name}
                    priceDay={r.roomType.prices?.price_offline!}
                    priceHour={r.roomType.prices?.price_hours[0]?.price || 0}
                    {...t}
                  />
                ));

              return (
                <Stack key={r.id}>
                  <Alert color="warning">
                    Khuyến mãi bắt đầu từ{" "}
                    <b>{fDateTime(r.discount.time_start, "EEEEE dd MMMM yyyy p")}</b> đến{" "}
                    <b>{fDateTime(r.discount.time_end, "EEEEE dd MMMM yyyy p")}</b>. Số lượng{" "}
                    <b>
                      {r.discount.num_discount === 0
                        ? `không giới hạn.`
                        : `áp dụng cho ${r.discount.num_discount} phòng đầu tiên.`}
                    </b>{" "}
                    Dành cho loại phòng <b>{r.roomType.name}</b>
                  </Alert>

                  <Stack mt={2} flexDirection={"row"} flexWrap={"wrap"} gap={2}>
                    {r.room_numbers.map((t) => (
                      <RoomNumberItem
                        discount={r.discount}
                        key={t.id}
                        roomTypeId={r.room_type_id}
                        roomTypeName={r.roomType.name}
                        priceDay={r.roomType.prices?.price_offline!}
                        priceHour={r.roomType.prices?.price_hours[0]?.price || 0}
                        {...t}
                      />
                    ))}
                  </Stack>
                </Stack>
              );
            })
          : null}
      </Stack>
    </Box>
  );
};

export default ListGridItem;

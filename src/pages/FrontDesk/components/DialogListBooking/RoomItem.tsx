import { Paper, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { upperFirst } from "lodash";
import { FC } from "react";
import { LazyLoading } from "~/components";
import { IBooking, IBookingDetail } from "~/types";
import { convertStatusBill, fDateDayjs, fNumber } from "~/utils";

type RoomItemProps = {
  data: IBookingDetail;
  booking: IBooking;
};

const SPACING_IMAGE = 250;

const RoomItem: FC<RoomItemProps> = ({ data, booking }) => {
  return (
    <Stack component={Paper} elevation={3} flexDirection={"row"} width={"100%"} p={1} gap={2}>
      <LazyLoading
        src={data.rooms?.photo_publish || ""}
        sxBox={{ width: SPACING_IMAGE, height: SPACING_IMAGE, flexShrink: 0, borderRadius: 2 }}
        sxImage={{
          width: SPACING_IMAGE,
          height: SPACING_IMAGE,
          objectFit: "cover",
          aspectRatio: "1/1",
          flexShrink: 0,
          borderRadius: 2,
        }}
      />

      <Stack mt={2} gap={1.5} flex={1} ml={5} px={2}>
        <LabelChild label="Số phòng" value={data.room_number_id} />

        <LabelChild
          label="Hình thức sử dụng"
          value={booking.mode_booking === "day" ? "Theo ngày" : "Theo giờ"}
        />

        <LabelChild label="Nhận phòng" value={upperFirst(fDateDayjs(dayjs(data.check_in)))} />

        <LabelChild label="Trả phòng" value={upperFirst(fDateDayjs(dayjs(data.check_out)))} />

        {data.checked_in ? (
          <LabelChild label="Đã nhận lúc" value={upperFirst(fDateDayjs(dayjs(data.checked_in)))} />
        ) : null}

        {data.checked_out ? (
          <LabelChild label="Đã trả lúc" value={upperFirst(fDateDayjs(dayjs(data.checked_out)))} />
        ) : null}

        <LabelChild label="Số lượng người lớn" value={data.adults} />

        <LabelChild label="Số lượng trẻ em" value={data.children || 0} />

        {data?.bill ? (
          <>
            <LabelChild label="Giá tiền" value={fNumber(data.bill.total_price || 0)} />
            <LabelChild label="Trạng thái thanh toán" value={convertStatusBill(data.bill.status)} />
          </>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default RoomItem;

type LabelChildProps = {
  value?: string | number;
  label: string;
};

const LabelChild: FC<LabelChildProps> = ({ value, label }) => {
  return (
    <Stack flexDirection={"row"} justifyContent={"space-between"}>
      <Typography>{label}</Typography>
      <Typography fontWeight={700}>{value}</Typography>
    </Stack>
  );
};

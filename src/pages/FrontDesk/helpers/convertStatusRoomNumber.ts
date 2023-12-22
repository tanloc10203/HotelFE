import { StatusRoom } from "~/types";

export const fStatusRNumber = (state: StatusRoom) => {
  const status: Record<StatusRoom, string> = {
    maintenance: "Bảo trì",
    unavailable: "Đang sử dụng",
    available: "Có sẵn",
    cleanup: "Cần dọn phòng",
  };

  return status[state];
};

import { StatusRoom } from "~/types";
import { ColorsProps } from "~/utils";

export const convertStatusRoom = (status: StatusRoom) => {
  const statuses: Record<StatusRoom, { text: string; color: ColorsProps }> = {
    available: {
      text: "Có sẵn",
      color: "green",
    },
    maintenance: {
      text: "Bảo trì",
      color: "warning",
    },
    unavailable: {
      text: "Không có sẵn",
      color: "red",
    },
    cleanup: {
      text: "Đang dọn dẹp",
      color: "muted",
    },
  };

  return statuses[status];
};

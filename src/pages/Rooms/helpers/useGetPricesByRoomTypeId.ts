import { useCallback, useState } from "react";
import { roomTypeAPI } from "~/services/apis/roomType";
import { IRoomPrice, IRoomTypeResponse } from "~/types";

const useGetPricesByRoomTypeId = () => {
  const [prices, setPrices] = useState<IRoomPrice | null>();

  const getByRoomTypeId = useCallback(async (id: number) => {
    try {
      const { prices } = await roomTypeAPI.getById<IRoomTypeResponse>(id);

      if (prices) {
        setPrices(prices);
      }
    } catch (error) {
      setPrices(null);
      console.log("====================================");
      console.log(`getByRoomTypeId error`, error);
      console.log("====================================");
    }
  }, []);

  return { prices, getByRoomTypeId };
};

export default useGetPricesByRoomTypeId;

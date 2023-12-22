import { FormikErrors } from "formik";
import { useCallback } from "react";
import { useFloor } from "~/features/floor";
import { useRoomTypes } from "~/features/roomTypes";
import { IRoomNumber, RoomPayload } from "~/types";

type SetFieldValue = (
  field: string,
  value: any,
  shouldValidate?: boolean | undefined
) => Promise<void> | Promise<FormikErrors<RoomPayload>>;

type UseCalcRoomNumberPayload = {
  roomNumbers: IRoomNumber[];
  setFieldValue: SetFieldValue;
};

const useCalcRoomNumber = ({ setFieldValue, roomNumbers }: UseCalcRoomNumberPayload) => {
  const { data: roomTypesData } = useRoomTypes();
  const { data: floorsData } = useFloor();

  const updateRoomNumber = useCallback(
    async (payload: IRoomNumber & { lastId: string }) => {
      const { lastId, ...others } = payload;
      if (!roomNumbers.length) return;

      const findRoomIdExists = roomNumbers.find((r) => r.id === payload.id);

      if (findRoomIdExists && findRoomIdExists.id !== payload.lastId) {
        return `Mã phòng đã bị trùng`;
      }

      const roomNumbersOld = [...roomNumbers];
      const index = roomNumbersOld.findIndex((r) => r.id === lastId);

      if (index === -1) return;

      roomNumbersOld[index] = others;

      await setFieldValue("room_numbers", roomNumbersOld);
    },
    [roomNumbers]
  );

  return { roomNumbers, updateRoomNumber, roomTypesData, floorsData };
};

export default useCalcRoomNumber;

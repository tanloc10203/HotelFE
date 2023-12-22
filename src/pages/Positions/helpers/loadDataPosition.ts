import { useMemo } from "react";
import useSWR from "swr";
import { positionAPI } from "~/services/apis/positions";
import { IPosition, SuccessResponseProp } from "~/types";
import { filterTask, updateTask } from "~/utils";

export const useLoadDataPosition = (filters?: any) => {
  const cache = useMemo(() => {
    if (filters?.name) {
      return `${positionAPI.getPrefix}?name=${filters.name}`;
    }

    return positionAPI.getPrefix;
  }, [filters]);

  const response = useSWR(cache, (_) =>
    filters?.name ? positionAPI.get(filters) : positionAPI.get()
  );
  return response;
};

export const addPositionMutate = async (
  newPosition: IPosition,
  response: SuccessResponseProp<IPosition[]>
) => {
  const added = await positionAPI.post(newPosition);
  return { ...response, metadata: [...response.metadata, added] };
};

export const addPositionOption = (
  newPosition: IPosition,
  response: SuccessResponseProp<IPosition[]>
) => {
  return {
    optimisticData: { ...response, metadata: [...response.metadata, newPosition] },
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};

export const editPositionMutate = async (
  positionEdit: IPosition,
  response: SuccessResponseProp<IPosition[]>
) => {
  const edited = await positionAPI.patch(positionEdit.id!, positionEdit);
  return { ...response, metadata: updateTask(edited, response.metadata!, "id") };
};

export const editPositionOption = () => {
  return {
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};

export const deletePositionMutate = async (
  positionDelete: IPosition,
  response: SuccessResponseProp<IPosition[]>
) => {
  await positionAPI.delete(positionDelete.id!);
  return { ...response, metadata: filterTask(positionDelete, response?.metadata!, "id") };
};

export const deletePositionOption = () => {
  return {
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};

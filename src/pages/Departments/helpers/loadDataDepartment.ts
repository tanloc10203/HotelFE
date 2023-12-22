import { useMemo } from "react";
import useSWR from "swr";
import { departmentAPI } from "~/services/apis/department";
import { IDepartment, SuccessResponseProp } from "~/types";
import { filterTask, updateTask } from "~/utils";

export const useLoadDataDepartment = (filters?: any) => {
  const cache = useMemo(() => {
    if (filters?.name) {
      return `${departmentAPI.getPrefix}?name=${filters.name}`;
    }

    return departmentAPI.getPrefix;
  }, [filters]);

  const response = useSWR(cache, (_) =>
    filters?.name ? departmentAPI.get<IDepartment>(filters) : departmentAPI.get<IDepartment>()
  );
  return response;
};

export const addDepartmentMutate = async (
  newDepartment: IDepartment,
  response: SuccessResponseProp<IDepartment[]>
) => {
  const added = await departmentAPI.post(newDepartment);
  return { ...response, metadata: [...response.metadata, added] };
};

export const addDepartmentOption = (
  newDepartment: IDepartment,
  response: SuccessResponseProp<IDepartment[]>
) => {
  return {
    optimisticData: { ...response, metadata: [...response.metadata, newDepartment] },
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};

export const editDepartmentMutate = async (
  positionEdit: IDepartment,
  response: SuccessResponseProp<IDepartment[]>
) => {
  const edited = await departmentAPI.patch(positionEdit.id!, positionEdit);
  return { ...response, metadata: updateTask(edited, response.metadata!, "id") };
};

export const editDepartmentOption = () => {
  return {
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};

export const deleteDepartmentMutate = async (
  positionDelete: IDepartment,
  response: SuccessResponseProp<IDepartment[]>
) => {
  await departmentAPI.delete(positionDelete.id!);
  return { ...response, metadata: filterTask(positionDelete, response?.metadata!, "id") };
};

export const deleteDepartmentOption = () => {
  return {
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};

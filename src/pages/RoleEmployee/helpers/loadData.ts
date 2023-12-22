import { useMemo } from "react";
import useSWR from "swr";
import { employeeAPI } from "~/services/apis/emloyee";
import { roleEmployeeAPI } from "~/services/apis/roleEmployee";
import { RolePayload, SuccessResponseProp, TypeEmployeeResponse } from "~/types";
import { convertQueryParams, removeNullObjV2 } from "~/utils";

const useLoadDataEmployee = (filters?: Record<string, any>) => {
  const handleFilter = useMemo(() => {
    let cache = employeeAPI.getPrefix;
    let statusFilter = "";

    if (filters?.status) {
      const { status } = filters;
      switch (status) {
        case 1:
          statusFilter = "inactive";
          break;
        case 2:
          statusFilter = "active";
          break;
        case 3:
          statusFilter = "banned";
          break;
        case 4:
          statusFilter = "retired";
          break;
        default:
          break;
      }
    }

    let filterValues: Record<string, any> = { status: statusFilter };

    if (+filters?.department !== -1 || +filters?.position !== -1) {
      filterValues = {
        ...filterValues,
        department: +filters?.department === -1 ? null : +filters?.department,
        position: +filters?.position === -1 ? null : +filters?.position,
      };
    }

    if (filters?.limit || filters?.page) {
      filterValues = {
        ...filterValues,
        limit: !filters?.limit ? null : +filters?.limit,
        page: !filters?.page ? null : +filters?.page,
      };
    }

    filterValues = removeNullObjV2(filterValues);

    const query = convertQueryParams(filterValues);

    return {
      cache: `${cache}${query}`,
      fetcher: employeeAPI.get(filterValues),
    };
  }, [filters]);

  const response = useSWR(handleFilter.cache, (_) => handleFilter.fetcher, {
    revalidateIfStale: false,
  });
  return response;
};

export const addRoleEmployeeMutate = async (
  employeeId: number,
  newValues: RolePayload[],
  response: SuccessResponseProp<TypeEmployeeResponse[]>
) => {
  const roles = newValues.map((value) => ({ id: value.id! }));
  const responseInsert = await roleEmployeeAPI.post({ employee_id: employeeId, roles: roles });

  const { metadata } = response;

  const findIndex = metadata.findIndex((m) => m.id! === employeeId);

  metadata[findIndex] = {
    ...metadata[findIndex],
    roles: responseInsert,
  };

  return { ...response, metadata };
};

export const addRoleEmployeeOptions = (
  employeeId: number,
  newValues: RolePayload[],
  response: SuccessResponseProp<TypeEmployeeResponse[]>
) => {
  const { metadata } = response;

  const findIndex = metadata.findIndex((m) => m.id! === employeeId);

  metadata[findIndex] = {
    ...metadata[findIndex],
    roles: newValues,
  };

  return {
    optimisticData: { ...response, metadata },
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};

export default useLoadDataEmployee;

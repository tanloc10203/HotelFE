import _ from "lodash";
import { useMemo } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import useSWR from "swr";
import { roleAPI } from "~/services/apis/role";
import { RolePayload } from "~/types";

export const useLoadRole = (filters?: Record<string, any>) => {
  const response = useSWR(
    !_.isEmpty(filters) && filters?.name
      ? `${roleAPI.getPrefix}?name=${filters.name}`
      : roleAPI.getPrefix,
    (__) => (!_.isEmpty(filters) && filters?.name ? roleAPI.get(filters) : roleAPI.get())
  );

  return response;
};

export const useLoadRoleById = () => {
  const { roleId } = useParams();
  const data = useLoaderData() as RolePayload | null | undefined;
  const isEditMode = useMemo(() => Boolean(roleId), [roleId]);

  return { isEditMode, roleId, data };
};

export const addMutationRole = async () => {};

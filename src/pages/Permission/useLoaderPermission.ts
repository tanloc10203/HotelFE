import useSWR from "swr";
import { permissionAPI } from "~/services/apis/permission";
import { IPermission, SuccessResponseProp } from "~/types";

const useLoaderPermission = ({ name = "" }) => {
  const response = useSWR(
    !name ? permissionAPI.getPrefix : `${permissionAPI.getPrefix}?name=${name}`,
    (_) => (!name ? permissionAPI.get() : permissionAPI.get({ name }))
  );
  return response;
};

export const addMutationPermission = async (
  newPermission: Partial<IPermission>,
  response: SuccessResponseProp<IPermission[]>
) => {
  const added = await permissionAPI.post(newPermission);
  return { ...response, metadata: [...response.metadata, added] };
};

export const addPermissionOptions = (
  newPermission: IPermission,
  response: SuccessResponseProp<IPermission[]>
) => {
  return {
    optimisticData: { ...response, metadata: [...response.metadata, newPermission] },
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};

export const updateMutationPermission = async (
  newPermission: Partial<IPermission>,
  response: SuccessResponseProp<IPermission[]>
) => {
  const updated = await permissionAPI.patch(newPermission?.id!, newPermission);
  const { metadata } = response;

  const newResponse = [...metadata];

  const index = metadata.findIndex((t) => +t.id! === +newPermission?.id!);

  if (index !== -1) newResponse[index] = updated;

  return { ...response, metadata: newResponse };
};

export const updatePermissionOptions = () => {
  return {
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};

export const deleteMutationPermission = async (
  permissionDelete: IPermission,
  response: SuccessResponseProp<IPermission[]>
) => {
  const deleted = await permissionAPI.delete(permissionDelete.id!);
  const { metadata } = response;
  const newResponse = metadata.filter((t) => +t?.id! !== deleted);
  return { ...response, metadata: newResponse };
};

export const deletePermissionOptions = (
  permissionDelete: IPermission,
  response: SuccessResponseProp<IPermission[]>
) => {
  const { metadata } = response;
  const newResponse = metadata.filter((t) => +t.id! !== +permissionDelete.id!);
  return {
    optimisticData: { ...response, metadata: newResponse },
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};

export default useLoaderPermission;

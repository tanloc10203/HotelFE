import { useLoaderData } from "react-router-dom";
import { TypeEmployeeResponse } from "~/types";

export const useLoadDataRouteEditEmployee = () => {
  const response = useLoaderData() as { id: number; data: TypeEmployeeResponse };
  return response;
};

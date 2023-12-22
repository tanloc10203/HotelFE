import { lazy } from "react";
import { RouteObject, redirect } from "react-router-dom";
import { Loadable } from "~/components";
import { roleAPI } from "~/services/apis/role";
import { DashboardPaths } from "~/types";

const PermissionPage = Loadable(lazy(() => import("~/pages/Permission")));
const RolePage = Loadable(lazy(() => import("~/pages/Role")));
const RoleAddEditPage = Loadable(lazy(() => import("~/pages/Role/AddEditRolePage")));
const RoleEmployeePage = Loadable(lazy(() => import("~/pages/RoleEmployee")));

const PermissionRoleRoutes: Array<RouteObject> = [
  { path: DashboardPaths.Permission, element: <PermissionPage /> },
  { path: DashboardPaths.Role, element: <RolePage /> },
  { path: DashboardPaths.AddRole, element: <RoleAddEditPage /> },
  {
    path: DashboardPaths.EditRole + "/:roleId",
    element: <RoleAddEditPage />,
    loader: async ({ params }) => {
      const { roleId } = params;

      if (!roleId) return null;

      try {
        const id = parseInt(roleId);
        const response = await roleAPI.getById(id);
        return response;
      } catch (error) {
        return redirect(DashboardPaths.Role);
      }
    },
  },
  { path: DashboardPaths.RoleEmployee, element: <RoleEmployeePage /> },
];

export default PermissionRoleRoutes;

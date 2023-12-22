import { lazy } from "react";
import { RouteObject, redirect } from "react-router-dom";
import { Loadable } from "~/components";
import { isCodeForbidden, passPermissions } from "~/helpers";
import { employeeAPI } from "~/services/apis/emloyee";
import { store } from "~/stores";
import { DashboardPaths, SinglePaths } from "~/types";

const EmployeePage = Loadable(lazy(() => import("~/pages/Employees/EmployeePageV2")));
const AddEditEmployeePage = Loadable(lazy(() => import("~/pages/Employees/AddEditEmployeePage")));

const employeeRoutes: Array<RouteObject> = [
  {
    path: DashboardPaths.AddEmployee,
    element: <AddEditEmployeePage />,
    loader: async () => {
      const {
        role,
        employee: { accessToken: tokenEmployee },
      } = store.getState().auth;

      if (!role) return redirect(SinglePaths.LoginEmployee);

      if (role === "EMPLOYEE") {
        if (!tokenEmployee) return redirect(SinglePaths.LoginEmployee);
        const response = await passPermissions("employees.add");

        if (isCodeForbidden(response)) {
          return redirect(`${DashboardPaths.Forbidden}/${response}`);
        }
      }

      return null;
    },
  },
  {
    path: DashboardPaths.UpdateEmployee + "/:id",
    element: <AddEditEmployeePage />,
    loader: async ({ params }) => {
      if (!params.id) return null;

      try {
        const employeeId = parseInt(params.id);

        const response = await employeeAPI.getById(employeeId);

        return { id: employeeId, data: response };
      } catch (error) {
        return redirect(DashboardPaths.Employee);
      }
    },
  },
  {
    path: DashboardPaths.Employee,
    element: <EmployeePage />,
    loader: async () => {
      const {
        role,
        employee: { accessToken: tokenEmployee },
      } = store.getState().auth;

      if (!role) return redirect(SinglePaths.LoginEmployee);

      if (role === "EMPLOYEE") {
        if (!tokenEmployee) return redirect(SinglePaths.LoginEmployee);
        const response = await passPermissions("employees.view");

        if (isCodeForbidden(response)) {
          return redirect(`${DashboardPaths.Forbidden}/${response}`);
        }
      }

      return null;
    },
  },
];

export default employeeRoutes;

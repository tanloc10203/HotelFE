import { lazy } from "react";
import { Navigate, RouteObject, redirect } from "react-router-dom";
import { Loadable } from "~/components";
import { isCodeForbidden, passPermissions } from "~/helpers";
import { store } from "~/stores";
import { DashboardPaths, SinglePaths } from "~/types";

const DashboardAppPage = Loadable(lazy(() => import("~/pages/Dashboard")));
const FrontDeskPage = Loadable(lazy(() => import("~/pages/FrontDesk")));

const customerRoutes: Array<RouteObject> = [
  { element: <Navigate to={DashboardPaths.DashboardApp} />, index: true },
  {
    path: DashboardPaths.DashboardApp,
    element: <DashboardAppPage />,
  },
  {
    path: DashboardPaths.FrontDesk,
    element: <FrontDeskPage />,
    loader: async () => {
      const {
        role,
        employee: { accessToken: tokenEmployee },
      } = store.getState().auth;

      console.log("====================================");
      console.log(`role check`, { role, tokenEmployee });
      console.log("====================================");

      if (!role) return redirect(SinglePaths.LoginEmployee);

      if (role === "EMPLOYEE") {
        if (!tokenEmployee) return redirect(SinglePaths.LoginEmployee);
        const response = await passPermissions("room.view");

        if (isCodeForbidden(response)) {
          return redirect(`${DashboardPaths.Forbidden}/${response}`);
        }
      }

      return null;
    },
  },
];

export default customerRoutes;

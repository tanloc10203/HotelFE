import { lazy } from "react";
import { RouteObject, redirect } from "react-router-dom";
import { Loadable } from "~/components";
import { isCodeForbidden } from "~/helpers";
import { DashboardPaths, SinglePaths } from "~/types";

const ForbiddenPage = Loadable(lazy(() => import("~/pages/Forbidden")));

const forbiddenRoute: Array<RouteObject> = [
  {
    path: DashboardPaths.Forbidden + "/:code",
    element: <ForbiddenPage />,
    loader: ({ params }) => {
      const { code } = params;

      if (!code) return redirect(SinglePaths.ErrorBoundary);

      if (!isCodeForbidden(code)) return redirect(SinglePaths.ErrorBoundary);

      return null;
    },
  },
];

export default forbiddenRoute;

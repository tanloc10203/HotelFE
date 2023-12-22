import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { authLoaderIsOwner } from "~/helpers";
import { DashboardPaths } from "~/types";

const PositionPage = Loadable(lazy(() => import("~/pages/Positions")));

const positionRoute: Array<RouteObject> = [
  {
    path: DashboardPaths.Position,
    element: <PositionPage />,
    loader: authLoaderIsOwner,
  },
];

export default positionRoute;

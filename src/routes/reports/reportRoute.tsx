import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { DashboardPaths } from "~/types";

const ReportPage = Loadable(lazy(() => import("~/pages/ReviewRate")));

const reportRoutes: Array<RouteObject> = [{ path: DashboardPaths.Review, element: <ReportPage /> }];

export default reportRoutes;

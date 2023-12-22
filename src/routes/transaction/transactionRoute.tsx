import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { DashboardPaths } from "~/types";

const ImportProduct = Loadable(lazy(() => import("~/pages/Transaction/ImportProduct")));

const transactionRoute: Array<RouteObject> = [
  { path: DashboardPaths.ImportProduct, element: <ImportProduct /> },
];

export default transactionRoute;

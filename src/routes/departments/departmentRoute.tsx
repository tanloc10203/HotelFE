import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { authLoaderIsOwner } from "~/helpers";
import { DashboardPaths } from "~/types";

const DepartmentPage = Loadable(lazy(() => import("~/pages/Departments")));

const departmentRoute: Array<RouteObject> = [
  { path: DashboardPaths.Department, element: <DepartmentPage />, loader: authLoaderIsOwner },
];

export default departmentRoute;

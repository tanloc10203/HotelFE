import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { DashboardPaths } from "~/types";

const ChangePassword = Loadable(lazy(() => import("~/pages/Auth/ChangePassword")));
const Profile = Loadable(lazy(() => import("~/pages/Auth/Profile")));

const authRoutes: RouteObject[] = [
  { path: DashboardPaths.ChangePassword, element: <ChangePassword /> },
  { path: DashboardPaths.Profile, element: <Profile /> },
];

export default authRoutes;

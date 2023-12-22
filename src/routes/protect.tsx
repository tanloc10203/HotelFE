import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { DashboardLayout } from "~/layouts";
import { DashboardPaths } from "~/types";
import amenities from "./amenities";
import auth from "./auth";
// import bookings from "./bookings";
import contacts from "./contacts";
import customers from "./customers";
import dashboard from "./dashboard";
import department from "./departments";
import employees from "./employees";
import equipments from "./equipments";
// import floors from "./floors";
import forbidden from "./forbidden";
import loaderDashboard from "./loaderProtect";
import permissionRoles from "./permissionRole";
import position from "./positions";
// import posts from "./posts";
import reports from "./reports";
import rooms from "./rooms";
import services from "./services";
// import promotions from "./promotions";
// import vouchers from "./vouchers";
import transactionRoute from "./transaction";

const ErrorBoundary = Loadable(lazy(() => import("~/pages/ErrorBoundary")));

const dashboardRoutes: Array<RouteObject> = [
  {
    path: DashboardPaths.Dashboard,
    element: <DashboardLayout />,
    errorElement: <ErrorBoundary />,
    loader: loaderDashboard,
    children: [
      ...dashboard,
      ...customers,
      // ...floors,
      ...rooms,
      ...amenities,
      ...equipments,
      // ...posts,
      ...services,
      // ...promotions,
      // ...vouchers,
      // ...bookings,
      ...reports,
      ...contacts,
      ...auth,
      ...permissionRoles,
      ...employees,
      ...forbidden,
      ...position,
      ...department,
      ...transactionRoute,
    ],
  },
];

export default dashboardRoutes;

import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { DashboardPaths } from "~/types";

const ServicePage = Loadable(lazy(() => import("~/pages/Services/ServicePage")));
// const AddEditServicePage = Loadable(lazy(() => import("~/pages/Services/AddEditServicePage")));
const ServiceTypePage = Loadable(lazy(() => import("~/pages/Services/ServiceTypePage")));

const serviceRoutes: Array<RouteObject> = [
  { path: DashboardPaths.ServiceTypes, element: <ServiceTypePage /> },
  // { path: DashboardPaths.AddService, element: <AddEditServicePage /> },
  // { path: DashboardPaths.UpdateService + "/:id", element: <AddEditServicePage /> },
  { path: DashboardPaths.Service, element: <ServicePage /> },
];

export default serviceRoutes;

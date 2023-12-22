import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { DashboardPaths } from "~/types";

const CustomerPage = Loadable(lazy(() => import("~/pages/Customers/CustomerPage")));
// const AddEditCustomerPage = Loadable(lazy(() => import("~/pages/Customers/AddEditCustomerPage")));
// const CustomerTypePage = Loadable(lazy(() => import("~/pages/Customers/CustomerTypePage")));

const customerRoutes: Array<RouteObject> = [
  // { path: DashboardPaths.CustomerTypes, element: <CustomerTypePage /> },
  // { path: DashboardPaths.AddCustomer, element: <AddEditCustomerPage /> },
  // { path: DashboardPaths.UpdateCustomer + "/:id", element: <AddEditCustomerPage /> },
  { path: DashboardPaths.Customer, element: <CustomerPage /> },
];

export default customerRoutes;

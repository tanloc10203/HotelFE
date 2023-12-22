import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { DashboardPaths } from "~/types";

const FloorPage = Loadable(lazy(() => import("~/pages/Floors/FloorPage")));
// const AddEditFloorPage = Loadable(lazy(() => import("~/pages/Floors/AddEditFloorPage")));

const floorRoutes: Array<RouteObject> = [
  { path: DashboardPaths.Floor, element: <FloorPage /> },
  // { path: DashboardPaths.AddFloor, element: <AddEditFloorPage /> },
  // { path: DashboardPaths.UpdateFloor + '/:id', element: <AddEditFloorPage /> },
];

export default floorRoutes;

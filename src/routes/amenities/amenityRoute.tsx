import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { DashboardPaths } from "~/types";

const AmenityPage = Loadable(lazy(() => import("~/pages/Amenities/AmenityPage")));
// const AddEditAmenityPage = Loadable(lazy(() => import("~/pages/Amenities/AddEditAmenityPage")));
const AmenityTypePage = Loadable(lazy(() => import("~/pages/Amenities/AmenityTypePage")));

const amenityRoutes: Array<RouteObject> = [
  { path: DashboardPaths.AmenityTypes, element: <AmenityTypePage /> },
  { path: DashboardPaths.AmenityTypesTrash + "/:type", element: <AmenityTypePage /> },
  // { path: DashboardPaths.AddAmenity, element: <AddEditAmenityPage /> },
  // { path: DashboardPaths.UpdateAmenity + '/:id', element: <AddEditAmenityPage /> },
  { path: DashboardPaths.Amenity, element: <AmenityPage /> },
  { path: DashboardPaths.AmenityTrash + "/:type", element: <AmenityPage /> },
];

export default amenityRoutes;

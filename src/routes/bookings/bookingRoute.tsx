import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { DashboardPaths } from "~/types";

const BookingPage = Loadable(lazy(() => import("~/pages/Bookings/BookingPage")));

const bookingRoutes: Array<RouteObject> = [
  { path: DashboardPaths.Booking, element: <BookingPage /> },
];

export default bookingRoutes;

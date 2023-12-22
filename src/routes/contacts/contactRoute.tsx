import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { DashboardPaths } from "~/types";

const ContactPage = Loadable(lazy(() => import("~/pages/Contacts/InformationHotel")));

const contactRoute: Array<RouteObject> = [
  { path: DashboardPaths.InformationHotel, element: <ContactPage /> },
];

export default contactRoute;

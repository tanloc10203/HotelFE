import { io } from "socket.io-client";
import { env } from "~/constants";

const BASE_URL = env.SERVER_URL;

export const socket = io(BASE_URL, {
  withCredentials: true,
  transports: ["websocket"],
  autoConnect: false,
  // path: "/socket",
  query: {
    type: "admin",
  },
});

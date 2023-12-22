import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { socket } from "~/helpers";

let vSocket: Socket | null = null;

export default function useSocket(onConnect: (socket: Socket) => void, dependencies: any) {
  const [socketState, setSocket] = useState<Socket>();

  useEffect(() => {
    (async function () {
      if (!socketState?.connected && vSocket?.connected) {
        if (vSocket) {
          setSocket(vSocket);
          onConnect(vSocket);
        }
      } else {
        const _socket = socket;
        vSocket = _socket;
        if (_socket) {
          setSocket(_socket);
          onConnect(_socket);
        }
      }
    })();
  }, [...(dependencies || [])]);

  return socketState;
}

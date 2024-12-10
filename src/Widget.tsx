import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import useWebSocket, { ReadyState } from "react-use-websocket";
import {
  EventMessage,
  LobbyStatePayload,
  ResponseStatusPayload,
} from "./types/events.types";

function Widget() {
  const socketUrl = "ws://localhost:3000";

  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const { lastMessage, readyState, sendMessage } = useWebSocket(socketUrl);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting...",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  // On connect, spectate the room
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      const password = searchParams.get("password") || "";
      sendMessage(
        JSON.stringify({
          event: "spectateLobby",
          data: { spectator: { profileName: "Widget" }, code, password },
        })
      );
    }
  }, [readyState]);

  const [lobby, setLobby] = useState<LobbyStatePayload>();
  const [error, setError] = useState<string>();
  useEffect(() => {
    if (lastMessage !== null) {
      const parsed = JSON.parse(lastMessage.data) as EventMessage;
      const { event, data } = parsed;
      switch (event) {
        case "responseStatus":
          setError((data as ResponseStatusPayload).message);
          break;
        case "lobbyState":
          setLobby(data as LobbyStatePayload);
          break;
      }
    }
  }, [lastMessage]);

  if (error) {
    return <>Error: {error}</>;
  }

  if (lobby) {
    return JSON.stringify(lobby, null, 2);
  }

  return <>{connectionStatus}</>;
}

export default Widget;

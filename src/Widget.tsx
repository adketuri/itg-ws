import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import useWebSocket, { ReadyState } from "react-use-websocket";
import {
  EventMessage,
  LobbyStatePayload,
  ResponseStatusPayload,
} from "./types/events.types";
import { SongInfo } from "./components/SongInfo";
import { Pacemaker, PacemakerWrapper } from "./components/Pacemaker";
import { Ranking } from "./components/Ranking";

function Widget({ pacemaker }: { pacemaker?: boolean }) {
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
          data: {
            spectator: { profileName: "Widget" },
            code: code?.toUpperCase(),
            password,
          },
        })
      );
    }
  }, [readyState]);

  // Handle any received messages
  const [lobby, setLobby] = useState<LobbyStatePayload>();
  const averageScore: number =
    (lobby?.players.reduce((prev, curr) => prev + (curr?.exScore || 0), 0) ||
      0) / (lobby?.players.length || 1);

  const [rankings, setRankings] = useState<Record<string, number>>({});
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (lastMessage !== null) {
      const parsed = JSON.parse(lastMessage.data) as EventMessage;
      const { event, data } = parsed;
      switch (event) {
        case "responseStatus":
          setError((data as ResponseStatusPayload).message);
          break;
        case "lobbyState": {
          const lobbyData = data as LobbyStatePayload;
          // Get updated rankings from lobby data
          if (pacemaker) {
            let rank = 0;
            const rankings: Record<string, number> = {};
            for (let i = 0; i < lobbyData.players.length; i++) {
              if (
                i > 0 &&
                lobbyData.players[i].exScore ===
                  lobbyData.players[i - 1].exScore
              ) {
                rankings[lobbyData.players[i].profileName] =
                  rankings[lobbyData.players[i - 1].profileName];
              } else {
                rankings[lobbyData.players[i].profileName] = rank;
              }
              rank++;
            }
            setRankings(rankings);
          }
          setLobby(lobbyData);
          break;
        }
      }
    }
  }, [lastMessage]);

  if (error) {
    return <>Error: {error}</>;
  }

  if (lobby) {
    const progress =
      (lobby.players[0].songProgression?.currentTime || 0) /
      (lobby.players[0].songProgression?.totalTime || 1);
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <SongInfo songInfo={lobby.songInfo} progress={progress} />
        {!pacemaker && <Ranking players={lobby.players} />}
        {pacemaker && (
          <PacemakerWrapper>
            {lobby.players
              .sort((p1, p2) => (p1.profileName > p2.profileName ? 1 : -1))
              .map((p, i) => (
                <Pacemaker
                  key={p.profileName}
                  player={p}
                  ranking={rankings[p.profileName]}
                  averageScore={averageScore}
                  index={i}
                />
              ))}
          </PacemakerWrapper>
        )}
      </div>
    );
  }

  return <>{connectionStatus}</>;
}

export default Widget;

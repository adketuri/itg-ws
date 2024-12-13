import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import {
  CreateLobbyData,
  EventMessage,
  UpdateMachinePayload,
} from "./types/events.types";
import { connectionStatus } from "./constants";

function App() {
  const [messageHistory, setMessageHistory] = useState<
    { message: string; outbound: boolean }[]
  >([]);

  const {
    sendMessage: sendSocket,
    lastMessage,
    readyState,
  } = useWebSocket(import.meta.env.VITE_WS_SERVER_URL);

  const sendMessage = (message: string) => {
    setMessageHistory((prev) => prev.concat({ message, outbound: true }));
    sendSocket(message);
  };

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) =>
        prev.concat({ message: lastMessage.data, outbound: false })
      );
    }
  }, [lastMessage]);

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <header
        style={{
          top: 0,
          backgroundColor: "#333",
          padding: 10,
          // position: "sticky",
          // zIndex: 1000,
        }}
      >
        <p style={{ marginBottom: 10 }}>
          The WebSocket is currently <b>{connectionStatus[readyState]}</b>
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            flexDirection: "row",
          }}
        >
          <button
            style={{ flex: 1 }}
            onClick={() => {
              const event: EventMessage<CreateLobbyData> = {
                event: "createLobby",
                data: {
                  machine: {
                    player1: {
                      playerId: "P1",
                      profileName: "teejusb",
                      screenName: "NoScreen",
                      ready: false,
                    },
                  },
                  password: "",
                },
              };
              sendMessage(JSON.stringify(event));
            }}
            disabled={readyState !== ReadyState.OPEN}
          >
            createLobby
          </button>
          <button
            style={{ flex: 1 }}
            onClick={() =>
              sendMessage(JSON.stringify({ event: "searchLobby", data: {} }))
            }
            disabled={readyState !== ReadyState.OPEN}
          >
            searchLobby
          </button>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <input
              placeholder="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <input
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={() =>
                sendMessage(
                  JSON.stringify({
                    event: "joinLobby",
                    data: {
                      machine: { player1: { playerName: "zexyu" } },
                      code,
                      password,
                    },
                  })
                )
              }
              disabled={readyState !== ReadyState.OPEN}
            >
              joinLobby
            </button>
          </div>
          <button
            style={{ flex: 1 }}
            onClick={() =>
              sendMessage(
                JSON.stringify({
                  event: "lobbyState",
                })
              )
            }
            disabled={readyState !== ReadyState.OPEN}
          >
            lobbyState
          </button>
          <button
            style={{ flex: 1 }}
            onClick={() => {
              const event: EventMessage<UpdateMachinePayload> = {
                event: "updateMachine",
                data: {
                  machine: {
                    player1: {
                      playerId: "P1",
                      profileName: "teejusb",
                      screenName: "ScreenGameplay",
                      ready: true,
                      songProgression: {
                        currentTime: Math.random() * 10,
                        totalTime: 10,
                      },
                      exScore: Math.random(),
                      score: Math.random(),
                    },
                    player2: {
                      playerId: "P2",
                      profileName: "Moistbruh",
                      screenName: "ScreenGameplay",
                      ready: true,
                      songProgression: {
                        currentTime: Math.random() * 10,
                        totalTime: 10,
                      },
                      exScore: Math.random(),
                      score: Math.random(),
                    },
                  },
                },
              };
              sendMessage(JSON.stringify(event));
            }}
            disabled={readyState !== ReadyState.OPEN}
          >
            updateMachine
          </button>

          <button
            style={{ flex: 1 }}
            onClick={() =>
              sendMessage(
                JSON.stringify({
                  event: "selectSong",
                  data: {
                    songInfo: {
                      songPath: "11 guys/too many guys",
                      title: "TOO MANY GUYS",
                      artist: "The Guys",
                      songLength: 123,
                    },
                  },
                })
              )
            }
            disabled={readyState !== ReadyState.OPEN}
          >
            selectSong
          </button>

          <button
            style={{ flex: 1 }}
            onClick={() =>
              sendMessage(JSON.stringify({ event: "leaveLobby", data: {} }))
            }
            disabled={readyState !== ReadyState.OPEN}
          >
            leaveLobby
          </button>
          <button
            style={{ flex: 1 }}
            onClick={() =>
              sendMessage(
                JSON.stringify({ event: "readyUp", data: { playerId: "P1" } })
              )
            }
            disabled={readyState !== ReadyState.OPEN}
          >
            readyUp
          </button>
        </div>
      </header>
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          margin: 10,
          overflow: "scroll",
          height: "auto",
        }}
      >
        {messageHistory.map((msg, idx) => {
          const { message, outbound } = msg;
          return (
            <div key={idx}>
              <p style={{ margin: 0 }}>
                {outbound ? "➡️" : "⬅️"} {message}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;

import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { EventMessage, UpdateMachinePayload } from "./types/events.types";

function App() {
  const socketUrl = "ws://localhost:3000";

  const [messageHistory, setMessageHistory] = useState<
    { message: string; outbound: boolean }[]
  >([]);

  const {
    sendMessage: sendSocket,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl);

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

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "#333",
          padding: 10,
          zIndex: 1000,
        }}
      >
        <span>
          The WebSocket is currently <b>{connectionStatus}</b>
        </span>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <button
            onClick={() => sendMessage("")}
            disabled={readyState !== ReadyState.OPEN}
          >
            Empty
          </button>
          <button
            onClick={() =>
              sendMessage(
                JSON.stringify({
                  event: "createLobby",
                  data: { machine: { player1: { playerName: "teejusb" } } },
                })
              )
            }
            disabled={readyState !== ReadyState.OPEN}
          >
            createLobby
          </button>
          <button
            onClick={() =>
              sendMessage(JSON.stringify({ event: "searchLobby", data: {} }))
            }
            disabled={readyState !== ReadyState.OPEN}
          >
            searchLobby
          </button>
          <div style={{ display: "flex", flexDirection: "column" }}>
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
            onClick={() =>
              sendMessage(JSON.stringify({ event: "leaveLobby", data: {} }))
            }
            disabled={readyState !== ReadyState.OPEN}
          >
            leaveLobby
          </button>
          <button
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

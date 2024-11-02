import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

function App() {
  const socketUrl = "ws://localhost:3000";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
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
            onClick={() =>
              sendMessage(
                JSON.stringify({
                  type: "createLobby",
                  payload: { machine: { player1: { playerName: "teejusb" } } },
                })
              )
            }
            disabled={readyState !== ReadyState.OPEN}
          >
            createLobby
          </button>
          <button
            onClick={() =>
              sendMessage(JSON.stringify({ type: "searchLobby", payload: {} }))
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
                    type: "joinLobby",
                    payload: {
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
              sendMessage(JSON.stringify({ type: "leaveLobby", payload: {} }))
            }
            disabled={readyState !== ReadyState.OPEN}
          >
            leaveLobby
          </button>
          <button
            onClick={() =>
              sendMessage(JSON.stringify({ type: "readyUp", payload: {} }))
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
        {messageHistory.map((message, idx) => {
          return (
            <div key={idx}>
              <p style={{ margin: 0 }}>{message ? message.data : null}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;

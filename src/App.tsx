import { useEffect, useState } from "react";
import "./App.css";
import useWebSocket, { ReadyState } from "react-use-websocket";

function App() {
  const socketUrl = "ws://localhost:3000";
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

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span>
        The WebSocket is currently <b>{connectionStatus}</b>
      </span>

      <div>
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
      </div>
      <div style={{ display: "flex", flex: 1 }}>
        <ul>
          {messageHistory.map((message, idx) => (
            <li>
              <span key={idx}>{message ? message.data : null}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

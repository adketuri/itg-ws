import { FC, useState } from "react";

export const Fallback: FC = () => {
  const [code, setCode] = useState("");
  const [style, setStyle] = useState<"ranking" | "pacemaker">();
  const [copied, setCopied] = useState(false);

  const fullUrl = `${window.location.origin}/widgets/${style}/${code}`;
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          padding: 20,
          borderRadius: 5,
          margin: 40,
          flex: 1,
          maxWidth: 600,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#101010",
        }}
      >
        <div>
          <h1>Generate a widget</h1>
          <h2 style={{ marginTop: 20, marginBottom: 10 }}>Enter room code</h2>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="ABCD"
            maxLength={4}
            style={{ maxWidth: 100, width: 60 }}
          />
        </div>
        {code.length >= 4 && (
          <div>
            <h2 style={{ marginTop: 20, marginBottom: 10 }}>Select Style</h2>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="radio"
                id="ranking"
                name="style"
                value="ranking"
                onChange={() => setStyle("ranking")}
                checked={style === "ranking"}
              />
              <label htmlFor="ranking">Ranking</label>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="radio"
                id="pacemaker"
                name="style"
                value="pacemaker"
                onChange={() => setStyle("pacemaker")}
                checked={style === "pacemaker"}
              />
              <label htmlFor="pacemaker">Pacemaker</label>
            </div>
          </div>
        )}
        {code.length >= 4 && style && (
          <div>
            <h2 style={{ marginTop: 20, marginBottom: 10 }}>Copy & Paste</h2>
            <div>
              <input
                type="text"
                id="url"
                name="url"
                readOnly
                value={fullUrl}
                style={{ width: 400 }}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(fullUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

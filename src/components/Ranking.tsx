import { FC } from "react";
import { Player } from "../types/models.types";
import { Flipped, Flipper } from "react-flip-toolkit";
import "./Ranking.css";

export const Ranking: FC<{ players?: Array<Player> }> = ({ players }) => {
  if (!players || players.length === 0) return null;

  return (
    <Flipper flipKey={players.map((p) => p.profileName).join("")}>
      <ul className="list">
        {players.map((p, i) => (
          <Flipped key={p.profileName} flipId={p.profileName}>
            <li>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div className="rank-ordinal">
                  {p.exScore !== undefined && `${i + 1}.`} {p.profileName}
                </div>
                <div className="rank-ordinal">
                  {p.exScore !== undefined &&
                    Number(p.exScore).toLocaleString(undefined, {
                      style: "percent",
                      minimumFractionDigits: 2,
                    })}
                </div>
              </div>
            </li>
          </Flipped>
        ))}
      </ul>
    </Flipper>
  );
};

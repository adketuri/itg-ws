import { FC, PropsWithChildren } from "react";
import { Player } from "../types/models.types";
import { useSearchParams } from "react-router";
import "./Pacemaker.css";

const COLORS = ["#145057", "#22622D", "#4F5714", "#493A16", "#552613"];
const DARK_COLORS = ["#092326", "#0F2B14", "#232609", "#211A0A", "#251008"];
const RANKS = ["1st", "2nd", "3rd"];

const getRanking = (ranking: number) =>
  ranking >= RANKS.length ? `${ranking + 1}th` : RANKS[ranking];

export const PacemakerWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <div className="pacemaker-wrapper">{children}</div>;
};

export const Pacemaker: FC<{
  player: Player;
  averageScore: number;
  index: number;
  ranking?: number;
}> = ({ player, averageScore, ranking, index = 0 }) => {
  const [searchParams] = useSearchParams();

  if (!player.exScore || ranking === undefined) {
    return null;
  }

  const range = parseFloat(searchParams.get("pacemakerscale") || "1");
  console.log(searchParams.get("range"), range);

  const min = Math.max(0, averageScore - range);
  const max = Math.min(1, averageScore + range) - min;
  const displayScore = Math.max(player.exScore - min, 0);

  const color = ranking === 0 ? "white" : "lightgray";
  return (
    <div className="pacemaker-bar-wrapper">
      <div
        className="pacemaker-bar-back"
        style={{ backgroundColor: DARK_COLORS[index % DARK_COLORS.length] }}
      >
        <div
          className="pacemaker-bar-front"
          style={{
            height: `${Math.floor((displayScore / max) * 100)}%`,
            backgroundColor: COLORS[index % COLORS.length],
          }}
        >
          <div className="pacemaker-bar-content">
            <div className="pacemaker-ranking" style={{ color }}>
              {getRanking(ranking)}
            </div>
            <div className="pacemaker-score" style={{ color }}>
              {Number(player.exScore).toLocaleString(undefined, {
                style: "percent",
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="pacemaker-name">{player.profileName}</div>
    </div>
  );
};

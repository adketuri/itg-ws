import { FC } from "react";
import { SelectSongPayload } from "../types/events.types";
import "./SongInfo.css";

export const SongInfo: FC<
  Partial<SelectSongPayload & { progress: number }>
> = ({ songInfo, progress = 0 }) => {
  if (!songInfo) return null;

  return (
    <div className="bar-container">
      <div
        className="bar-inner"
        style={{ width: `${Math.floor(progress * 100)}%` }}
      />
      <div className="bar-info">{songInfo.title}</div>
      <div className="bar-info" style={{ fontSize: 14, top: "50%" }}>
        {songInfo.songPath.includes("/")
          ? songInfo.songPath.split("/")[0]
          : songInfo.songPath}
      </div>
    </div>
  );
};
import { FC } from "react";
import { SelectSongPayload } from "../types/events.types";
import "./SongInfo.css";

export const SongInfo: FC<
  Partial<SelectSongPayload & { progress: number }>
> = ({ songInfo, progress = 0 }) => {
  if (!songInfo)
    return (
      <div className="bar-selecting">
        <div className="bar-info" style={{ marginTop: 12 }}>
          Selecting Song...
        </div>
      </div>
    );

  return (
    <div className="bar-container">
      <div
        className="bar-inner"
        style={{ width: `${Math.floor(progress * 100)}%`, display: "flex" }}
      />
      <div className="bar-info">
        {songInfo.title}
        <div style={{ fontSize: 24 }}>
          {songInfo.songPath.includes("/")
            ? songInfo.songPath.split("/")[0]
            : songInfo.songPath}
        </div>
      </div>
    </div>
  );
};

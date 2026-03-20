import { FC } from "react";
import { PacemakerWrapper, Pacemaker } from "./Pacemaker";
import { SongInfo } from "./SongInfo";
import { Player } from "../types/models.types";

export const DebugPacemaker: FC = () => {
  const lobby = {
    songInfo: {
      songPath: "",
      songTitle: "ABC",
      songArtist: "LMAO",
      title: "Hi",
      artist: "LOL",
      songLength: 10,
    },
    players: [
      {
        profileName: "P1",
        playerId: "P1",
        ready: true,
        exScore: 40,
      } as Player,
      {
        profileName: "P2",
        playerId: "P2",
        ready: true,
        exScore: 60,
      } as Player,
    ],
  };
  const progress = 0.4;
  const averageScore = 50;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <SongInfo songInfo={lobby.songInfo} progress={progress} />
      <PacemakerWrapper>
        {lobby.players
          .sort((p1, p2) => (p1.profileName > p2.profileName ? 1 : -1))
          .map((p, i) => (
            <Pacemaker
              key={p.profileName}
              player={p}
              ranking={i}
              averageScore={averageScore}
              index={i}
            />
          ))}
      </PacemakerWrapper>
    </div>
  );
};

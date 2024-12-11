import { FC } from "react";
import { Player } from "../types/models.types";

export const Pacemaker: FC<{ player: Player }> = ({ player }) => {
  return <>{player.profileName}</>;
};

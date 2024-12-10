export type SocketId = string;

export type LobbyCode = string;

export interface Judgments {
  fantasticPlus: number;
  fantastics: number;
  excellents: number;
  greats: number;
  decents?: number;
  wayOffs?: number;
  misses: number;
  totalSteps: number;
  minesHit: number;
  totalMines: number;
  holdsHeld: number;
  totalHolds: number;
  rollsHeld: number;
  totalRolls: number;
}

export interface Spectator {
  profileName: string;
  socketId?: SocketId;
}

export interface SongInfo {
  songPath: string;
  title: string;
  artist: string;
  stepartist: string;
  songLength: number;
}

export interface Player {
  playerId: string;
  profileName: string;

  judgments?: Judgments;
  score?: number;
  exScore?: number;
}

export class Machine {
  player1?: Player;
  player2?: Player;
  socketId?: SocketId;
  ready?: boolean;
}

export interface Lobby {
  code: LobbyCode;
  // Empty string here is equivalent to "no password". We could use undefined
  // but we can consider them the same.
  password: string;
  machines: Record<SocketId, Machine>;
  spectators: Record<SocketId, Spectator>;
  songInfo?: SongInfo;
}

export interface LobbyInfo {
  code: LobbyCode;
  isPasswordProtected: boolean;
  playerCount: number;
  spectatorCount: number;
}

export interface LoggedMessage {
  message: string;
  outbound: boolean;
}

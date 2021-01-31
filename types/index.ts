import {
  User,
  Team,
  Game,
  Pick as PickModel,
  LeaderboardEntry,
  TieBreaker,
} from '@prisma/client';

export type ErrorResponse = {
  message: string;
};

export type ClientUser = Omit<User, 'password' | 'resetToken' | 'resetExpiry'>;

export type ClientUserResponse = {
  currentUser: ClientUser | null;
};

export enum CacheKey {
  CurrentUser = 'CURRENT_USER',
}

export type CreateUserResponse = {
  success: true;
};

export type TeamsResponse = {
  teams: Team[];
};

export interface PickWithTeamAndUserName extends PickModel {
  team: Team;
  user: {username: string};
}

export interface GameWithTeamsAndPicks extends Game {
  home: Team;
  away: Team;
  picks?: PickWithTeamAndUserName[];
}

export interface GameWithTeams extends Game {
  home: Team;
  away: Team;
}

export interface GameWithTeamsAndPicksAndUserPick
  extends GameWithTeamsAndPicks {
  userPick?: PickWithTeamAndUserName;
}

export interface TieBreakerWithUser extends TieBreaker {
  user: Pick<User, 'id' | 'username'>;
}
export interface GamesResponse {
  games: GameWithTeamsAndPicksAndUserPick[];
  userTieBreaker?: TieBreakerWithUser;
  tieBreakers?: TieBreakerWithUser[];
}

export type GameResponse = {
  game: GameWithTeamsAndPicks;
};

export interface LeaderboardEntryWithUserInfo extends LeaderboardEntry {
  user: Pick<User, 'id' | 'username'>;
  total: number;
}

export interface LeaderboardEntryResponse {
  entries: LeaderboardEntryWithUserInfo[];
  success: boolean;
  message?: string;
}

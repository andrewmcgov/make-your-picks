import {User, Team, Game, Pick} from '@prisma/client';

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

export interface PickWithTeamAndUserName extends Pick {
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

export interface GamesResponse {
  games: GameWithTeamsAndPicksAndUserPick[];
}

export type GameResponse = {
  game: GameWithTeamsAndPicks;
};

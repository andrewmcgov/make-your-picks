import {Game} from '@prisma/client';

export function gameStarted(game: Game) {
  return Date.parse((game.start as unknown) as string) < Date.now();
}

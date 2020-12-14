-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "homeId" INTEGER NOT NULL,
    "awayId" INTEGER NOT NULL,
    "start" DATETIME NOT NULL,
    "winnerId" TEXT,
    "league" TEXT NOT NULL,
    "week" TEXT NOT NULL,
    "season" TEXT NOT NULL,

    FOREIGN KEY ("homeId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("awayId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("id", "homeId", "awayId", "start", "winnerId", "league", "week", "season") SELECT "id", "homeId", "awayId", "start", "winnerId", "league", "week", "season" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

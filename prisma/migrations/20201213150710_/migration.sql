/*
  Warnings:

  - Added the required column `nickName` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "city" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nickName" TEXT NOT NULL,
    "league" TEXT NOT NULL,
    "abr" TEXT NOT NULL
);
INSERT INTO "new_Team" ("id", "city", "fullName", "league", "abr") SELECT "id", "city", "fullName", "league", "abr" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

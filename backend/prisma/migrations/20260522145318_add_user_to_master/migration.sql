-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Master" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "photo" TEXT,
    "userId" INTEGER,
    CONSTRAINT "Master_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Master" ("experience", "id", "name", "photo", "specialization") SELECT "experience", "id", "name", "photo", "specialization" FROM "Master";
DROP TABLE "Master";
ALTER TABLE "new_Master" RENAME TO "Master";
CREATE UNIQUE INDEX "Master_userId_key" ON "Master"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

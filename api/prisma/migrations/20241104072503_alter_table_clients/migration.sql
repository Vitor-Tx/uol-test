/*
  Warnings:

  - Made the column `cpf` on table `clients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `clients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `clients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `clients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `clients` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_clients" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL
);
INSERT INTO "new_clients" ("cpf", "email", "id", "name", "phone", "status") SELECT "cpf", "email", "id", "name", "phone", "status" FROM "clients";
DROP TABLE "clients";
ALTER TABLE "new_clients" RENAME TO "clients";
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");
CREATE UNIQUE INDEX "clients_cpf_key" ON "clients"("cpf");
CREATE UNIQUE INDEX "clients_phone_key" ON "clients"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

/*
  Warnings:

  - The primary key for the `LoadoutEntry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[loadoutId,weapon]` on the table `LoadoutEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "LoadoutEntry" DROP CONSTRAINT "LoadoutEntry_pkey",
ADD CONSTRAINT "LoadoutEntry_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "LoadoutEntry_loadoutId_weapon_key" ON "LoadoutEntry"("loadoutId", "weapon");

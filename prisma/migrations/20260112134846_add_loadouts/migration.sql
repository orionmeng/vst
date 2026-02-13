/*
  Warnings:

  - The primary key for the `LoadoutEntry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `userId` on table `Loadout` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Loadout" DROP CONSTRAINT "Loadout_userId_fkey";

-- DropIndex
DROP INDEX "Loadout_userId_idx";

-- DropIndex
DROP INDEX "LoadoutEntry_loadoutId_weapon_key";

-- AlterTable
ALTER TABLE "Loadout" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "LoadoutEntry" DROP CONSTRAINT "LoadoutEntry_pkey",
ADD CONSTRAINT "LoadoutEntry_pkey" PRIMARY KEY ("loadoutId", "weapon");

-- AddForeignKey
ALTER TABLE "Loadout" ADD CONSTRAINT "Loadout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

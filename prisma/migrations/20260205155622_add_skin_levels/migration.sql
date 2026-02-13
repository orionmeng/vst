-- AlterTable
ALTER TABLE "Loadout" ALTER COLUMN "icon" DROP NOT NULL,
ALTER COLUMN "icon" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Skin" ADD COLUMN     "levels" JSONB;

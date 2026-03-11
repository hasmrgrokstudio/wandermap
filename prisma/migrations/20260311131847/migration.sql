-- AlterTable
ALTER TABLE "cities" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "countries" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "emoji_tags" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "updated_at" DROP DEFAULT;

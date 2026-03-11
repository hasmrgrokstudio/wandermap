-- Добавляем двуязычные описания для Country, City, Tag

ALTER TABLE "countries"
  ADD COLUMN "description_ru" TEXT,
  ADD COLUMN "description_en" TEXT;

ALTER TABLE "cities"
  ADD COLUMN "description_ru" TEXT,
  ADD COLUMN "description_en" TEXT;

ALTER TABLE "tags"
  ADD COLUMN "description_ru" TEXT,
  ADD COLUMN "description_en" TEXT;

-- Мигрируем старое описание (если было) в description_ru
UPDATE "countries"
SET "description_ru" = "description"
WHERE "description" IS NOT NULL;

UPDATE "cities"
SET "description_ru" = "description"
WHERE "description" IS NOT NULL;

-- У тегов ранее не было поля description, мигрировать нечего

-- Удаляем старое поле description, чтобы избежать путаницы
ALTER TABLE "countries"
  DROP COLUMN "description";

ALTER TABLE "cities"
  DROP COLUMN "description";


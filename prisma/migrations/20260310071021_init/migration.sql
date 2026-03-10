-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "description" TEXT,
    "flag_emoji" TEXT,
    "cover_image" TEXT,
    "meta_title" TEXT,
    "meta_desc" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "description" TEXT,
    "cover_image" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "meta_title" TEXT,
    "meta_desc" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "country_id" INTEGER NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "places" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "title_en" TEXT,
    "review_ru" TEXT,
    "review_en" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "price_level" INTEGER NOT NULL DEFAULT 0,
    "address" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "cover_image" TEXT,
    "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "visit_date" TIMESTAMP(3),
    "meta_title" TEXT,
    "meta_desc" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "city_id" INTEGER NOT NULL,

    CONSTRAINT "places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "name_en" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "meta_title" TEXT,
    "meta_desc" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emoji_tags" (
    "id" SERIAL NOT NULL,
    "emoji" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "name_en" TEXT,
    "description_ru" TEXT,
    "description_en" TEXT,
    "meta_title" TEXT,
    "meta_desc" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emoji_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PlaceToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PlaceToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EmojiTagToPlace" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EmojiTagToPlace_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_slug_key" ON "countries"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "cities_country_id_slug_key" ON "cities"("country_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "places_city_id_slug_key" ON "places"("city_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "emoji_tags_emoji_key" ON "emoji_tags"("emoji");

-- CreateIndex
CREATE UNIQUE INDEX "emoji_tags_slug_key" ON "emoji_tags"("slug");

-- CreateIndex
CREATE INDEX "_PlaceToTag_B_index" ON "_PlaceToTag"("B");

-- CreateIndex
CREATE INDEX "_EmojiTagToPlace_B_index" ON "_EmojiTagToPlace"("B");

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlaceToTag" ADD CONSTRAINT "_PlaceToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlaceToTag" ADD CONSTRAINT "_PlaceToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmojiTagToPlace" ADD CONSTRAINT "_EmojiTagToPlace_A_fkey" FOREIGN KEY ("A") REFERENCES "emoji_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmojiTagToPlace" ADD CONSTRAINT "_EmojiTagToPlace_B_fkey" FOREIGN KEY ("B") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

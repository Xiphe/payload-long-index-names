import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "users_ingredient_sections_section_ingredients_locales" (
  	"ingredient_name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "_users_v_version_ingredient_sections_section_ingredients_locales" (
  	"ingredient_name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DROP INDEX IF EXISTS "users_ingredient_sections_section_ingredients_locale_idx";
  DROP INDEX IF EXISTS "users_ingredient_sections_locale_idx";
  DROP INDEX IF EXISTS "_users_v_version_ingredient_sections_section_ingredients_locale_idx";
  DROP INDEX IF EXISTS "_users_v_version_ingredient_sections_locale_idx";
  DO $$ BEGIN
   ALTER TABLE "users_ingredient_sections_section_ingredients_locales" ADD CONSTRAINT "users_ingredient_sections_section_ingredients_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users_ingredient_sections_section_ingredients"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_users_v_version_ingredient_sections_section_ingredients_locales" ADD CONSTRAINT "_users_v_version_ingredient_sections_section_ingredients_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_users_v_version_ingredient_sections_section_ingredients"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE UNIQUE INDEX IF NOT EXISTS "users_ingredient_sections_section_ingredients_locales_locale_parent_id_unique" ON "users_ingredient_sections_section_ingredients_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "_users_v_version_ingredient_sections_section_ingredients_locales_locale_parent_id_unique" ON "_users_v_version_ingredient_sections_section_ingredients_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "users_ingredient_sections_section_ingredients" DROP COLUMN IF EXISTS "_locale";
  ALTER TABLE "users_ingredient_sections_section_ingredients" DROP COLUMN IF EXISTS "ingredient_name";
  ALTER TABLE "users_ingredient_sections" DROP COLUMN IF EXISTS "_locale";
  ALTER TABLE "_users_v_version_ingredient_sections_section_ingredients" DROP COLUMN IF EXISTS "_locale";
  ALTER TABLE "_users_v_version_ingredient_sections_section_ingredients" DROP COLUMN IF EXISTS "ingredient_name";
  ALTER TABLE "_users_v_version_ingredient_sections" DROP COLUMN IF EXISTS "_locale";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_ingredient_sections_section_ingredients_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_users_v_version_ingredient_sections_section_ingredients_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_ingredient_sections_section_ingredients_locales" CASCADE;
  DROP TABLE "_users_v_version_ingredient_sections_section_ingredients_locales" CASCADE;
  ALTER TABLE "users_ingredient_sections_section_ingredients" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "users_ingredient_sections_section_ingredients" ADD COLUMN "ingredient_name" varchar;
  ALTER TABLE "users_ingredient_sections" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "_users_v_version_ingredient_sections_section_ingredients" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "_users_v_version_ingredient_sections_section_ingredients" ADD COLUMN "ingredient_name" varchar;
  ALTER TABLE "_users_v_version_ingredient_sections" ADD COLUMN "_locale" "_locales" NOT NULL;
  CREATE INDEX IF NOT EXISTS "users_ingredient_sections_section_ingredients_locale_idx" ON "users_ingredient_sections_section_ingredients" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "users_ingredient_sections_locale_idx" ON "users_ingredient_sections" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_users_v_version_ingredient_sections_section_ingredients_locale_idx" ON "_users_v_version_ingredient_sections_section_ingredients" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_users_v_version_ingredient_sections_locale_idx" ON "_users_v_version_ingredient_sections" USING btree ("_locale");`)
}

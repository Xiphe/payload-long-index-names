import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'fr');
  CREATE TYPE "public"."enum_users_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__users_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__users_v_published_locale" AS ENUM('en', 'fr');
  CREATE TABLE IF NOT EXISTS "users_ingredient_sections_section_ingredients" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ingredient_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "users_ingredient_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_users_status" DEFAULT 'draft',
  	"email" varchar,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "_users_v_version_ingredient_sections_section_ingredients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"ingredient_name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_users_v_version_ingredient_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_users_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__users_v_version_status" DEFAULT 'draft',
  	"version_email" varchar,
  	"version_reset_password_token" varchar,
  	"version_reset_password_expiration" timestamp(3) with time zone,
  	"version_salt" varchar,
  	"version_hash" varchar,
  	"version_login_attempts" numeric DEFAULT 0,
  	"version_lock_until" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__users_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DO $$ BEGIN
   ALTER TABLE "users_ingredient_sections_section_ingredients" ADD CONSTRAINT "users_ingredient_sections_section_ingredients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users_ingredient_sections"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "users_ingredient_sections" ADD CONSTRAINT "users_ingredient_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_users_v_version_ingredient_sections_section_ingredients" ADD CONSTRAINT "_users_v_version_ingredient_sections_section_ingredients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_users_v_version_ingredient_sections"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_users_v_version_ingredient_sections" ADD CONSTRAINT "_users_v_version_ingredient_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_users_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_users_v" ADD CONSTRAINT "_users_v_parent_id_users_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "users_ingredient_sections_section_ingredients_order_idx" ON "users_ingredient_sections_section_ingredients" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "users_ingredient_sections_section_ingredients_parent_id_idx" ON "users_ingredient_sections_section_ingredients" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "users_ingredient_sections_section_ingredients_locale_idx" ON "users_ingredient_sections_section_ingredients" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "users_ingredient_sections_order_idx" ON "users_ingredient_sections" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "users_ingredient_sections_parent_id_idx" ON "users_ingredient_sections" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "users_ingredient_sections_locale_idx" ON "users_ingredient_sections" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "users__status_idx" ON "users" USING btree ("_status");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "_users_v_version_ingredient_sections_section_ingredients_order_idx" ON "_users_v_version_ingredient_sections_section_ingredients" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_users_v_version_ingredient_sections_section_ingredients_parent_id_idx" ON "_users_v_version_ingredient_sections_section_ingredients" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_users_v_version_ingredient_sections_section_ingredients_locale_idx" ON "_users_v_version_ingredient_sections_section_ingredients" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_users_v_version_ingredient_sections_order_idx" ON "_users_v_version_ingredient_sections" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_users_v_version_ingredient_sections_parent_id_idx" ON "_users_v_version_ingredient_sections" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_users_v_version_ingredient_sections_locale_idx" ON "_users_v_version_ingredient_sections" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_users_v_parent_idx" ON "_users_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_users_v_version_version_updated_at_idx" ON "_users_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_users_v_version_version_created_at_idx" ON "_users_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_users_v_version_version__status_idx" ON "_users_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_users_v_version_version_email_idx" ON "_users_v" USING btree ("version_email");
  CREATE INDEX IF NOT EXISTS "_users_v_created_at_idx" ON "_users_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_users_v_updated_at_idx" ON "_users_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_users_v_snapshot_idx" ON "_users_v" USING btree ("snapshot");
  CREATE INDEX IF NOT EXISTS "_users_v_published_locale_idx" ON "_users_v" USING btree ("published_locale");
  CREATE INDEX IF NOT EXISTS "_users_v_latest_idx" ON "_users_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_users_v_autosave_idx" ON "_users_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_ingredient_sections_section_ingredients" CASCADE;
  DROP TABLE "users_ingredient_sections" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "_users_v_version_ingredient_sections_section_ingredients" CASCADE;
  DROP TABLE "_users_v_version_ingredient_sections" CASCADE;
  DROP TABLE "_users_v" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_status";
  DROP TYPE "public"."enum__users_v_version_status";
  DROP TYPE "public"."enum__users_v_published_locale";`)
}

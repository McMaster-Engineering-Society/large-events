ALTER TABLE "users" ADD COLUMN "name" varchar(255) NOT NULL DEFAULT '';
ALTER TABLE "users" ADD COLUMN "is_system_admin" boolean DEFAULT false NOT NULL;
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;

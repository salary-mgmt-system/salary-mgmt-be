import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1781807371731 implements MigrationInterface {
    name = 'InitialSchema1781807371731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "salaries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "employee_id" uuid NOT NULL, "base_salary" numeric(15,2) NOT NULL, "bonus" numeric(15,2) NOT NULL DEFAULT '0', "effective_date" date NOT NULL, "is_current" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "chk_salaries_bonus_min" CHECK ("bonus" >= 0), CONSTRAINT "chk_salaries_base_salary_min" CHECK ("base_salary" >= 0), CONSTRAINT "PK_20ca60aa8d4201c7bcb430fdb36" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_employee_current_salary" ON "salaries"  ("employee_id") WHERE is_current = true`);
        await queryRunner.query(`CREATE INDEX "IDX_7147253b7b7085f033753d4f4e" ON "salaries"  ("employee_id", "is_current") `);
        await queryRunner.query(`CREATE TABLE "salary_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "employee_id" uuid NOT NULL, "old_salary" numeric(15,2) NOT NULL, "new_salary" numeric(15,2) NOT NULL, "reason" character varying NOT NULL, "changed_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "chk_salary_history_new_salary_min" CHECK ("new_salary" >= 0), CONSTRAINT "chk_salary_history_old_salary_min" CHECK ("old_salary" >= 0), CONSTRAINT "PK_796fc91fc02d8e1b35a08c3de32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dab273bfeb6e0fbd0f228f4660" ON "salary_history"  ("employee_id", "changed_at") `);
        await queryRunner.query(`CREATE TABLE "employees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "employee_code" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "department" character varying NOT NULL, "designation" character varying NOT NULL, "country" character varying NOT NULL, "currency" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a3ef94443aea823b546594c7d7" ON "employees"  ("country") `);
        await queryRunner.query(`CREATE INDEX "IDX_a927eecda70146bdf59674d939" ON "employees"  ("department") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_765bc1ac8967533a04c74a9f6a" ON "employees"  ("email") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_56162b5f24af743a154680684f" ON "employees"  ("employee_code") `);
        await queryRunner.query(`ALTER TABLE "salaries" ADD CONSTRAINT "FK_9ac79195d31e77bb6df432eab13" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "salary_history" ADD CONSTRAINT "FK_c70621f2e600c3f966898714db3" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "salary_history" DROP CONSTRAINT "FK_c70621f2e600c3f966898714db3"`);
        await queryRunner.query(`ALTER TABLE "salaries" DROP CONSTRAINT "FK_9ac79195d31e77bb6df432eab13"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_56162b5f24af743a154680684f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_765bc1ac8967533a04c74a9f6a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a927eecda70146bdf59674d939"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a3ef94443aea823b546594c7d7"`);
        await queryRunner.query(`DROP TABLE "employees"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dab273bfeb6e0fbd0f228f4660"`);
        await queryRunner.query(`DROP TABLE "salary_history"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7147253b7b7085f033753d4f4e"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_employee_current_salary"`);
        await queryRunner.query(`DROP TABLE "salaries"`);
    }

}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingItemProperties1669060599823 implements MigrationInterface {
  name = 'addingItemProperties1669060599823';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "item_property" ("itemPropertyId" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "value" character varying NOT NULL, "itemId" uuid, CONSTRAINT "PK_f7d1201728096929708d890b116" PRIMARY KEY ("itemPropertyId"))`
    );
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "tokenId" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "status" SET DEFAULT '3'`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "likes" SET DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "createdAt" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
    await queryRunner.query(
      `ALTER TABLE "item_property" ADD CONSTRAINT "FK_db347c1090b7ade933a46c74ed6" FOREIGN KEY ("itemId") REFERENCES "item"("itemId") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_property" DROP CONSTRAINT "FK_db347c1090b7ade933a46c74ed6"`
    );
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "updatedAt" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "createdAt" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "likes" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "status" SET DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "tokenId" SET NOT NULL`);
    await queryRunner.query(`DROP TABLE "item_property"`);
  }
}

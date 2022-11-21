import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1669062725559 implements MigrationInterface {
  name = 'Init1669062725559';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "image" ("imageId" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "cid" character varying NOT NULL, CONSTRAINT "PK_2ac5a151312927435af8f68eec8" PRIMARY KEY ("imageId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" character varying, "transactionType" character varying NOT NULL, "listId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, "itemId" uuid, CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "itemId" uuid, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "item_like" ("itemLikeId" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid, "accountId" uuid, CONSTRAINT "PK_c3e97ab2c88fdff97bf4f77960f" PRIMARY KEY ("itemLikeId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "item_property" ("itemPropertyId" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "value" character varying NOT NULL, "itemId" uuid, CONSTRAINT "PK_f7d1201728096929708d890b116" PRIMARY KEY ("itemPropertyId"))`
    );
    await queryRunner.query(`CREATE TYPE "public"."item_status_enum" AS ENUM('0', '1', '2', '3')`);
    await queryRunner.query(
      `CREATE TABLE "item" ("itemId" uuid NOT NULL DEFAULT uuid_generate_v4(), "tokenId" integer, "listId" integer, "collectionAddress" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "price" character varying, "royalty" integer NOT NULL, "status" "public"."item_status_enum" NOT NULL DEFAULT '3', "likes" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, "ownerId" uuid, "imageId" uuid, CONSTRAINT "REL_4e9b8917d85122b13f11939d7d" UNIQUE ("imageId"), CONSTRAINT "PK_51d980088ed0b9a65dc50c94e92" PRIMARY KEY ("itemId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "account" ("accountId" uuid NOT NULL DEFAULT uuid_generate_v4(), "address" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "UQ_83603c168bc00b20544539fbea6" UNIQUE ("address"), CONSTRAINT "PK_b1a9fdd281787a66a213f5b725b" PRIMARY KEY ("accountId"))`
    );
    await queryRunner.query(
      `ALTER TABLE "history" ADD CONSTRAINT "FK_8c2a3b11c7a69eac1208fdbbae2" FOREIGN KEY ("ownerId") REFERENCES "account"("accountId") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "history" ADD CONSTRAINT "FK_b7287cf2d635d7b11e2aeb84297" FOREIGN KEY ("itemId") REFERENCES "item"("itemId") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "tag" ADD CONSTRAINT "FK_354a481a69a7f0c77a15527ea9a" FOREIGN KEY ("itemId") REFERENCES "item"("itemId") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "item_like" ADD CONSTRAINT "FK_cc7440b3d30054095fa49a03ab5" FOREIGN KEY ("itemId") REFERENCES "item"("itemId") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "item_like" ADD CONSTRAINT "FK_5cee6d339d6726b436cbc4ae7f9" FOREIGN KEY ("accountId") REFERENCES "account"("accountId") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "item_property" ADD CONSTRAINT "FK_db347c1090b7ade933a46c74ed6" FOREIGN KEY ("itemId") REFERENCES "item"("itemId") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_04548d2604521d54d9ac383df0c" FOREIGN KEY ("authorId") REFERENCES "account"("accountId") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_3b030ef7f2840a721547a3c492e" FOREIGN KEY ("ownerId") REFERENCES "account"("accountId") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_4e9b8917d85122b13f11939d7d8" FOREIGN KEY ("imageId") REFERENCES "image"("imageId") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_4e9b8917d85122b13f11939d7d8"`);
    await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_3b030ef7f2840a721547a3c492e"`);
    await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_04548d2604521d54d9ac383df0c"`);
    await queryRunner.query(
      `ALTER TABLE "item_property" DROP CONSTRAINT "FK_db347c1090b7ade933a46c74ed6"`
    );
    await queryRunner.query(
      `ALTER TABLE "item_like" DROP CONSTRAINT "FK_5cee6d339d6726b436cbc4ae7f9"`
    );
    await queryRunner.query(
      `ALTER TABLE "item_like" DROP CONSTRAINT "FK_cc7440b3d30054095fa49a03ab5"`
    );
    await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_354a481a69a7f0c77a15527ea9a"`);
    await queryRunner.query(
      `ALTER TABLE "history" DROP CONSTRAINT "FK_b7287cf2d635d7b11e2aeb84297"`
    );
    await queryRunner.query(
      `ALTER TABLE "history" DROP CONSTRAINT "FK_8c2a3b11c7a69eac1208fdbbae2"`
    );
    await queryRunner.query(`DROP TABLE "account"`);
    await queryRunner.query(`DROP TABLE "item"`);
    await queryRunner.query(`DROP TYPE "public"."item_status_enum"`);
    await queryRunner.query(`DROP TABLE "item_property"`);
    await queryRunner.query(`DROP TABLE "item_like"`);
    await queryRunner.query(`DROP TABLE "tag"`);
    await queryRunner.query(`DROP TABLE "history"`);
    await queryRunner.query(`DROP TABLE "image"`);
  }
}

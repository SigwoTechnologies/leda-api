import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1670881063713 implements MigrationInterface {
  name = 'init1670881063713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "image" ("imageId" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "cid" character varying NOT NULL, CONSTRAINT "PK_2ac5a151312927435af8f68eec8" PRIMARY KEY ("imageId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" character varying, "transactionType" character varying NOT NULL, "listId" integer, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ownerId" uuid, "itemId" uuid, CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id"))`
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
    await queryRunner.query(
      `CREATE TABLE "voucher" ("voucherId" uuid NOT NULL DEFAULT uuid_generate_v4(), "minPrice" character varying NOT NULL, "uri" character varying NOT NULL, "royalties" integer NOT NULL, "signature" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "itemId" uuid, "authorId" uuid, CONSTRAINT "REL_6cccf38c5dba355c51df422f5a" UNIQUE ("itemId"), CONSTRAINT "PK_8d728f0fbaf2d1235cd05acaa36" PRIMARY KEY ("voucherId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "collection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, "imageId" uuid, CONSTRAINT "REL_5c0708ff48feca5216fef7859f" UNIQUE ("imageId"), CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE TYPE "public"."item_status_enum" AS ENUM('0', '1', '2')`);
    await queryRunner.query(
      `CREATE TABLE "item" ("itemId" uuid NOT NULL DEFAULT uuid_generate_v4(), "tokenId" integer, "listId" integer, "name" character varying NOT NULL, "description" character varying NOT NULL, "collectionAddress" character varying, "price" character varying, "isHidden" boolean DEFAULT false, "royalty" integer NOT NULL, "status" "public"."item_status_enum" NOT NULL DEFAULT '2', "likes" integer NOT NULL DEFAULT '0', "isLazy" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, "ownerId" uuid, "collectionId" uuid, "imageId" uuid, CONSTRAINT "UQ_7bd5f4d3ef52bfaa138ada4cf81" UNIQUE ("listId"), CONSTRAINT "REL_4e9b8917d85122b13f11939d7d" UNIQUE ("imageId"), CONSTRAINT "PK_51d980088ed0b9a65dc50c94e92" PRIMARY KEY ("itemId"))`
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
      `ALTER TABLE "voucher" ADD CONSTRAINT "FK_6cccf38c5dba355c51df422f5a6" FOREIGN KEY ("itemId") REFERENCES "item"("itemId") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "voucher" ADD CONSTRAINT "FK_64fade51f57bb5c6d53801abec3" FOREIGN KEY ("authorId") REFERENCES "account"("accountId") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "collection" ADD CONSTRAINT "FK_71af9149c567d79c9532f7e47d0" FOREIGN KEY ("ownerId") REFERENCES "account"("accountId") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "collection" ADD CONSTRAINT "FK_5c0708ff48feca5216fef7859f0" FOREIGN KEY ("imageId") REFERENCES "image"("imageId") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_04548d2604521d54d9ac383df0c" FOREIGN KEY ("authorId") REFERENCES "account"("accountId") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_3b030ef7f2840a721547a3c492e" FOREIGN KEY ("ownerId") REFERENCES "account"("accountId") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_b5f86671d5a560c42ccce5d9d2b" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_4e9b8917d85122b13f11939d7d8" FOREIGN KEY ("imageId") REFERENCES "image"("imageId") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_4e9b8917d85122b13f11939d7d8"`);
    await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_b5f86671d5a560c42ccce5d9d2b"`);
    await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_3b030ef7f2840a721547a3c492e"`);
    await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_04548d2604521d54d9ac383df0c"`);
    await queryRunner.query(
      `ALTER TABLE "collection" DROP CONSTRAINT "FK_5c0708ff48feca5216fef7859f0"`
    );
    await queryRunner.query(
      `ALTER TABLE "collection" DROP CONSTRAINT "FK_71af9149c567d79c9532f7e47d0"`
    );
    await queryRunner.query(
      `ALTER TABLE "voucher" DROP CONSTRAINT "FK_64fade51f57bb5c6d53801abec3"`
    );
    await queryRunner.query(
      `ALTER TABLE "voucher" DROP CONSTRAINT "FK_6cccf38c5dba355c51df422f5a6"`
    );
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
    await queryRunner.query(`DROP TABLE "collection"`);
    await queryRunner.query(`DROP TABLE "voucher"`);
    await queryRunner.query(`DROP TABLE "item_property"`);
    await queryRunner.query(`DROP TABLE "item_like"`);
    await queryRunner.query(`DROP TABLE "tag"`);
    await queryRunner.query(`DROP TABLE "history"`);
    await queryRunner.query(`DROP TABLE "image"`);
  }
}

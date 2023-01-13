import { MigrationInterface, QueryRunner } from 'typeorm';

export class accountInformation1673616966435 implements MigrationInterface {
  name = 'accountInformation1673616966435';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "account" ADD "username" character varying`);
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "UQ_41dfcb70af895ddf9a53094515b" UNIQUE ("username")`
    );
    await queryRunner.query(`ALTER TABLE "account" ADD "backgroundId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "UQ_907e58534f4a89c8b0c95514d3f" UNIQUE ("backgroundId")`
    );
    await queryRunner.query(`ALTER TABLE "account" ADD "pictureId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "UQ_abb1452444a28137c45db08906e" UNIQUE ("pictureId")`
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_907e58534f4a89c8b0c95514d3f" FOREIGN KEY ("backgroundId") REFERENCES "image"("imageId") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_abb1452444a28137c45db08906e" FOREIGN KEY ("pictureId") REFERENCES "image"("imageId") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_abb1452444a28137c45db08906e"`
    );
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_907e58534f4a89c8b0c95514d3f"`
    );
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "UQ_abb1452444a28137c45db08906e"`
    );
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "pictureId"`);
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "UQ_907e58534f4a89c8b0c95514d3f"`
    );
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "backgroundId"`);
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "UQ_41dfcb70af895ddf9a53094515b"`
    );
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "username"`);
  }
}

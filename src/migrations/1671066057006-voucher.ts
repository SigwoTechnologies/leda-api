import { MigrationInterface, QueryRunner } from 'typeorm';

export class voucher1671066057006 implements MigrationInterface {
  name = 'voucher1671066057006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "voucher" ADD "tokenId" integer`);
    await queryRunner.query(
      `ALTER TABLE "voucher" ADD "stakingRewards" integer NOT NULL DEFAULT '0'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "voucher" DROP COLUMN "stakingRewards"`);
    await queryRunner.query(`ALTER TABLE "voucher" DROP COLUMN "tokenId"`);
  }
}

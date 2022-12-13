import { MigrationInterface, QueryRunner } from 'typeorm';

export class stakingRewards1670961397562 implements MigrationInterface {
  name = 'stakingRewards1670961397562';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" ADD "stakingRewards" integer NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "stakingRewards"`);
  }
}

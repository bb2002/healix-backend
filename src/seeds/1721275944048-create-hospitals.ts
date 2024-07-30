import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHospitals1721275944048 implements MigrationInterface {
  name = 'CreateHospitals1721275944048';

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('TRUNCATE hospitals');
  }

  public async up(queryRunner: QueryRunner): Promise<any> {
    try {
      await queryRunner.query(`
      IF NOT EXISTS (
          SELECT 1
          FROM sys.indexes
          WHERE name = 'lati_long_idx'
          AND object_id = OBJECT_ID('dbo.hospitals')
      )
      BEGIN
          CREATE INDEX lati_long_idx ON dbo.hospitals (latitude, longitude)
      END
      `)
    } catch(ex) {}
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHospitals1721275944048 implements MigrationInterface {
  name = 'CreateHospitals1721275944048';

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('TRUNCATE hospitals');
  }

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `
          INSERT INTO dbo.hospitals (institution_name,institution_type,medical_department,medical_department_doctor_count,homepage,address,tel,latitude,longitude) VALUES (N'가톨릭대학교 성빈센트병원',N'상급종합',N'치과보존과',1,N'http://www.cmcvincent.or.kr/skip.html',N'경기도 수원시 팔달구 중부대로 93, (지동)','031-1577-8588',127.0274271,37.2779855);
          INSERT INTO dbo.hospitals (institution_name,institution_type,medical_department,medical_department_doctor_count,homepage,address,tel,latitude,longitude) VALUES (N'가톨릭대학교인천성모병원',N'상급종합',N'치주과',1,N'http://www.cmcism.or.kr/',N'인천광역시 부평구 동수로 56, (부평동)','032-1544-9004',126.7248987,37.4848309);
          INSERT INTO dbo.hospitals (institution_name,institution_type,medical_department,medical_department_doctor_count,homepage,address,tel,latitude,longitude) VALUES (N'강릉아산병원',N'상급종합',N'치과보철과',1,N'http://www.gnah.co.kr',N'강원특별자치도 강릉시 사천면 방동길 38, (사천면)','033-610-3114',128.8578411,37.8184325);
          INSERT INTO dbo.hospitals (institution_name,institution_type,medical_department,medical_department_doctor_count,homepage,address,tel,latitude,longitude) VALUES (N'강북삼성병원',N'상급종합',N'치과보존과',0,N'http://www.kbsmc.co.kr',N'서울특별시 종로구 새문안로 29, (평동)','02-2001-2001',126.96775,37.5684083);
          INSERT INTO dbo.hospitals (institution_name,institution_type,medical_department,medical_department_doctor_count,homepage,address,tel,latitude,longitude) VALUES (N'건국대학교병원',N'상급종합',N'치과교정과',0,N'http://www.kuh.ac.kr',N'서울특별시 광진구 능동로 120-1, (화양동)','1588-1533',127.0718276,37.5403764);
          INSERT INTO dbo.hospitals (institution_name,institution_type,medical_department,medical_department_doctor_count,homepage,address,tel,latitude,longitude) VALUES (N'경북대학교병원',N'상급종합',N'영상치의학과',0,N'http://knumc.knu.ac.kr',N'대구광역시 중구 동덕로 130, (삼덕동2가, 경북대학교병원)','053-200-5114',128.604703,35.8662525);
          INSERT INTO dbo.hospitals (institution_name,institution_type,medical_department,medical_department_doctor_count,homepage,address,tel,latitude,longitude) VALUES (N'경상국립대학교병원',N'상급종합',N'구강악안면외과',1,N'http://www.gnuh.co.kr/',N'경상남도 진주시 강남로 79, (칠암동)','055-750-8000',128.0964924,35.1759944);
          INSERT INTO dbo.hospitals (institution_name,institution_type,medical_department,medical_department_doctor_count,homepage,address,tel,latitude,longitude) VALUES (N'경희대학교병원',N'상급종합',N'구강악안면외과',0,N'http://www.khuh.or.kr/',N'서울특별시 동대문구 경희대로 23, (회기동)','02-958-8114',127.051852,37.5941195);
          INSERT INTO dbo.hospitals (institution_name,institution_type,medical_department,medical_department_doctor_count,homepage,address,tel,latitude,longitude) VALUES (N'계명대학교동산병원',N'상급종합',N'예방치과',0,N'http://www.dsmc.or.kr/',N'대구광역시 달서구 달구벌대로 1035, (신당동)','1577-6622',128.4801315,35.8538856);
          INSERT INTO dbo.hospitals (institution_name,institution_type,medical_department,medical_department_doctor_count,homepage,address,tel,latitude,longitude) VALUES (N'고려대학교의과대학부속구로병원',N'상급종합',N'예방치과',0,N'http://guro.kumc.or.kr/main/index.do',N'서울특별시 구로구 구로동로 148, 고려대부속구로병원 (구로동)','02-2626-1114',126.8848701,37.492052);
          INSERT INTO dbo.hospitals (institution_name,institution_type,medical_department,medical_department_doctor_count,homepage,address,tel,latitude,longitude) VALUES (N'고려대학교의과대학부속안산병원',N'상급종합',N'치과보존과',2,N'http://ansan.kumc.or.kr/main/index.do',N'경기도 안산시 단원구 적금로 123, (고잔동)','031-1577-7516',126.8249033,37.3185144);
      `,
    );

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
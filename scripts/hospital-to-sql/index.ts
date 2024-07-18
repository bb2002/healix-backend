import * as fs from 'fs';
import { createWriteStream } from 'fs';
import csv from 'csv-parser';

interface CSVRecord {
  [unique_id: string]: {
    institution_name: string | null;
    institution_type: string | null;
    medical_department: string | null;
    medical_department_doctor_count: number | null;
    homepage: string | null;
    address: string | null;
    tel: string | null;
    latitude: number | null;
    longitude: number | null;
  };
}

const results: CSVRecord = {};

async function main() {
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream('병원정보.csv')
      .pipe(csv())
      .on('data', (data: any) => {
        results[data['﻿암호화요양기호']] = {
          institution_name: data['요양기관명'], // ex) 볼봇병원
          institution_type: data['종별코드명'], // ex) 상급종합
          medical_department: null, // ex) 내과
          medical_department_doctor_count: null, // ex) 1
          homepage: data['병원홈페이지'],
          address: data['주소'],
          tel: data['전화번호'],
          latitude: data['좌표(X)'],
          longitude: data['좌표(Y)'],
        };
      })
      .on('end', () => {
        console.log('Progress: 40%');
        resolve();
      })
      .on('error', (err: Error) => {
        console.error(err);
        reject(err);
      });
  });

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream('진료과목정보.csv')
      .pipe(csv())
      .on('data', (data: any) => {
        results[data['﻿암호화요양기호']] = {
          ...results[data['﻿암호화요양기호']],
          medical_department: data['진료과목코드명'],
          medical_department_doctor_count: Number(data['과목별 전문의수']),
        };
      })
      .on('end', () => {
        console.log('Progress: 80%');
        resolve();
      })
      .on('error', (err: Error) => {
        reject(err);
      });
  });

  const writeStream = createWriteStream('hospitals.sql');
  const limit = 10;
  let size = 0;
  for (const key in results) {
    const institution = results[key];
    const line =
      'INSERT INTO dbo.hospitals (' +
      'institution_name,institution_type,medical_department,medical_department_doctor_count,homepage,address,tel,latitude,longitude' +
      ') VALUES (' +
      `${institution.institution_name ? `N'${institution.institution_name}'` : 'NULL'},` +
      `${institution.institution_type ? `N'${institution.institution_type}'` : 'NULL'},` +
      `${institution.medical_department ? `N'${institution.medical_department}'` : 'NULL'},` +
      `${institution.medical_department_doctor_count !== null ? institution.medical_department_doctor_count : 'NULL'},` +
      `${institution.homepage ? `N'${institution.homepage}'` : 'NULL'},` +
      `${institution.address ? `N'${institution.address}'` : 'NULL'},` +
      `${institution.tel ? `'${institution.tel}'` : 'NULL'},` +
      `${institution.latitude !== null ? institution.latitude : 'NULL'},` +
      `${institution.longitude !== null ? institution.longitude : 'NULL'}` +
      ');';
    writeStream.write(line + '\n');
    ++size;

    if (size > limit) {
      break;
    }
  }

  writeStream.end(() => {
    console.log('OK');
  });

  // 오류 처리
  writeStream.on('error', (err) => {
    console.error('Error writing to file:', err);
  });
}

main()
  .then()
  .catch((err: Error) => console.error(err));

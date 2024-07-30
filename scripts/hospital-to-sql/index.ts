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

function replace(str: string) {
  return str.replace(/'/g, '');
}

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
          latitude: data['좌표(Y)'],
          longitude: data['좌표(X)'],
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
  const start = 60000;
  const stop = 80000;
  let cursor = 0;
  for (const key in results) {
    const {
      institution_name,
      institution_type,
      medical_department,
      medical_department_doctor_count,
      homepage,
      address,
      tel,
      latitude,
      longitude,
    } = results[key];

    if (
      !institution_name ||
      !institution_type ||
      !medical_department ||
      !address ||
      !latitude ||
      !longitude
    ) {
      continue;
    }

    const line =
      'INSERT INTO dbo.hospitals (' +
      'institution_name,institution_type,medical_department,medical_department_doctor_count,homepage,address,tel,latitude,longitude' +
      ') VALUES (' +
      `N'${replace(institution_name)}',` +
      `N'${replace(institution_type)}',` +
      `N'${replace(medical_department)}',` +
      `${medical_department_doctor_count !== null ? medical_department_doctor_count : 0},` +
      `${homepage ? `N'${replace(homepage)}'` : 'NULL'},` +
      `N'${replace(address)}',` +
      `${tel ? `'${replace(tel)}'` : 'NULL'},` +
      `${latitude},` +
      `${longitude}` +
      ');';
    if (cursor >= start && cursor < stop) {
      writeStream.write(line + '\n');
    }

    if (cursor > stop) {
      break;
    }

    ++cursor;
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

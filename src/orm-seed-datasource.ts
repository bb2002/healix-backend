import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'mssql',
  host: process.env.AZURE_SQL_HOST,
  port: 1433,
  username: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASS,
  database: process.env.AZURE_SQL_NAME,
  entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
  synchronize: true,
  migrations: [__dirname + '/seeds/*{.ts,.js}'],
});

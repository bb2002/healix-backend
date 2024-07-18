import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { HospitalModule } from './hospital/hospital.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'mssql',
        host: configService.get<string>('AZURE_SQL_HOST'),
        port: 1433,
        username: configService.get<string>('AZURE_SQL_USER'),
        password: configService.get<string>('AZURE_SQL_PASS'),
        database: configService.get<string>('AZURE_SQL_NAME'),
        entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    HospitalModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { HospitalModule } from './hospital/hospital.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { TerminusModule } from '@nestjs/terminus';

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
        connectionTimeout: 1000 * 120,
      }),
    }),
    TerminusModule,
    HospitalModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

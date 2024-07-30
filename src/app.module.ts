import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { HospitalModule } from './hospital/hospital.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { TerminusModule } from '@nestjs/terminus';
import { UserModule } from './user/user.module';
import { OpenaiModule } from './openai/openai.module';
import { JwtModule } from '@nestjs/jwt';
import { ExamineModule } from './examine/examine.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

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
        entities: [__dirname + '/**/entities/*.entity.{ts,js}'],
        synchronize: true,
        connectionTimeout: 1000 * 120,
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
        global: true,
      }),
    }),
    TerminusModule,
    HospitalModule,
    AuthModule,
    UserModule,
    OpenaiModule,
    ExamineModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

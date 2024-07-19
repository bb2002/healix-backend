import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('HealthCheck')
@Controller()
export class AppController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly typeormHealthIndicator: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: '헬스체크',
    description: '서버 헬스체크를 수행합니다.',
  })
  check() {
    return this.healthCheckService.check([
      () =>
        this.typeormHealthIndicator.pingCheck('database', {
          timeout: 1000 * 120,
        }),
    ]);
  }
}

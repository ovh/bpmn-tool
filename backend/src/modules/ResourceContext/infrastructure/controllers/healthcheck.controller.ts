import { Controller, Get } from '@nestjs/common';
import type { HealthCheckResult } from '@nestjs/terminus';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller()
export class HealthCheckController {
  constructor(private healthCheckService: HealthCheckService) {}

  @Get(process.env.HEALTHCHECK_PATH || '/health')
  @HealthCheck()
  async liveness(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([]);
  }
}

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeormConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  const ssl = ['required', 'strict'].includes(
    configService.getOrThrow('database.ssl'),
  );

  return {
    name: 'default',
    type: 'postgres',
    host: configService.getOrThrow('database.host'),
    port: configService.getOrThrow('database.port'),
    username: configService.getOrThrow('database.user'),
    password: configService.getOrThrow('database.password'),
    database: configService.getOrThrow('database.database'),
    entities: [`${__dirname}/../../../../../modules/**/*.ormEntity.{ts,js}`],
    connectTimeoutMS: 20000,
    synchronize: false,
    logging: ['error', 'migration', 'schema'],
    ssl: ssl ? { rejectUnauthorized: false } : false,
  };
};

import { Module, Global } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: ():CacheModuleOptions => ({
        store: redisStore,
        host: 'localhost',
        port: 6379,
        ttl: 5,
      }),
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}

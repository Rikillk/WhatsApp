// redis-cache.module.ts
import { Module, Global } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store'; // Import the Redis store
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';

@Global() // Make the module global to share the Redis cache instance across the entire app
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: ():CacheModuleOptions => ({
        store: redisStore, // Use the imported Redis store
        host: 'localhost', // Redis server host
        port: 6379,        // Redis server port
        ttl: 5,           // Default TTL (time-to-live) for cached items in seconds
      }),
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}

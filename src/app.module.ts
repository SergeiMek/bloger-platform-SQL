import { configModule } from './confid';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllDeleteController } from './featores/testing/testing.controller';
import { UserAccountsModule } from './featores/user-accounts/user-accounts.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdminAccountsModule } from './featores/superAdmin/superAdmin-platform.module';
import { BlogAccountsModule } from './featores/bloggers-platform/bloggers-platform.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nodejs',
      password: '1972',
      database: 'blog-platform-SQL',
      autoLoadEntities: false,
      synchronize: false,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
    configModule,
    UserAccountsModule,
    SuperAdminAccountsModule,
    BlogAccountsModule,
  ],
  controllers: [AppController, AllDeleteController],
  providers: [AppService],
})
export class AppModule {}

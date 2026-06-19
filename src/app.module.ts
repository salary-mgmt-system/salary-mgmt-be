import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { databaseConfig, appConfig, validateEnv } from './config/index';
import { EmployeesModule } from './employees/employees.module';
import { SalariesModule } from './salaries/salaries.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { InsightsModule } from './insights/insights.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      validate: validateEnv,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),

    // Database
    DatabaseModule,

    // Feature modules
    EmployeesModule,
    SalariesModule,
    AnalyticsModule,
    InsightsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {Loan} from './loan/entity'
import {LoanModule} from './loan/loan.module'
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'semil##232499',
      database: 'loansystem',
      models: [Loan], 
      autoLoadModels: true,
      synchronize: true,
    }),
    LoanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

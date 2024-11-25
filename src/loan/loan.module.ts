import { Module } from '@nestjs/common';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { Loan } from './entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [SequelizeModule.forFeature([Loan]), CommonModule],
  controllers: [LoanController],
  providers: [LoanService],
})
export class LoanModule {}

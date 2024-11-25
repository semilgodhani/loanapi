import {
  Body,
  Controller,
  Query,
  Post,
  Get,
  Res,
  Delete,
  Param,
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { query } from 'express';
import { Response } from 'express';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanservice: LoanService) {}

  @Post('add-data')
  async createUser(
    @Body()
    body: {
      loanid: number;
      userid: number;
      amount: number;
      principalrate: number;
      disbursementdate: Date;
      loanstatus: boolean;
      closingdate: Date;
    },
  ) {
    return this.loanservice.createUser(
      body.loanid,
      body.userid,
      body.amount,
      body.principalrate,
      body.disbursementdate,
      body.loanstatus,
      body.closingdate,
    );
  }

  @Get('data')
  async loanyear(
    @Query() query: { loanid?: number; disbursementdate?: string },
  ) {
    const loans = await this.loanservice.findAllData(query);
    return loans;
  }

  @Get('paginationdata')
  async paginate(@Query() query: any, @Res() res: Response) {
    try {
      const fileBuffer = await this.loanservice.paginate(query);
      if (fileBuffer instanceof Buffer) {
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader('Content-Disposition', 'attachment; filename=loans.xlsx');
        return res.send(fileBuffer);
      }
      return res.send(fileBuffer);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  @Delete(':loanid')
  async deleteLoan(@Query('loanid') loanid: number, @Res() res: Response) {
    try {
      await this.loanservice.deleteLoan(loanid);
      return res.status(200).send({ message: 'Loan deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Error deleting loan' });
    }
  }
}

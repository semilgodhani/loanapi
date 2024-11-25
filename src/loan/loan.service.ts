import { Injectable } from '@nestjs/common';
import { Loan } from './entity';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { CommonService } from '../common/common.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class LoanService {
  constructor(
    @InjectModel(Loan)
    private userModel: typeof Loan,
    private commonService: CommonService,
  ) {}

  async createUser(
    loanid: number,
    userid: number,
    amount: number,
    principalrate: number,
    disbursementdate: Date,
    loanstatus: boolean,
    closingdate: Date,
  ): Promise<Loan> {
    return this.userModel.create({
      loanid,
      userid,
      amount,
      principalrate,
      disbursementdate,
      loanstatus,
      closingdate,
    });
  }

  async findAllData(query) {
    try {
      if (!query.disbursementdate) return { error: true };

      const filter: any = {};
      const { year, month, day } = this.commonService.extractDate(
        query.disbursementdate,
      );

      const { startOfDate, endOfDate } = this.commonService.getDateRange(
        year,
        month,
        day,
        query.type,
      );

      filter.disbursementdate = {
        [Op.gte]: startOfDate,
        [Op.lt]: endOfDate,
      };
      const aggregatedData = await this.userModel.findOne({
        attributes: [
          [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount'],
          [Sequelize.fn('COUNT', Sequelize.col('loanid')), 'totalLoans'],
        ],
        where: filter,
      });

      return aggregatedData;
    } catch (error) {
      console.error(error);
    }
  }

  async findAll(page = 4, limit = 4) {
    const offset = (page - 1) * limit;
    return this.userModel.findAll({
      offset: offset,
      limit: limit,
    });
  }

  async paginate(query: any, page = 1, limit = 4) {
    const { startdate, enddate, searchtext, isupload } = query;

    if (!startdate || !enddate)
      throw new Error('start date and end date are required');

    if (!searchtext) return 'searchtext are required';

    const startDate = new Date(startdate);
    const endDate = new Date(enddate);

    // if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    //   return { error: 'Invalid date format' };
    // }
    const filter: any = {
      disbursementdate: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    };
    filter.name = {
      [Op.iLike]: `%${searchtext}%`,
    };

    const offset = (page - 1) * limit;

    const { count, rows } = await this.userModel.findAndCountAll({
      where: filter,
      offset: offset,
      limit: limit,
    });

    const totalPages = Math.ceil(count / limit);

    if (!isupload || isupload == 'false') return 'please isupload is true';
    {
      const allRows = await this.userModel.findAll({
        where: filter,
      });
      console.log(allRows);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Loans');

      worksheet.columns = [
        { header: 'Loan ID', key: 'loanid', width: 15 },
        { header: 'User ID', key: 'userid', width: 15 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Principal Rate', key: 'principalrate', width: 15 },
        { header: 'Disbursement Date', key: 'disbursementdate', width: 25 },
        { header: 'Loan Status', key: 'loanstatus', width: 15 },
        { header: 'Closing Date', key: 'closingdate', width: 25 },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Email', key: 'email', width: 25 },
      ];

      allRows.forEach((row) => {
        worksheet.addRow({
          loanid: row.loanid,
          userid: row.userid,
          amount: row.amount,
          principalrate: row.principalrate,
          disbursementdate: row.disbursementdate,
          loanstatus: row.loanstatus,
          closingdate: row.closingdate,
          name: row.name,
          email: row.email,
        });
      });
      const buffer = await workbook.xlsx.writeBuffer();

      return buffer;
    }

    return {
      data: rows,
      totalPages: totalPages,
      currentPage: page,
      totalItems: count,
    };
  }

  async deleteLoan(loanid: number) {
    try {
      const loan = await this.userModel.findOne({ where: { loanid } });

      if (!loan) {
        throw new Error('Loan not found');
      }

      await loan.destroy();
    } catch (error) {
      console.error('Error deleting loan:', error);
      throw new Error('Error deleting loan');
    }
  }
}

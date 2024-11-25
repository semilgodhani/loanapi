import { Injectable } from '@nestjs/common';
import { error } from 'console';

@Injectable()
export class CommonService {
  extractDate(givenDate: number) {
    const date = new Date(givenDate);
    console.log('Parsed Date: ', date.toISOString());

    const [year, month, day] = date
      .toISOString()
      .split('T')[0]
      .split('-')
      .map(Number);
    // console.log(`Extracted Year: ${year}, Month: ${month}, Day: ${day}`);

    return { year, month, day };
  }

  getDateRange(year: number, month: number, day: number, type: string) {
    let startOfDate = new Date(year, month, day);
    let endOfDate = new Date(year, month, day);
    if (type == 'year') {
      startOfDate = new Date(year, 0, 1);
      endOfDate = new Date(year + 1, 0, 1);
    } else if (type === 'month') {
      startOfDate = new Date(year, month - 1, 1);
      endOfDate = new Date(year, month, 0);
    } else if (type === 'day') {
      startOfDate = new Date(year, month - 1, day, 0, 0, 0);
      endOfDate = new Date(year, month - 1, day, 23, 59, 59, 999);
    } else {
      throw new Error(
        'Invalid type provided. Expected type: year, month, or day',
      );
    }
    return { startOfDate, endOfDate };
  }
}

import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export class HttpResponse {
  static ok = (
    res: Response,
    data: { [x: string]: any },
    message: string,
    status = HttpStatus.OK,
  ) => {
    return res.status(status).json({ data, message });
  };
  static created = (
    res: Response,
    data: { [x: string]: any },
    message: string,
    status = HttpStatus.CREATED,
  ) => {
    return res.status(status).json({ data, message });
  };
}

export const calculateRenewalAndExpiration = (billingCycle, currentDate) => {
  const now = new Date(currentDate);

  if (billingCycle === 'Monthly') {
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const renewalDate = nextMonth.toISOString().split('T')[0];

    const expirationDate = new Date(nextMonth);
    expirationDate
      .setDate(expirationDate.getDate() - 1)
      .toString()
      .split('T');

    return { renewalDate, expirationDate };
  } else if (billingCycle === 'Annually') {
    const nextYear = new Date(now);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const renewalDate = nextYear.toISOString().split('T')[0];
    // Expiration date is the day before renewal date
    const expirationDate = new Date(nextYear);
    expirationDate
      .setDate(expirationDate.getDate() - 1)
      .toString()
      .split('T')[0];

    return { renewalDate, expirationDate };
  }
};

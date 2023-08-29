import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import * as CryptoJS from 'crypto-js';

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

    return { renewalDate, expirationDate, startDate: now };
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

    return { renewalDate, expirationDate, startDate: nextYear };
  }
};

// Replace this with a proper key generation and management mechanism

export const encrypt = (data: string, secretKey: string): string => {
  // return CryptoJS.AES.encrypt(data, secretKey).toString();

  console.log({ secretKey });
  return CryptoJS.AES.encrypt(JSON.stringify({ data }), 'secretKey').toString();
};

export const decrypt = (encryptedData: string, secretKey: string): string => {
  console.log({ secretKey });

  // const decrypted = CryptoJS.AES.decrypt(encryptedData, secretKey);
  // return decrypted.toString(CryptoJS.enc.Utf8);
  return JSON.parse(
    CryptoJS.AES.decrypt(encryptedData, 'secretKey').toString(
      CryptoJS.enc.Utf8,
    ),
  ).data;
};

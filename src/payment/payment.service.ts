import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {
  constructor(private readonly httpService: HttpService) {}

  async post(url: string, headers: any, data: any): Promise<any> {
    const config: AxiosRequestConfig = {
      headers: headers,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, data, config),
      );
      if (!response.data.status) {
        throw new HttpException(response.data.message, 400);
      }
      return response.data;
    } catch (error) {
      // Handle errors here
      throw new HttpException(
        error?.response?.data?.message || 'error occur  ',
        400,
      );
    }
  }
}

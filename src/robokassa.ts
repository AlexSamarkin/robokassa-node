import * as crypto from 'crypto-js';
import { Order, RobokassaConfig } from './types';
import { BASE_URL } from './constants';

export class Robokassa {
  private static BASE_URL = BASE_URL;
  constructor(private readonly config: RobokassaConfig) {}

  public async generatePaymentLink(order: Order): Promise<string> {
    const url = new URL(Robokassa.BASE_URL);

    const isTest = this.config.isTest ? '1' : '0';

    url.searchParams.append('MerchantLogin', this.config.merchantId);
    url.searchParams.append('Culture', this.config.culture ?? 'ru');
    url.searchParams.append('Encoding', this.config.encoding ?? 'utf-8');
    url.searchParams.append('OutSum', order.outSum.toFixed(2));
    url.searchParams.append('Description', encodeURIComponent(order.description ?? ''));

    url.searchParams.append('Email', order.email);

    if (order.expirationDate) {
      url.searchParams.append('ExpirationDate', order.expirationDate.toISOString());
    }

    if (order.outSumCurrency) {
      url.searchParams.append('OutSumCurrency', order.outSumCurrency);
    }

    if (isTest) {
      url.searchParams.append('IsTest', isTest);
    }

    if (order.additionalParams) {
      Object.keys(order.additionalParams).forEach((key: string) => {
        url.searchParams.append(`Shp_${key}`, order.additionalParams[key]);
      });
    }

    const signature = await this.createSignature(order);

    url.searchParams.append('Receipt', Robokassa.generateReceiptString(order));
    url.searchParams.append('SignatureValue', signature);

    return url.href;
  }

  public async checkPayment(signature: string, invId: number, order: Order): Promise<boolean> {
    const hashFn = this.getHashAlgoFn();
    const additionalParams = Robokassa.generateAdditionalParamsString(order);
    const hash = await hashFn(`${order.outSum.toFixed(2)}:${invId}:${this.config.passwordTwo}${additionalParams}`);

    return hash.toString().toUpperCase() === signature.toUpperCase();
  }

  public async checkPaymentSuccessURL(signature: string, invId: number, order: Order): Promise<boolean> {
    const hashFn = this.getHashAlgoFn();
    const hash = await hashFn(
      `${order.outSum.toFixed(2)}:${invId}:${this.config.passwordOne}${Robokassa.generateAdditionalParamsString(
        order,
      )}`,
    );

    return hash.toString().toUpperCase() === signature.toUpperCase();
  }

  private async createSignature(order: Order): Promise<string> {
    const hashFn = this.getHashAlgoFn();
    const additionalParams = Robokassa.generateAdditionalParamsString(order);
    const sumString = order.outSum.toFixed(2);
    const invIdString = String(order.invId) ?? '';
    const outSumCurrency = order.outSumCurrency ? `:${order.outSumCurrency}` : '';
    const signature = await hashFn(
      `${this.config.merchantId}:${sumString}:${invIdString}${outSumCurrency}:${Robokassa.generateReceiptString(
        order,
      )}:${this.config.passwordOne}:${additionalParams}`,
    );

    return signature.toString();
  }

  private static generateReceiptString(order: Order): string {
    return encodeURIComponent(
      JSON.stringify({
        items: order.items,
      }),
    );
  }

  private static generateAdditionalParamsString(order: Order): string {
    return order.additionalParams
      ? Object.keys(order.additionalParams).reduce((accString, paramKey) => {
          accString += `:Shp_${paramKey}=${order.additionalParams[paramKey]}`;
          return accString;
        }, '')
      : '';
  }

  private getHashAlgoFn() {
    switch (this.config.hashAlgo) {
      case 'MD5':
        return crypto.MD5;
      case 'SHA1':
        return crypto.SHA1;
      case 'SHA256':
        return crypto.SHA256;
      case 'SHA384':
        return crypto.SHA384;
      case 'SHA512':
        return crypto.SHA512;
      default:
        return crypto.MD5;
    }
  }
}

import * as crypto from 'crypto-js';
import { CheckPaymentParams, Order, ReceiptItem, RobokassaConfig, SNO } from './types';
import { BASE_URL } from './constants';

export class Robokassa {
  private static BASE_URL = BASE_URL;
  private readonly additionalParamPrefix: string;

  constructor(private readonly config: RobokassaConfig) {
    this.additionalParamPrefix = config.additionalParamPrefix ?? 'Shp_';

    if (config.debug) {
      console.warn(
        'You are running robokassa-node in debug mode. You private credentials will be shown in console. Please make sure you disabled debug mode in production',
      );
    }
  }

  public async generatePaymentLink(order: Order): Promise<string> {
    const url = new URL(Robokassa.BASE_URL);

    const isTest = !!this.config.isTest ? '1' : '0';

    url.searchParams.append('MerchantLogin', this.config.merchantId);
    url.searchParams.append('Culture', this.config.culture ?? 'ru');
    url.searchParams.append('Encoding', this.config.encoding ?? 'utf-8');
    url.searchParams.append('OutSum', order.outSum.toFixed(2));
    url.searchParams.append('Description', encodeURIComponent(order.description ?? ''));

    url.searchParams.append('Email', order.email);

    if (order.expirationDate) {
      url.searchParams.append('ExpirationDate', order.expirationDate.toISOString());
    }

    url.searchParams.append('IsTest', isTest);

    if (order.additionalParams) {
      Object.keys(order.additionalParams).forEach((key: string) => {
        url.searchParams.append(`${this.additionalParamPrefix}${key}`, order.additionalParams[key]);
      });
    }

    const signature = await this.createSignature(order);

    if (order.items?.length) {
      url.searchParams.append('Receipt', Robokassa.generateReceiptString(order));
    }

    url.searchParams.append('SignatureValue', signature);

    return url.href;
  }

  public async checkPayment(params: CheckPaymentParams): Promise<boolean> {
    const hashFn = this.getHashAlgoFn();
    const additionalParams = this.generateAdditionalParamsString(params.order);
    const hash = await hashFn(`${params.sum}:${params.invId}:${this.config.passwordTwo}${additionalParams}`);

    if (this.config.debug) {
      console.debug(`Params: `, params);
      console.debug(`Hash: ${hash.toString()}`);
    }

    return hash.toString().toUpperCase() === params.signature.toUpperCase();
  }

  public async checkPaymentSuccessURL(signature: string, invId: number, order: Order): Promise<boolean> {
    const hashFn = this.getHashAlgoFn();
    const hash = await hashFn(
      `${order.outSum.toFixed(2)}:${invId}:${this.config.passwordOne}${this.generateAdditionalParamsString(order)}`,
    );

    return hash.toString().toUpperCase() === signature.toUpperCase();
  }

  private async createSignature(order: Order): Promise<string> {
    const hashFn = this.getHashAlgoFn();
    const additionalParams = this.generateAdditionalParamsString(order);
    const receiptString = order.items ? Robokassa.generateReceiptString(order) + ':' : '';
    const sumString = order.outSum.toFixed(2);
    const invIdString = String(order.invId ?? '');

    if (this.config.debug) {
      console.debug(
        `Signature before hashing: ${this.config.merchantId}:${sumString}:${invIdString}:${receiptString}${this.config.passwordOne}${additionalParams}`,
      );
      console.debug(`Hash algo: ${this.config.hashAlgo}`);
    }

    const signature = await hashFn(
      `${this.config.merchantId}:${sumString}:${invIdString}:${receiptString}${this.config.passwordOne}${additionalParams}`,
    );

    return signature.toString();
  }

  private static generateReceiptString(order: Order): string {
    const receipt: { sno?: SNO; items: ReceiptItem[] } = {
      items: order.items,
    };

    if (order.sno) {
      receipt.sno = order.sno;
    }

    return encodeURIComponent(JSON.stringify(receipt));
  }

  private generateAdditionalParamsString(order: Order): string {
    return order.additionalParams
      ? ':' +
          Object.keys(order.additionalParams)
            .sort()
            .map((key: string) => `${this.additionalParamPrefix}${key}=${order.additionalParams[key]}`)
            .join(':')
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

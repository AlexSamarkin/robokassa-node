import { Robokassa } from '../robokassa';
import { Order, PaymentMethod, PaymentObject, PaymentTax, RobokassaConfig } from '../types';
import * as crypto from 'crypto-js';

let config: RobokassaConfig;
let robokassa: Robokassa;

describe('Robokassa', () => {
  describe('generatePaymentLink', () => {
    beforeEach(() => {
      config = {
        merchantId: 'testMerchant',
        passwordOne: 'pass1',
        passwordTwo: 'pass2',
        hashAlgo: 'MD5',
      };
      robokassa = new Robokassa(config as RobokassaConfig);
    });
    it('should return valid payment link', async () => {
      const order: Order = {
        outSum: 1000,
        description: 'Test order',
        invId: 1,
        email: 'test@test.com',
        additionalParams: {
          orderId: 'o123',
          param1: 'value1',
        },
        items: [
          {
            name: 'Item 1',
            tax: PaymentTax.NONE,
            quantity: 1,
            payment_object: PaymentObject.PAYMENT,
            payment_method: PaymentMethod.FULL_PREPAYMENT,
            sum: '1000.00',
          },
        ],
      };

      const actualResult = await robokassa.generatePaymentLink(order);
      expect(actualResult).toBeTruthy();
    });
  });
  describe('checkPayment', () => {
    beforeEach(() => {
      config = {
        merchantId: 'testMerchant',
        passwordOne: 'pass1',
        passwordTwo: 'pass2',
        hashAlgo: 'MD5',
      };
      robokassa = new Robokassa(config as RobokassaConfig);
    });
    it('should return true', async () => {
      const order: Order = {
        outSum: 1000,
        description: 'Test order',
        invId: 1,
        email: 'test@test.com',
        additionalParams: {
          orderId: 'o123',
          param1: 'value1',
        },
      };

      const additionalParams = Object.keys(order.additionalParams).reduce((acc, key) => {
        acc += `:Shp_${key}=${order.additionalParams[key]}`;
        return acc;
      }, '');

      const signature = await crypto.MD5(`1000.000000:${order.invId}:${config.passwordTwo}${additionalParams}`);

      const actualResult = await robokassa.checkPayment({
        sum: '1000.000000',
        order: order,
        invId: order.invId,
        signature: signature.toString(),
      });

      expect(actualResult).toBe(true);
    });
    it('should return false', async () => {
      const order: Order = {
        outSum: 1000,
        description: 'Test order',
        invId: 1,
        email: 'test@test.com',
        additionalParams: {
          orderId: 'o123',
          param1: 'value1',
        },
      };

      const additionalParams = Object.keys(order.additionalParams).reduce((acc, key) => {
        acc += `:Shp_${key}=${order.additionalParams[key]}`;
        return acc;
      }, '');

      const signature = await crypto.MD5(
        `${order.outSum.toFixed(2)}:${order.invId}:${'InvalidPassword2'}${additionalParams}`,
      );

      const actualResult = await robokassa.checkPayment({
        sum: '10.000000',
        order: order,
        invId: order.invId,
        signature: signature.toString(),
      });

      expect(actualResult).toBe(false);
    });
  });
  describe('checkPaymentSuccessURL', () => {
    beforeEach(() => {
      config = {
        merchantId: 'testMerchant',
        passwordOne: 'pass1',
        passwordTwo: 'pass2',
        hashAlgo: 'MD5',
      };
      robokassa = new Robokassa(config as RobokassaConfig);
    });

    it('should return true', async () => {
      const order: Order = {
        outSum: 1000,
        description: 'Test order',
        invId: 1,
        email: 'test@test.com',
        additionalParams: {
          orderId: 'o123',
          param1: 'value1',
        },
      };

      const additionalParams = Object.keys(order.additionalParams).reduce((acc, key) => {
        acc += `:Shp_${key}=${order.additionalParams[key]}`;
        return acc;
      }, '');

      const signature = await crypto.MD5(
        `${order.outSum.toFixed(2)}:${order.invId}:${config.passwordOne}${additionalParams}`,
      );

      const actualResult = await robokassa.checkPaymentSuccessURL(signature.toString(), order.invId, order);

      expect(actualResult).toBe(true);
    });
    it('should return false', async () => {
      const order: Order = {
        outSum: 1000,
        description: 'Test order',
        invId: 1,
        email: 'test@test.com',
        additionalParams: {
          orderId: 'o123',
          param1: 'value1',
        },
      };

      const additionalParams = Object.keys(order.additionalParams).reduce((acc, key) => {
        acc += `:Shp_${key}=${order.additionalParams[key]}`;
        return acc;
      }, '');

      const signature = await crypto.MD5(
        `${order.outSum.toFixed(2)}:${order.invId}:${'IncorrentPass1'}${additionalParams}`,
      );

      const actualResult = await robokassa.checkPaymentSuccessURL(signature.toString(), order.invId, order);

      expect(actualResult).toBe(false);
    });
  });
});

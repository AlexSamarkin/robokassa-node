export interface RobokassaConfig {
  merchantId: string;
  passwordOne: string;
  passwordTwo: string;
  hashAlgo: 'MD5' | 'SHA1' | 'SHA256' | 'SHA384' | 'SHA512';
  isTest?: boolean;
  culture?: 'ru' | 'en';
  encoding?: 'utf-8' | 'win-1251';
  additionalParamPrefix?: 'shp_' | 'Shp_' | 'SHP_';
  debug?: boolean;
}

export interface Order {
  outSum: number;
  description: string;
  invId?: number;
  email: string;
  expirationDate?: Date;
  additionalParams?: Record<string, string>;
  items?: ReceiptItem[];
  sno?: SNO;
}

export enum PaymentMethod {
  FULL_PREPAYMENT = 'full_prepayment',
  PREPAYMENT = 'prepayment',
  FULL_PAYMENT = 'full_payment',
  ADVANCE = 'advance',
  CREDIT = 'credit',
  CREDIT_PAYMENT = 'credit_payment',
}

export enum PaymentObject {
  COMMODITY = 'commodity',
  EXCISE = 'excise',
  JOB = 'job',
  SERVICE = 'service',
  GAMBLING_BET = 'gambling_bet',
  GAMBLING_PRIZE = 'gambling_prize',
  LOTTERY = 'lottery',
  LOTTERY_PRIZE = 'lottery_prize',
  INTELLECTUAL_ACTIVITY = 'intellectual_activity',
  PAYMENT = 'payment',
  AGENT_COMMISSION = 'agent_commission',
  COMPOSITE = 'composite',
  ANOTHER = 'another',
  PROPERTY_RIGHT = 'property_right',
  NON_OPERATING_GAIN = 'non-operating_gain',
  INSURANCE_PREMIUM = 'insurance_premium',
  SALES_TAX = 'sales_tax',
  RESORT_FEE = 'resort_fee',
}

export enum PaymentTax {
  NONE = 'none',
  VAT_0 = 'vat0',
  VAT_10 = 'vat10',
  VAT_110 = 'vat110',
  VAT_20 = 'vat20',
  VAT_120 = 'vat120',
}

export interface ReceiptItem {
  name: string;
  quantity: number;
  sum: string;
  payment_method: PaymentMethod;
  payment_object: PaymentObject;
  tax: PaymentTax;
  nomenclature_code?: string;
}

export enum SNO {
  OSN = 'osn',
  USN_INCOME = 'usn_income',
  USN_INCOME_OUTCOME = 'usn_income_outcome',
  ENVD = 'envd',
  ESN = 'esn',
  PATENT = 'patent',
}

export interface CheckPaymentParams {
  sum: string | number;
  signature: string;
  invId: number;
  order: Order;
}

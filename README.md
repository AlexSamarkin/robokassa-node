# Robokassa Node

Пакет для работы с сервисом эквайринга Robokassa

## Установка

```bash
npm install robokassa-node --save
```

## Использование

Всю документацию по работе с API Робокассы можно найти здесь:
https://docs.robokassa.ru

```typescript

import { Robokassa } from 'robokassa-node;
import type { RobokassaConfig } from 'robokassa-node';

const config: RobokassaConfig = {
    merchantId: YOUR_MERCHANT_ID,
    passwordOne: YOUR_PASSWORD_1,
    passwordTwo: YOUR_PASSWORD_2,
    hashAlgo: 'MD5',
}

const robokassa = new Robokassa(config);
```

Поддерживаются методы:
- #### async generatePaymentLink(order: Order): Promise<string> - возвращает ссылку, ведущую на страницу оплаты
```typescript
   const order: Order = {
    outSum: 1000,
    additionalParams: {
        orderId: 'order_1',
    },
    description: `Описание заказа`,
    email: 'your@email.com',
    items: [
        {
            sno: SNO.USN_INCOME,
            name: `Товар "Товар 1"`,
            quantity: 1,
            sum: "1000.00",
            tax: PaymentTax.NONE,
            payment_method: PaymentMethod.FULL_PREPAYMENT,
            payment_object: PaymentObject.COMMODITY,
        },
    ],
};

const paymentLink = await robokassa.generatePaymentLink(order);
```
- #### async checkPayment(signature: string, invId: number, order: Order): Promise<boolean> - проверяет, успешно ли прошла оплата, в зависимости от переданных Робокассой параметров.
```typescript
   const order: Order = {
    outSum: 1000,
    additionalParams: {
        orderId: 'order_1',
    },
    description: `Описание заказа`,
    email: 'your@email.com',
    items: [
        {
            sno: SNO.USN_INCOME,
            name: `Товар "Товар 1"`,
            quantity: 1,
            sum: "1000.00",
            tax: PaymentTax.NONE,
            payment_method: PaymentMethod.FULL_PREPAYMENT,
            payment_object: PaymentObject.COMMODITY,
        },
    ],
};

const invId = 1;
const signature = 'SIGNATRUE_FROM_ROBOKASSA_RESPONSE';

const isSuccessfull = await robokassa.checkPayment(signature, invId, order);
```
- ###### async checkPaymentSuccessURL(signature: string, invId: number, order: Order): Promise<boolean> - проверяет, успешно ли прошла оплата при редиректе Робокассой на указанный в настройках URL успешной оплаты.
```typescript
   const order: Order = {
        outSum: 1000,
        additionalParams: {
            orderId: 'order_1',
        },
        description: `Описание заказа`,
        email: 'your@email.com',
        items: [
            {
                sno: SNO.USN_INCOME,
                name: `Товар "Товар 1"`,
                quantity: 1,
                sum: "1000.00",
                tax: PaymentTax.NONE,
                payment_method: PaymentMethod.FULL_PREPAYMENT,
                payment_object: PaymentObject.COMMODITY,
            },
        ],
   };

   const invId = 1;
   const signature = 'SIGNATRUE_FROM_ROBOKASSA_RESPONSE';

   const isSuccessfull = await robokassa.checkPaymentSuccessURL(signature, invId, order);
```

## Параметры и интерфейс

### RobokassaConfig

| Параметр | Тип | Описание | Обязательный
| ------ | ------ | ------ | ------ |
| merchantId | string | Ваш идентификатор магазина | Да
| passwordOne | string | Пароль#1 | Да
| passwordTwo | string | Пароль#2 | Да
| hashAlgo | enum('MD5', 'SHA1', 'SHA256', 'SHA384', 'SHA512') | Алгоритм шифрования для создания подписи | Да
| isTest | boolean | Тестовый режим оплаты (по умолчанию - false) | Нет
| culture | ru, en | | Нет
| encoding | utf-8, win-1251 | Кодировка | Нет
| additionalParamPrefix | shp_ , Shp_, SHP_ | Префикс для пользовательских параметров, переданных в ссылку для оплаты | Нет
| debug | boolean | Режим отладки | Нет

# Отказ от ответственности

Этот пакет не является официальным пакетом для работы с сервисом РОБОКАССА. Используйте на свой страх и риск.
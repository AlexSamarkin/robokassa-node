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

import { Robokassa } from 'robokassa-node';
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
- #### async checkPayment(params: CheckPaymentParams): Promise<boolean> - проверяет, успешно ли прошла оплата, в зависимости от переданных Робокассой параметров.
###### CheckPaymentParams

| Параметр | Тип | Описание | Обязательный
| ------ | ------ | ------ | ------ |
| sum | string | Сумма заказа, которая приходит от Робокассы | Да
| invId | number | номер заказа в Робокассе, приходит в ответе | Да
| signature | string | Подпись, приходит из Робоказзы | Да
| order | Order | Сущность заказа | Да

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

const params = {
    signature,
    invId,
    sum: "1000.000000",
    order
}

const isSuccessfull = await robokassa.checkPayment(params);
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
| hashAlgo | MD5, SHA1, SHA256, SHA384, SHA512 | Алгоритм шифрования для создания подписи | Да
| isTest | boolean | Тестовый режим оплаты (по умолчанию - false) | Нет
| culture | ru, en | | Нет
| encoding | utf-8, win-1251 | Кодировка | Нет
| additionalParamPrefix | shp_ , Shp_, SHP_ | Префикс для пользовательских параметров, переданных в ссылку для оплаты | Нет
| debug | boolean | Режим отладки | Нет

### Order

| Параметр | Тип | Описание | Обязательный
| ------ | ------ | ------ | ------ |
| outSum | number | Сумма заказа | Да
| description | string | Описание заказа | Да
| invId | number | Идентификатор заказа в Робокассе | Нет
| email | string | Email покупателя | Да
| expirationDate | Date | Дата, до которой возможна оплата заказа| Нет
| additionalParams | Record<string, any> | Дополнительные пользовательские параметры | Нет
| items | ReceiptItem[] | Массив товаров для фискализации | Нет
| sno | SNO | Система налогообложениы | Нет

# Отказ от ответственности

Этот пакет не является официальным пакетом для работы с сервисом РОБОКАССА. Используйте на свой страх и риск.
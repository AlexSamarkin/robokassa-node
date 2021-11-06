# Robokassa Node

Пакет для работы с сервисом эквайринга Robokassa

## Установка

```bash
npm install robokassa-node --save
```

## Использование

Всю документацию по работе с API Робокассы можно найти здесь:
https://docs.robokassa.ru

Поддерживаются методы:
- #### async generatePaymentLink(order: Order): Promise<string> - возвращает ссылку, ведущую на страницу оплаты
- #### async checkPayment(signature: string, invId: number, order: Order): Promise<boolean> - проверяет, успешно ли прошла оплата, в зависимости от переданных Робокассой параметров.
- #### async checkPaymentSuccessURL(signature: string, invId: number, order: Order): Promise<boolean> - проверяет, успешно ли прошла оплата при редиректе Робокассой на указанный в настройках URL успешной оплаты.

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

# Отказ от ответственности

Этот пакет не является официальным пакетом для работы с сервисом РОБОКАССА. Используйте на свой страх и риск.
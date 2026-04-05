import express from 'express';
import { VNPay, ProductCode, VnpLocale, dateFormat, ignoreLogger } from 'vnpay';

const app = express();
app.use(express.json());

const vnpay = new VNPay({
  tmnCode: 'Z7PPPJ39',
  secureSecret: '5Y7A0150OZSKQDDFHV0XH8D30T179KPK',
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true,
  hashAlgorithm: 'SHA512',
  loggerFn: ignoreLogger,
});

app.post('/api/create-qr', async (req, res) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const txnRef = `TEST${Date.now()}`;

  const paymentUrl = await vnpay.buildPaymentUrl({
    vnp_Amount: 50000,
    vnp_IpAddr: '127.0.0.1',
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: 'Thanh toan don hang',
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: 'http://localhost:3000/api/check-payment-vnpay',
    vnp_Locale: VnpLocale.VN,
    vnp_CreateDate: dateFormat(new Date()),
    vnp_ExpireDate: dateFormat(tomorrow),
  });

  console.log('\n=== PAYMENT URL ===');
  console.log(paymentUrl);
  console.log('===================\n');

  return res.status(201).json({ paymentUrl, txnRef });
});

app.get('/api/check-payment-vnpay', (req, res) => {
  console.log('\n=== RETURN PARAMS ===');
  console.log(req.query);
  console.log('=====================\n');
  res.json(req.query);
});

app.listen(3000, () => {
  console.log('Test server running at http://localhost:3000');
  console.log('POST http://localhost:3000/api/create-qr  to generate payment URL');
});

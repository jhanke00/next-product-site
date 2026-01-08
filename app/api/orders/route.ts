import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import sendgrid from '@sendgrid/mail';

export async function POST(req: Request) {  // API route to create order and send confirmation email
  try {
    const body = await req.json();
    const { items, shipping, total } = body;

    if (!items || !Array.isArray(items) || !shipping || !shipping.email) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Mock order creation
    const id = 'order_' + Date.now();

    // Mock payment processing (pretend success)
    const payment = { status: 'succeeded', provider: 'mock-stripe' };

    // If SENDGRID_API_KEY is provided, use SendGrid API for real delivery.
    // Otherwise configure transporter: prefer real SMTP from env, otherwise fall back to Ethereal (dev)
    let transporter: any = null;
    let previewUrl: string | null = null;
    if (process.env.SENDGRID_API_KEY) {
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Creates a test account and transporter per-request (acceptable for dev/demo)
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const itemsHtml = (items as any[])
      .map((it) => `<li>${it.name} x ${it.quantity} — $${(Number(it.price) * Number(it.quantity)).toFixed(2)}</li>`)
      .join('');

    if (process.env.SENDGRID_API_KEY) {
      // Use SendGrid API
      const msg = {
        to: shipping.email,
        from: process.env.SENDGRID_FROM || 'no-reply@example.com',
        subject: `Order confirmation — ${id}`,
        html: `
          <p>Hi ${shipping.name || ''},</p>
          <p>Thanks for your order. Your order id is <strong>${id}</strong>.</p>
          <p>Order summary:</p>
          <ul>${itemsHtml}</ul>
          <p>Total: <strong>$${Number(total).toFixed(2)}</strong></p>
          <p>We will process and ship your order to:</p>
          <p>${shipping.address}, ${shipping.city}, ${shipping.postal}</p>
        `,
      };
      try {
        await sendgrid.send(msg as any);
        console.log('SendGrid: email sent to', shipping.email);
      } catch (e) {
        console.error('SendGrid error', e);
      }
      return NextResponse.json({ id, status: 'created', payment, total, emailPreview: null });
    } else {
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@example.com',
        to: shipping.email,
        subject: `Order confirmation — ${id}`,
        html: `
          <p>Hi ${shipping.name || ''},</p>
          <p>Thanks for your order. Your order id is <strong>${id}</strong>.</p>
          <p>Order summary:</p>
          <ul>${itemsHtml}</ul>
          <p>Total: <strong>$${Number(total).toFixed(2)}</strong></p>
          <p>We will process and ship your order to:</p>
          <p>${shipping.address}, ${shipping.city}, ${shipping.postal}</p>
        `,
      });
      // If using Ethereal, generate a preview URL
      try {
        previewUrl = nodemailer.getTestMessageUrl(info) || null;
      } catch {}
      console.log('Sent order email', previewUrl);

      // Persisting would go here (DB). For demo we return order summary and preview URL (if available).
      return NextResponse.json({ id, status: 'created', payment, total, emailPreview: previewUrl });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

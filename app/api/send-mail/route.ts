import { Resend } from 'resend';

const resend = new Resend('re_bfwctNPq_DvpyetNiQ9Kyqz39BMEyePov');

export async function POST(req: Request, res: any) {
  try {
    // const details = await req.json();

    await resend.emails.send({
      from: 'Your Shop <onboarding@resend.dev>',
      to: 'umamageswari105@gmail.com',
      subject: 'Your Order Confirmation',
      html: `
        <h2>Thank you for your order Uma!</h2>
      `,
    });
    // console.log('mail sent');
  } catch (error) {
    console.error('Email send failed:', error);
  }
}

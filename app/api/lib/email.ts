import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY); // Make sure this is defined in .env

export async function sendPaymentConfirmationEmail(to: string, customerName: string, amount: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Your Store <onboarding@resend.dev>', // use valid verified or test email
      to: 'shabbohussain21@gmail.com',
      subject: 'Payment Successful!',
      html: `<p>Hi ${customerName},</p><p>Your payment of <strong>${amount}</strong> was successful.</p>`,
    });

    if (error) {
      console.error('❌ Resend email error:', error);
    } else {
      console.log('✅ Email sent:', data);
    }

    return data;
  } catch (err) {
    console.error('❌ Error sending email:', err);
  }
}

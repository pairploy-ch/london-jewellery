import { Resend } from "resend";

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

type ConfirmationParams = {
  to: string;
  name: string;
  orderRef: string;
};

/* ---------------------------------------------------------------------------
   Customer payment / submission confirmation email.
--------------------------------------------------------------------------- */
function confirmationTemplate({ name, orderRef }: ConfirmationParams) {
  const subject = `Thank you for your payment - Assessment In Progress [Order #${orderRef}]`;

  const text = `Dear ${name || "Client"},

Thank you for your payment and for choosing London Jewellery Consult.
We have successfully received your submission.

What happens next?

- Review Process: Our specialist will review the images and details you provided and get back to you with the results within 48 hours.

- Please Note: This online visual consultation provides an expert opinion based on the images provided.

We appreciate your business and look forward to delivering your assessment shortly.

Best regards,

The London Jewellery Consult Team
Online Jewellery Authentication & Consultancy`;

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#f4eee5;font-family:Georgia,'Times New Roman',serif;color:#17120d;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4eee5;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #d9cdb9;">
          <tr><td style="background:#17120d;padding:24px 32px;">
            <span style="color:#c4a877;font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;">London Jewellery Consult</span>
          </td></tr>
          <tr><td style="padding:32px;">
            <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a7f70;">Order #${orderRef}</p>
            <h1 style="margin:0 0 20px;font-size:24px;font-weight:normal;color:#17120d;">Assessment in progress</h1>

            <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#2a221a;">Dear ${name || "Client"},</p>
            <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#2a221a;">
              Thank you for your payment and for choosing London Jewellery Consult.
              We have successfully received your submission.
            </p>

            <h2 style="margin:24px 0 12px;font-size:18px;font-weight:normal;color:#17120d;">What happens next?</h2>
            <p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#2a221a;">
              <strong>Review Process:</strong> Our specialist will review the images and details you provided and get back to you with the results within <strong>48 hours</strong>.
            </p>
            <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#2a221a;">
              <strong>Please Note:</strong> This online visual consultation provides an expert opinion based on the images provided.
            </p>

            <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#2a221a;">
              We appreciate your business and look forward to delivering your assessment shortly.
            </p>

            <p style="margin:0;font-size:16px;line-height:1.6;color:#2a221a;">Best regards,</p>
            <p style="margin:4px 0 0;font-size:16px;line-height:1.5;color:#17120d;">The London Jewellery Consult Team</p>
            <p style="margin:2px 0 0;font-size:14px;line-height:1.5;color:#8a7f70;">Online Jewellery Authentication &amp; Consultancy</p>
          </td></tr>
          <tr><td style="border-top:1px solid #d9cdb9;padding:16px 32px;">
            <span style="color:#8a7f70;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;">contact@londonjewelleryconsult.com · London, UK</span>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}

/** Sends the customer confirmation email. Best-effort: returns false on
    failure (or when Resend isn't configured) without throwing. */
export async function sendConfirmationEmail(
  params: ConfirmationParams,
): Promise<boolean> {
  if (!isResendConfigured()) return false;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { subject, html, text } = confirmationTemplate(params);
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: params.to,
      subject,
      html,
      text,
    });
    if (error) {
      console.error("Resend send error", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("confirmation email failed", err);
    return false;
  }
}

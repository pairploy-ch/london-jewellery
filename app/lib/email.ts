import { Resend } from "resend";

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

type PaymentConfirmationParams = {
  to: string;
  referenceNumber: string;
};

// Sent from a dedicated no-reply address — this email intentionally does not
// accept replies; customers are pointed to contact@ instead in the copy below.
const PAYMENT_CONFIRMATION_FROM =
  "London Jewellery Consult <noreply@londonjewelleryconsult.com>";

/* ---------------------------------------------------------------------------
   Customer payment confirmation email — sent automatically the moment a
   payment succeeds. Same fixed copy for every client, only the reference
   number varies.
--------------------------------------------------------------------------- */
function paymentConfirmationTemplate(referenceNumber: string) {
  const subject = referenceNumber
    ? `Payment Received - Your Assessment Is Underway [${referenceNumber}]`
    : "Payment Received - Your Assessment Is Underway";

  const refLineText = referenceNumber
    ? `Your Assessment Reference Number is: ${referenceNumber}\n\n`
    : "";

  const text = `Dear Valued Client,

Thank you for choosing London Jewellery Consult.

${refLineText}We have successfully received your payment and assessment request. Our specialist will now review the information and photographs you have provided.

Your assessment is expected to be completed within 48 hours.

If we require any additional information during the assessment process, we will contact you directly.

This is an automated message — please do not reply to this email. For any questions, please contact us at contact@londonjewelleryconsult.com.

Thank you for choosing London Jewellery Consult.

Kind regards,

London Jewellery Consult`;

  const refLineHtml = referenceNumber
    ? `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#2a221a;">
              Your Assessment Reference Number is: ${referenceNumber}
            </p>`
    : "";

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
            <h1 style="margin:0 0 20px;font-size:24px;font-weight:normal;color:#17120d;">Payment received</h1>

            <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#2a221a;">Dear Valued Client,</p>
            <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#2a221a;">
              Thank you for choosing London Jewellery Consult.
            </p>
            ${refLineHtml}
            <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#2a221a;">
              We have successfully received your payment and assessment request. Our specialist will now review the information and photographs you have provided.
            </p>
            <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#2a221a;">
              Your assessment is expected to be completed within 48 hours.
            </p>
            <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#2a221a;">
              If we require any additional information during the assessment process, we will contact you directly.
            </p>
            <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#2a221a;">
              This is an automated message — please do not reply to this email. For any questions, please contact us at <a href="mailto:contact@londonjewelleryconsult.com" style="color:#a4854f;">contact@londonjewelleryconsult.com</a>.
            </p>

            <p style="margin:0;font-size:16px;line-height:1.6;color:#2a221a;">Kind regards,</p>
            <p style="margin:4px 0 0;font-size:16px;line-height:1.5;color:#17120d;">London Jewellery Consult</p>
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

/** Sends the payment confirmation email. Best-effort: returns false on
    failure (or when Resend isn't configured) without throwing. */
export async function sendPaymentConfirmationEmail(
  params: PaymentConfirmationParams,
): Promise<boolean> {
  if (!isResendConfigured()) return false;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { subject, html, text } = paymentConfirmationTemplate(params.referenceNumber);
    const { error } = await resend.emails.send({
      from: PAYMENT_CONFIRMATION_FROM,
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
    console.error("payment confirmation email failed", err);
    return false;
  }
}

/* ---------------------------------------------------------------------------
   Assessment report delivery — sent by the admin once a submission has been
   reviewed, with the generated PDF report attached.
--------------------------------------------------------------------------- */
type ReportEmailParams = {
  to: string;
  name: string;
  orderRef: string;
  pdf: Buffer;
};

function reportTemplate({ name, orderRef }: Omit<ReportEmailParams, "pdf">) {
  const subject = `Your Assessment Report is Ready [Order #${orderRef}]`;

  const text = `Dear ${name || "Client"},

Thank you for your patience. Your independent jewellery assessment is complete.

Please find your Authentication Assessment Report attached to this email as a PDF.

If you have any questions about the report, simply reply to this email and we will be happy to help.

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
            <h1 style="margin:0 0 20px;font-size:24px;font-weight:normal;color:#17120d;">Your assessment report is ready</h1>

            <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#2a221a;">Dear ${name || "Client"},</p>
            <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#2a221a;">
              Thank you for your patience. Your independent jewellery assessment is complete —
              please find your <strong>Authentication Assessment Report</strong> attached to this
              email as a PDF.
            </p>
            <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#2a221a;">
              If you have any questions about the report, simply reply to this email and we will
              be happy to help.
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

/** Sends the finished assessment report (PDF attached) to the client.
    Best-effort: returns false on failure without throwing. */
export async function sendReportEmail(
  params: ReportEmailParams,
): Promise<boolean> {
  if (!isResendConfigured()) return false;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { subject, html, text } = reportTemplate(params);
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: params.to,
      replyTo: process.env.EMAIL_REPLY_TO || undefined,
      subject,
      html,
      text,
      attachments: [
        {
          filename: `Assessment-Report-${params.orderRef}.pdf`,
          content: params.pdf,
        },
      ],
    });
    if (error) {
      console.error("Resend report send error", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("report email failed", err);
    return false;
  }
}

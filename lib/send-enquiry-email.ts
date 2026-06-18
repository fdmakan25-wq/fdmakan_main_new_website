import { Resend } from 'resend';

export type EnquiryType = 'call_back' | 'site_visit' | 'presentation' | 'contact';

export interface EnquiryEmailPayload {
  type: EnquiryType;
  orderNumber: string;
  propertyName?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  visitDate?: string;
  rideType?: string;
  subject?: string;
  message?: string;
  notes?: string;
}

const TYPE_LABELS: Record<EnquiryType, string> = {
  call_back: 'Call Me Instantly',
  site_visit: 'Free Site Visit',
  presentation: 'Online Presentation',
  contact: 'Contact Form',
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHtml(payload: EnquiryEmailPayload): string {
  const label = TYPE_LABELS[payload.type];
  const rows: [string, string][] = [
    ['Enquiry Type', label],
    ['Reference', payload.orderNumber],
  ];

  if (payload.propertyName) rows.push(['Property', payload.propertyName]);
  if (payload.customerName) rows.push(['Name', payload.customerName]);
  if (payload.customerPhone) rows.push(['Phone', payload.customerPhone]);
  if (payload.customerEmail) rows.push(['Email', payload.customerEmail]);
  if (payload.visitDate) rows.push(['Preferred Date & Time', payload.visitDate]);
  if (payload.rideType) rows.push(['Pickup Service', payload.rideType]);
  if (payload.subject) rows.push(['Subject', payload.subject]);
  if (payload.message) rows.push(['Message', payload.message]);
  if (payload.notes) rows.push(['Notes', payload.notes]);

  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:10px 14px;border-bottom:1px solid #eee;font-weight:600;color:#1a365d;width:180px;">${escapeHtml(k)}</td><td style="padding:10px 14px;border-bottom:1px solid #eee;color:#374151;">${escapeHtml(v)}</td></tr>`
    )
    .join('');

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#1a365d,#2fb9a2);padding:24px;border-radius:12px 12px 0 0;">
        <h1 style="color:#fff;margin:0;font-size:20px;">New Enquiry — ${escapeHtml(label)}</h1>
        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:13px;">FD MAKAN Website</p>
      </div>
      <div style="background:#fff;padding:8px 0;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
        <table style="width:100%;border-collapse:collapse;">${tableRows}</table>
      </div>
    </div>
  `;
}

function buildText(payload: EnquiryEmailPayload): string {
  const label = TYPE_LABELS[payload.type];
  const lines = [
    `New Enquiry — ${label}`,
    `Reference: ${payload.orderNumber}`,
  ];

  if (payload.propertyName) lines.push(`Property: ${payload.propertyName}`);
  if (payload.customerName) lines.push(`Name: ${payload.customerName}`);
  if (payload.customerPhone) lines.push(`Phone: ${payload.customerPhone}`);
  if (payload.customerEmail) lines.push(`Email: ${payload.customerEmail}`);
  if (payload.visitDate) lines.push(`Preferred Date & Time: ${payload.visitDate}`);
  if (payload.rideType) lines.push(`Pickup Service: ${payload.rideType}`);
  if (payload.subject) lines.push(`Subject: ${payload.subject}`);
  if (payload.message) lines.push(`Message: ${payload.message}`);
  if (payload.notes) lines.push(`Notes: ${payload.notes}`);

  return lines.join('\n');
}

function getRecipientList(): string[] {
  const raw = process.env.ENQUIRY_TO_EMAIL || 'sales@fdmakan.com';
  return raw.split(',').map((email) => email.trim()).filter(Boolean);
}

function getFromAddresses(): string[] {
  const primary = process.env.RESEND_FROM_EMAIL;
  const fallback = process.env.RESEND_FALLBACK_FROM_EMAIL || 'FD MAKAN <onboarding@resend.dev>';

  const addresses = [primary, fallback].filter((value): value is string => Boolean(value?.trim()));
  return [...new Set(addresses)];
}

export async function sendEnquiryEmail(payload: EnquiryEmailPayload): Promise<{ sent: boolean; error?: string; messageId?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = getRecipientList();
  const fromAddresses = getFromAddresses();

  if (!apiKey) {
    return { sent: false, error: 'RESEND_API_KEY is not configured in .env' };
  }

  if (to.length === 0) {
    return { sent: false, error: 'ENQUIRY_TO_EMAIL is not configured in .env' };
  }

  if (fromAddresses.length === 0) {
    return { sent: false, error: 'RESEND_FROM_EMAIL is not configured in .env' };
  }

  const resend = new Resend(apiKey);
  const label = TYPE_LABELS[payload.type];
  const subject = `[FD MAKAN] ${label} — ${payload.orderNumber}`;
  const html = buildHtml(payload);
  const text = buildText(payload);
  const replyTo = payload.customerEmail?.trim() || undefined;

  let lastError = 'Failed to send email';

  for (const from of fromAddresses) {
    try {
      const { data, error } = await resend.emails.send({
        from,
        to,
        subject,
        html,
        text,
        replyTo,
      });

      if (error) {
        lastError = error.message || JSON.stringify(error);
        console.error(`Resend error (from: ${from}):`, error);
        continue;
      }

      return { sent: true, messageId: data?.id };
    } catch (error: unknown) {
      lastError = error instanceof Error ? error.message : 'Failed to send email';
      console.error(`Resend exception (from: ${from}):`, error);
    }
  }

  return { sent: false, error: lastError };
}

import { AdminOrderDetail } from "../types/orderTypes";

const colors = {
  primaryDark: '#0D3E26',
  primary: '#1C5D3B',
  primaryPale: '#EAF4EE',
  bgMain: '#FAFAF7',
  textMain: '#222B26',
  textMuted: '#606F66',
  border: '#D1DFD7',
};

const fonts = {
  heading: "'Cormorant Garamond', Georgia, serif",
  body: "'Plus Jakarta Sans', Arial, sans-serif",
};

const htmlEscapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => htmlEscapes[char]);

const cell = `padding: 10px 12px; border-bottom: 1px solid ${colors.border}; text-align: left; font-size: 14px; color: ${colors.textMain};`;
const cellRight = `${cell} text-align: right;`;
const headCell = `padding: 10px 12px; border-bottom: 2px solid ${colors.primary}; text-align: left; font-size: 12px; color: ${colors.textMuted}; text-transform: uppercase;`;

export const orderConfirmation = (order: AdminOrderDetail) => {
  const total = order.totalAmount + order.shippingPrice;
  const shippingText = order.shippingPrice === 0 ? 'Fri frakt' : `${order.shippingPrice} kr`;
  const subject = `Orderbekräftelse #${order.orderId}`;

  const rows = order.products.map(p => `
    <tr>
      <td style="${cell}">${escapeHtml(p.productName)}</td>
      <td style="${cell}">${p.quantity} st</td>
      <td style="${cell}">${p.price} kr/st</td>
    </tr>`).join('');

  const shippingRow = order.shippingMethod
    ? `
    <tr>
      <td style="${cell}" colspan="2">Frakt</td>
      <td style="${cellRight}">${shippingText}</td>
    </tr>`
    : '';

  const html = `
    <div style="background-color: ${colors.bgMain}; padding: 24px 12px; font-family: ${fonts.body}; color: ${colors.textMain};">
      <table role="presentation" style="max-width: 600px; width: 100%; margin: 0 auto; border-collapse: collapse; background-color: #ffffff; border: 1px solid ${colors.border}; border-radius: 8px;">
        <tr>
          <td style="background-color: ${colors.primary}; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-family: ${fonts.heading}; font-size: 32px; color: ${colors.bgMain};">Tea Garden</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px;">
            <h2 style="margin: 0 0 8px 0; font-family: ${fonts.heading}; font-size: 28px; color: ${colors.primaryDark};">
              Tack för din beställning, ${escapeHtml(order.customerName)}!
            </h2>
            <p style="margin: 0 0 24px 0; font-size: 14px; color: ${colors.textMuted};">Beställning #${order.orderId}</p>

            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="${headCell}">Produkt</th>
                  <th style="${headCell}">Antal</th>
                  <th style="${headCell} text-align: right;">Pris</th>
                </tr>
              </thead>
              <tbody>
                ${rows}${shippingRow}
                <tr>
                  <td style="padding: 14px 12px; background-color: ${colors.primaryPale}; font-size: 16px; font-weight: bold; color: ${colors.primaryDark};" colspan="2">Totalt</td>
                  <td style="padding: 14px 12px; background-color: ${colors.primaryPale}; font-size: 16px; font-weight: bold; color: ${colors.primaryDark}; text-align: right;">${total} kr</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </table>
    </div>`;
    
    const productLines = order.products.map(
    p => `${p.productName} - ${p.quantity} st x ${p.price} kr`
  );

  const text = [
    `Tack för din beställning, ${order.customerName}!`,
    `Beställning #${order.orderId}`,
    '',
    ...productLines,
    order.shippingMethod ? `Frakt: ${shippingText}` : null,
    '',
    `Totalt: ${total} kr`,
  ]
    .filter((line): line is string => line !== null)
    .join('\n');
  
  return { subject, html, text };
};
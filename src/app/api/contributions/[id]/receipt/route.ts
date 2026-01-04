import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Contribution, SiteSettings } from '@/lib/db';
import { withAuth, errorResponse, notFoundResponse } from '@/lib/api-utils';
import type { TokenPayload } from '@/lib/auth';

// Generate PDF receipt
async function getHandler(
  request: NextRequest,
  auth: TokenPayload,
  params?: unknown
): Promise<NextResponse> {
  try {
    await connectDB();
    
    const { id } = params as { id: string };

    const contribution = await Contribution.findById(id);
    if (!contribution) {
      return notFoundResponse('Contribution');
    }

    const settings = await SiteSettings.findOne();

    // Generate HTML for the receipt
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Contribution Receipt - ${contribution.receiptNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 20px; }
    .receipt { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { text-align: center; border-bottom: 2px solid #0d6e3f; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #0d6e3f; font-size: 24px; margin-bottom: 5px; }
    .header p { color: #666; font-size: 14px; }
    .receipt-number { background: #f0fdf4; padding: 10px 20px; border-radius: 6px; text-align: center; margin-bottom: 30px; }
    .receipt-number span { color: #0d6e3f; font-weight: bold; font-size: 18px; }
    .details { margin-bottom: 30px; }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #666; font-weight: 500; }
    .detail-value { color: #333; font-weight: 600; }
    .amount { background: linear-gradient(135deg, #0d6e3f, #10b981); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
    .amount .label { font-size: 14px; opacity: 0.9; }
    .amount .value { font-size: 32px; font-weight: bold; margin-top: 5px; }
    .footer { text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-verified { background: #dcfce7; color: #166534; }
    .status-pending { background: #fef3c7; color: #92400e; }
    .status-rejected { background: #fee2e2; color: #991b1b; }
    @media print {
      body { background: white; padding: 0; }
      .receipt { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>${settings?.siteName || 'Amanat-E-Nazirpara'}</h1>
      <p>${settings?.tagline || 'Building our sacred space together'}</p>
      ${settings?.address ? `<p style="margin-top: 5px;">${settings.address}</p>` : ''}
    </div>
    
    <div class="receipt-number">
      <span>Receipt #${contribution.receiptNumber}</span>
    </div>
    
    <div class="amount">
      <div class="label">Contribution Amount</div>
      <div class="value">৳${contribution.amount.toLocaleString('en-BD')}</div>
    </div>
    
    <div class="details">
      <div class="detail-row">
        <span class="detail-label">Contributor Name</span>
        <span class="detail-value">${contribution.anonymous ? 'Anonymous' : contribution.contributorName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Contribution Type</span>
        <span class="detail-value">${contribution.type}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Date</span>
        <span class="detail-value">${new Date(contribution.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>
      ${contribution.purpose ? `
      <div class="detail-row">
        <span class="detail-label">Purpose</span>
        <span class="detail-value">${contribution.purpose}</span>
      </div>
      ` : ''}
      <div class="detail-row">
        <span class="detail-label">Status</span>
        <span class="detail-value">
          <span class="status status-${contribution.status}">${contribution.status}</span>
        </span>
      </div>
    </div>
    
    <div class="footer">
      <p>Thank you for your generous contribution to our community.</p>
      <p style="margin-top: 10px;">Generated on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      ${settings?.phone ? `<p style="margin-top: 5px;">Contact: ${settings.phone}</p>` : ''}
    </div>
  </div>
  
  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Generate receipt error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getHandler, 'manage_contributions');

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { SiteSettings } from '@/lib/db/models';
import { connectDB } from '@/lib/db/connection';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  contributionType: string;
  amount?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.contributionType) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and contribution type are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get settings for recipient email
    const settings = await SiteSettings.findOne().lean();
    const recipientEmail = settings?.email;

    if (!recipientEmail) {
      return NextResponse.json(
        { success: false, error: 'Contact email is not configured' },
        { status: 500 }
      );
    }

    // Check for SMTP configuration
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error('SMTP configuration is missing');
      // Log the contact form data for manual processing
      console.log('Contact form submission (SMTP not configured):', body);
      return NextResponse.json(
        { success: false, error: 'Email service is not configured. Please contact us directly.' },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Build email content
    const siteName = settings?.siteName || 'Amanat-E-Nazirpara';
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #0d5e4c 0%, #1e7e6c 100%); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">${siteName}</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0;">New Contribution Interest</p>
        </div>
        
        <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #0d5e4c; margin-top: 0;">Contact Details</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; width: 140px;">Name:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 500;">${body.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Email:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${body.email}</td>
            </tr>
            ${body.phone ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Phone:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${body.phone}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Contribution Type:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">
                  ${body.contributionType}
                </span>
              </td>
            </tr>
            ${body.amount ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Amount:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600;">৳${body.amount}</td>
            </tr>
            ` : ''}
          </table>
          
          ${body.message ? `
          <div style="margin-top: 20px;">
            <h3 style="color: #0d5e4c; margin-bottom: 8px;">Message:</h3>
            <div style="background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #0d5e4c;">
              <p style="margin: 0; color: #374151; line-height: 1.6;">${body.message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
          ` : ''}
          
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            This message was sent from the contact form on ${siteName} website.
          </p>
        </div>
      </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: `"${siteName}" <${smtpFrom}>`,
      to: recipientEmail,
      replyTo: body.email,
      subject: `New Contribution Interest from ${body.name}`,
      html: emailHtml,
      text: `
New Contact Form Submission

Name: ${body.name}
Email: ${body.email}
${body.phone ? `Phone: ${body.phone}` : ''}
Contribution Type: ${body.contributionType}
${body.amount ? `Amount: ৳${body.amount}` : ''}

${body.message ? `Message:\n${body.message}` : ''}
      `.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}

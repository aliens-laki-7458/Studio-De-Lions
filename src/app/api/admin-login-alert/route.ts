import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// .env.local එකේ ඇති API Key එක Auto-read කරයි
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { username, time } = await request.json();

    await resend.emails.send({
      from: 'Aliens Studio <onboarding@resend.dev>', // Resend Free Domain
      to: ['aliensstudio.official7458@gmail.com'], // 👈 ඔයාට Alert එක එන්න ඕන Email එක
      subject: '⚠️ Admin Panel Login Alert - Aliens Studio',
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #0b0b0e; color: #f3f4f6; border-radius: 8px;">
          <h2 style="color: #d97706;">Admin Panel Login Notification</h2>
          <p>Someone has successfully logged into the <strong>Aliens Studio Admin Panel</strong>.</p>
          <hr style="border-color: #262630;" />
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>Time:</strong> ${time}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email alert error:', error);
    return NextResponse.json({ error: 'Failed to send alert' }, { status: 500 });
  }
}
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { name, email, service, budget, message } = await req.json()

  const serviceLabels: Record<string, string> = {
    media: 'Media Production',
    web: 'Web Design',
    strategy: 'Digital Strategy',
    retainer: 'Monthly Retainer',
    other: 'Other',
  }

  const budgetLabels: Record<string, string> = {
    'under-5k': 'Under $5K',
    '5k-10k': '$5K – $10K',
    '10k-25k': '$10K – $25K',
    '25k-plus': '$25K+',
    'not-sure': 'Not Sure Yet',
  }

  try {
    await resend.emails.send({
      from: 'UNRVLD Inquiries <onboarding@resend.dev>',
      to: ['unrvldllc@gmail.com'],
      replyTo: email,
      subject: `New Inquiry from ${name} — ${serviceLabels[service] ?? service}`,
      text: `
New inquiry from unrvldgroup.com

Name: ${name}
Email: ${email}
Service: ${serviceLabels[service] ?? service}
Budget: ${budget ? budgetLabels[budget] ?? budget : 'Not provided'}

Message:
${message}
      `.trim(),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

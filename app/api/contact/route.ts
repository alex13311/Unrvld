import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
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

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'unrvldllc@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  const body = `
New inquiry from unrvldgroup.com

Name: ${name}
Email: ${email}
Service: ${serviceLabels[service] ?? service}
Budget: ${budget ? budgetLabels[budget] ?? budget : 'Not provided'}

Message:
${message}
  `.trim()

  try {
    await transporter.sendMail({
      from: 'UNRVLD Site <unrvldllc@gmail.com>',
      to: 'unrvldllc@gmail.com',
      replyTo: email,
      subject: `New Inquiry — ${name} (${serviceLabels[service] ?? service})`,
      text: body,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Email error:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

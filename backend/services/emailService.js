import Mailgun from 'mailgun.js'
import formData from 'form-data'

// Use Mailgun HTTP API (no SMTP) — works on Railway where SMTP is blocked.
const mailgun = new Mailgun(formData)
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY })

export const sendEmail = async (to, subject, text, html) => {
    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
        const err = new Error('Missing MAILGUN_API_KEY or MAILGUN_DOMAIN environment variables')
        console.error(err)
        throw err
    }

    const from = `ToDoodle <no-reply-auth@${process.env.MAILGUN_DOMAIN}>`

    const message = {
        from,
        to: Array.isArray(to) ? to.join(',') : to,
        subject,
        text,
        html
    }

    try {
        const result = await mg.messages.create(process.env.MAILGUN_DOMAIN, message)
        console.log('Email sent via Mailgun:', result.id || result)
        return result
    } catch (error) {
        console.error('Error sending email via Mailgun:', error)
        throw error
    }
}

export default { sendEmail }
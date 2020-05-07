const nodemailer = require('nodemailer')

const sendMail = async (experience, moreDetails) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587,
    tls: {
      ciphers:'SSLv3'
    },
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASS
    }
  })

  await transporter.sendMail({
    from: `SPL Feedback <${process.env.EMAIL_AUTH_USER}>`,
    to: process.env.EMAIL_RECIPIENT,
    subject: 'SPL Eligibility Tool Feedback',
    text:
      `
      What was your experience of the service:
      ${experience}

      How could we improve this service:
      ${moreDetails}
      `
  }, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

module.exports = sendMail

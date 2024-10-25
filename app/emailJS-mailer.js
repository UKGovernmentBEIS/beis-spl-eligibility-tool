const emailjs = require('@emailjs/nodejs')
const logger = require('./logger')

const sendMail = async (experience, moreDetails, emailjsIds, options) => {
  const templateParams = {
    experience: experience,
    moreDetails: moreDetails,
  }
  try {
    await emailjs.send(
      emailjsIds.serviceID,
      emailjsIds.templateID,
      templateParams,
      options
    )
      .then((response) => {
        logger.info({
          message: `Email sent successfully! ${response.status} ${response.text}`,
          eventType: 'MailEvent',
          eventResult: 'Success'
        })
      })
      .catch((err) => {
        logger.error({
          message: `Failed to send email. Error: ${err.text}`,
          eventType: 'MailEvent',
          eventResult: 'Failure',
          errorDetails: err.text
        })
      })
  } catch(err){
    logger.error({
      message: `Error sending feedback email: ${err.text}`,
      eventType: 'MailEvent',
      eventResult: 'Failure',
      errorDetails: err.text
    })
  }
}

module.exports = sendMail

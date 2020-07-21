module.exports = mailOptions => {
  const { email, subject, html } = mailOptions
  const nodemailer = require('nodemailer')
  const emailConfig = require('../config/emailConfig')
  const transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      'user': emailConfig.user,
      'pass': emailConfig.pass 
    }
  })
  return new Promise((resolve, reject) => {
    transporter.sendMail({
      from: '"React博客" <' + emailConfig.user + '>',
      to: email,
      subject: subject,
      html: html
    }).then(info => {
      console.log('info', info)
      resolve(info)
    }).catch(err => {
      console.log('sendMail()err', err)
      reject(err)
    })
  })
}
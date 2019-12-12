import configMail from '../config/mail'
import nodemailer from 'nodemailer';

class Mail {
  constructor() {
    const { host, port, secure, auth } = configMail;
    this.transporter = nodemailer.createTransport(
      {
        host,
        port,
        secure,
        auth: auth.user ? auth : null,
      }
    )
  }
  sendMail(message) {
    return this.transporter.sendMail({
      ...configMail.default,
      ...message,
    })
  }
}

export default new Mail();
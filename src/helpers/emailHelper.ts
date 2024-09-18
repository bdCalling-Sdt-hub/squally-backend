import nodemailer from 'nodemailer';
import config from '../config';
import { errorLogger, logger } from '../shared/logger';
import { ISendEmail, ISendLink } from '../types/email';
import ejs from 'ejs';
import path from 'path';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: Number(config.email.port),
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

const sendEmail = async (values: ISendEmail) => {
  try {
    const info = await transporter.sendMail({
      from: `"Zinkly" ${config.email.from}`,
      to: values.to,
      subject: values.subject,
      html: values.html,
    });

    logger.info('Mail send successfully', info.accepted);
  } catch (error) {
    errorLogger.error('Email', error);
  }
};

const sendLink = async (values: ISendLink) => {
  const templatePath = path.join(__dirname, '../ejs/sessionConfirmation.ejs');
  const html = await ejs.renderFile(templatePath, {
    userName: values?.userName,
    artistName: values?.artistName,
    bookingDate: values?.bookingDate,
    bookingTime: values?.bookingTime,
    bookingLink: values?.bookingLink
  });

  try {
    const info:any = await transporter.sendMail({
      from: `"Zinkly" ${config.email.from}`,
      to: values.to,
      subject: "Session Link",
      html: html,
    });

    logger.info('Mail send successfully', info.accepted);
  } catch (error) {
    errorLogger.error('Email', error);
  }
};

export const emailHelper = {
  sendEmail,
  sendLink
};

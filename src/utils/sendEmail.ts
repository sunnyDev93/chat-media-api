import nodemailer from 'nodemailer'

export const sendEmail = async (email: string, subject: any, text: any) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 3000,
      secure: true,
      auth: {
        user: 'process.env.USER',
        pass: 'process.env.PASS',
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};
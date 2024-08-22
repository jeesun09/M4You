import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import nodemailer from "nodemailer";
import { render } from "@react-email/components";


const outlook_email = process.env.OUTLOOK_EMAIL;
const outlook_password = process.env.OUTLOOK_PASSWORD;

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: outlook_email || process.env.OUTLOOK_EMAIL,
    pass: outlook_password || process.env.OUTLOOK_PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const emailHtml = render(VerificationEmail({ username, otp: verifyCode }));
    await transporter.sendMail({
      from: outlook_email || process.env.OUTLOOK_EMAIL,
      to: email,
      subject: "M4You | Verification Code",
      html: emailHtml,
    });

    return {
      success: true,
      message: "Verification email sent",
    };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return {
      success: false,
      message: "Error sending verification email",
    };
  }
}

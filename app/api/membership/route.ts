import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type MembershipPayload = {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  message?: string;
};

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP configuration is missing.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MembershipPayload;

    const name = body.name?.trim();
    const phone = body.phone?.trim();
    const email = body.email?.trim();
    const city = body.city?.trim() || "Not provided";
    const message = body.message?.trim() || "No message provided";

    if (!name || !phone || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, phone and email are required.",
        },
        { status: 400 }
      );
    }

    const emailTo = process.env.EMAIL_TO;

    if (!emailTo) {
      throw new Error("EMAIL_TO is not configured.");
    }

    const transporter = createTransporter();

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: emailTo,
      replyTo: email,

      subject: `New AIJR Membership Request — ${name}`,

      text: `
A new membership request has been submitted on the AIJR website.

Name: ${name}
Phone: ${phone}
Email: ${email}
City: ${city}

Message:
${message}

---
AIJR Website
Membership Form
      `.trim(),
    });

    return NextResponse.json({
      success: true,
      message: "Membership request received successfully.",
    });
  } catch (error) {
    console.error("Membership submission error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit your request right now.",
      },
      { status: 500 }
    );
  }
}
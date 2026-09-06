import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    const name = body.name?.trim();
    const email = body.email?.trim();
    const subject = body.subject?.trim();
    const message = body.message?.trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400 }
      );
    }

    await prisma.contactMessage.create({ data: { name, email, subject, message } });

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Contact submission error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to send your message right now.",
      },
      { status: 500 }
    );
  }
}

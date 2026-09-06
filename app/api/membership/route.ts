import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type MembershipPayload = {
  name?: string;
  fatherName?: string;
  phone?: string;
  email?: string;
  address?: string;
  Address?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MembershipPayload;

    const name = body.name?.trim();
    const fatherName = body.fatherName?.trim();
    const phone = body.phone?.trim();
    const email = body.email?.trim();
    const address = body.address?.trim() || body.Address?.trim() || null;
    const message = body.message?.trim() || null;

    if (!name || !fatherName || !phone || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, father's name, phone and email are required.",
        },
        { status: 400 }
      );
    }

    await prisma.membershipApplication.create({
      data: { fullName: name, fatherName, phone, email, address, message },
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

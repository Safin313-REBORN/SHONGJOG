import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const caseRecord = await prisma.assistanceRequest.findUnique({
      where: { id },
      include: {
        supportNeeds: true,
        assignment: {
          include: {
            vehicle: { include: { vehicleDetails: true } },
            shelter: { include: { shelterDetails: true } },
            responder: { include: { responderDetails: true } },
          },
        },
        timelineEvents: {
          orderBy: { timestamp: "asc" },
        },
      },
    });

    if (!caseRecord) {
      return NextResponse.json(
        { success: false, error: "Case reference not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: caseRecord,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

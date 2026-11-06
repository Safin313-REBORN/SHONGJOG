import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findOptimalMatch } from "@/lib/matching/engine";
import { NeedType } from "@/lib/types";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await context.params;

    const reqRecord = await prisma.assistanceRequest.findUnique({
      where: { id: requestId },
      include: {
        supportNeeds: true,
      },
    });

    if (!reqRecord) {
      return NextResponse.json(
        { success: false, error: "Case not found for matching." },
        { status: 404 }
      );
    }

    const needs = reqRecord.supportNeeds.map((n) => n.needType as NeedType);

    const recommendation = await findOptimalMatch({
      requestId: reqRecord.id,
      groupSize: reqRecord.groupSize,
      latitude: reqRecord.latitude,
      longitude: reqRecord.longitude,
      supportNeeds: needs,
      urgency: reqRecord.urgency,
    });

    return NextResponse.json({
      success: true,
      case_id: reqRecord.id,
      recommendation,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

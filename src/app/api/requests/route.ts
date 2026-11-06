import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeEmergencyNeeds } from "@/lib/ai/adaptionClient";
import { NeedType } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const urgency = searchParams.get("urgency");

    const whereClause: Record<string, unknown> = {};
    if (status && status !== "all") whereClause.status = status;
    if (urgency && urgency !== "all") whereClause.urgency = urgency;

    const requests = await prisma.assistanceRequest.findMany({
      where: whereClause,
      include: {
        supportNeeds: true,
        assignment: {
          include: {
            vehicle: true,
            shelter: true,
            responder: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      rawDescription,
      approximateLocation,
      groupSize = 1,
      statedNeeds = [],
      contactName,
      contactPhone,
      consentGiven = true,
      latitude,
      longitude,
    } = body;

    if (!rawDescription || typeof rawDescription !== "string" || !rawDescription.trim()) {
      return NextResponse.json(
        { success: false, error: "Emergency description is required." },
        { status: 400 }
      );
    }

    if (!consentGiven) {
      return NextResponse.json(
        { success: false, error: "Consent to share assistance requirements with coordinators is required." },
        { status: 400 }
      );
    }

    // Run AI Needs Understanding
    const aiAnalysis = await analyzeEmergencyNeeds(rawDescription, statedNeeds as NeedType[]);

    // Determine final coordinates (use provided or Dacope center jitter)
    const lat = latitude ?? 22.571 + (Math.random() - 0.5) * 0.02;
    const lon = longitude ?? 89.512 + (Math.random() - 0.5) * 0.02;

    // Generate unique ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const requestId = `SHG-2026-${randomSuffix}`;

    // Combine all unique support needs
    const allNeeds = Array.from(new Set([...statedNeeds, ...aiAnalysis.support_needs]));

    // Transactionally create request, needs, and timeline events
    const newRequest = await prisma.$transaction(async (tx) => {
      const created = await tx.assistanceRequest.create({
        data: {
          id: requestId,
          status: "pending_review",
          urgency: aiAnalysis.urgency,
          language: aiAnalysis.language,
          groupSize: Math.max(groupSize, aiAnalysis.group_size),
          rawDescription: rawDescription.trim(),
          approximateLocation: approximateLocation || aiAnalysis.location || "Location pending confirmation",
          latitude: lat,
          longitude: lon,
          contactName: contactName || "Anonymous Resident",
          contactPhone: contactPhone || null,
          consentGiven: Boolean(consentGiven),
          aiExtractionJson: JSON.stringify(aiAnalysis),
          supportNeeds: {
            create: allNeeds.map((need) => ({
              needType: need,
              priority: "mandatory",
            })),
          },
        },
        include: {
          supportNeeds: true,
        },
      });

      // Citizen Intake Event
      await tx.caseTimeline.create({
        data: {
          requestId: created.id,
          eventType: "created",
          actorRole: "citizen",
          actorName: contactName || "Citizen User",
          detailsJson: JSON.stringify({
            channel: "web_pwa",
            groupSize: created.groupSize,
            language: created.language,
          }),
        },
      });

      // AI Analysis Event
      await tx.caseTimeline.create({
        data: {
          requestId: created.id,
          eventType: "ai_analyzed",
          actorRole: "ai_engine",
          actorName: aiAnalysis.model_name,
          detailsJson: JSON.stringify(aiAnalysis),
        },
      });

      return created;
    });

    return NextResponse.json({
      success: true,
      case_reference: newRequest.id,
      data: newRequest,
      ai_analysis: aiAnalysis,
    });
  } catch (error) {
    console.error("Request intake error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

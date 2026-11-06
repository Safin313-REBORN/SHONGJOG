import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const activeAlert = await prisma.alertEvent.findFirst({
      where: { isActive: true },
      orderBy: { issuedAt: "desc" },
    });

    const isAdaptionConfigured = Boolean(process.env.ADAPTION_API_KEY?.trim());

    return NextResponse.json({
      status: "operational",
      version: "1.0.0",
      ai_mode: isAdaptionConfigured
        ? "Live Adaption AI (adaption-v1-multilingual)"
        : "Demo AI mode — simulated fallback",
      is_fallback_mode: !isAdaptionConfigured,
      active_alert: activeAlert,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: "degraded", error: (error as Error).message },
      { status: 500 }
    );
  }
}

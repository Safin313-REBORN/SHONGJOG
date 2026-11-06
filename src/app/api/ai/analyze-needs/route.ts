import { NextRequest, NextResponse } from "next/server";
import { analyzeEmergencyNeeds } from "@/lib/ai/adaptionClient";
import { NeedType } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, statedNeeds = [] } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { success: false, error: "Text payload is required." },
        { status: 400 }
      );
    }

    const analysis = await analyzeEmergencyNeeds(text, statedNeeds as NeedType[]);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

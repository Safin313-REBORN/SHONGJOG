import { NextResponse } from "next/server";
import { resetAndSeedDatabase } from "@/lib/seed/seed";

export async function POST() {
  try {
    await resetAndSeedDatabase();
    return NextResponse.json({
      success: true,
      message: "Simulation dataset successfully reset to baseline.",
      scenario: "Simulated Coastal Flood Response — Dacope, Khulna",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

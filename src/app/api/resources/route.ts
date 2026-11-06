import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const verification = searchParams.get("verification");

    const whereClause: Record<string, unknown> = { isActive: true };
    if (type && type !== "all") whereClause.resourceType = type;
    if (verification && verification !== "all") whereClause.verificationStatus = verification;

    const resources = await prisma.resource.findMany({
      where: whereClause,
      include: {
        vehicleDetails: true,
        shelterDetails: true,
        responderDetails: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

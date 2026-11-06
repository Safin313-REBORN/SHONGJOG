import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { verificationStatus, totalCapacity, notes, isActive } = body;

    const dataToUpdate: Record<string, unknown> = {};
    if (verificationStatus !== undefined) {
      dataToUpdate.verificationStatus = verificationStatus;
      dataToUpdate.lastVerifiedAt = new Date();
    }
    if (totalCapacity !== undefined) dataToUpdate.totalCapacity = totalCapacity;
    if (notes !== undefined) dataToUpdate.notes = notes;
    if (isActive !== undefined) dataToUpdate.isActive = isActive;

    const updated = await prisma.resource.update({
      where: { id },
      data: dataToUpdate,
      include: {
        vehicleDetails: true,
        shelterDetails: true,
        responderDetails: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

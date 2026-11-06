import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId, vehicleId, shelterId, responderId, coordinatorName = "Coordinator Duty Desk" } = body;

    if (!requestId) {
      return NextResponse.json({ success: false, error: "Request ID is required." }, { status: 400 });
    }

    const caseReq = await prisma.assistanceRequest.findUnique({
      where: { id: requestId },
      include: { assignment: true },
    });

    if (!caseReq) {
      return NextResponse.json({ success: false, error: "Case not found." }, { status: 404 });
    }

    if (caseReq.assignment && ["assigned", "accepted", "in_progress"].includes(caseReq.assignment.status)) {
      return NextResponse.json(
        { success: false, error: "Case already has an active assignment in progress." },
        { status: 409 }
      );
    }

    // Atomic transaction for resource reservation and assignment creation
    const assignmentResult = await prisma.$transaction(async (tx) => {
      // 1. Validate & Reserve Vehicle
      if (vehicleId) {
        const vehicle = await tx.resource.findUnique({
          where: { id: vehicleId },
          include: {
            assignmentsAsVeh: {
              where: { status: { in: ["assigned", "accepted", "in_progress"] } },
            },
          },
        });

        if (!vehicle || !vehicle.isActive) {
          throw new Error(`Vehicle ${vehicleId} is not active or available.`);
        }

        if (vehicle.verificationStatus !== "verified" && vehicle.verificationStatus !== "partner_verified") {
          throw new Error(`Safety violation: Vehicle ${vehicle.name} is unverified and cannot be assigned.`);
        }

        if (vehicle.assignmentsAsVeh.length > 0) {
          throw new Error(`Vehicle ${vehicle.name} is already committed to an active assignment.`);
        }

        const availCap = vehicle.totalCapacity - vehicle.reservedCapacity - vehicle.currentOccupancy;
        if (availCap < caseReq.groupSize) {
          throw new Error(
            `Vehicle ${vehicle.name} capacity exceeded (Available: ${availCap}, Needed: ${caseReq.groupSize}).`
          );
        }

        await tx.resource.update({
          where: { id: vehicleId },
          data: { reservedCapacity: { increment: caseReq.groupSize } },
        });
      }

      // 2. Validate & Reserve Shelter
      if (shelterId) {
        const shelter = await tx.resource.findUnique({
          where: { id: shelterId },
        });

        if (!shelter || !shelter.isActive) {
          throw new Error(`Shelter ${shelterId} is not active.`);
        }

        if (shelter.verificationStatus !== "verified" && shelter.verificationStatus !== "partner_verified") {
          throw new Error(`Safety violation: Shelter ${shelter.name} is unverified and cannot be assigned.`);
        }

        const availCap = shelter.totalCapacity - shelter.reservedCapacity - shelter.currentOccupancy;
        if (availCap < caseReq.groupSize) {
          throw new Error(
            `Shelter ${shelter.name} capacity exceeded (Available: ${availCap}, Needed: ${caseReq.groupSize}).`
          );
        }

        await tx.resource.update({
          where: { id: shelterId },
          data: { reservedCapacity: { increment: caseReq.groupSize } },
        });
      }

      // 3. Validate Responder
      if (responderId) {
        const responder = await tx.resource.findUnique({
          where: { id: responderId },
          include: { responderDetails: true },
        });

        if (!responder || !responder.isActive) {
          throw new Error(`Responder ${responderId} is not active.`);
        }

        if (responder.verificationStatus !== "verified" && responder.verificationStatus !== "partner_verified") {
          throw new Error(`Safety violation: Responder team is unverified.`);
        }

        await tx.responderDetail.update({
          where: { resourceId: responderId },
          data: { currentStatus: "en_route" },
        });
      }

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const assignmentId = `ASG-2026-${randomSuffix}`;

      // Create Assignment record
      const createdAssignment = await tx.assignment.create({
        data: {
          id: assignmentId,
          requestId: caseReq.id,
          vehicleId: vehicleId || null,
          shelterId: shelterId || null,
          responderId: responderId || null,
          status: "assigned",
          assignedByCoordinator: coordinatorName,
        },
      });

      // Update Case Request Status
      await tx.assistanceRequest.update({
        where: { id: caseReq.id },
        data: { status: "assigned" },
      });

      // Log to Case Timeline
      await tx.caseTimeline.create({
        data: {
          requestId: caseReq.id,
          eventType: "assigned",
          actorRole: "coordinator",
          actorName: coordinatorName,
          detailsJson: JSON.stringify({
            assignmentId,
            vehicleId,
            shelterId,
            responderId,
            seatsReserved: caseReq.groupSize,
          }),
        },
      });

      return createdAssignment;
    });

    return NextResponse.json({
      success: true,
      data: assignmentResult,
    });
  } catch (error) {
    console.error("Assignment dispatch error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

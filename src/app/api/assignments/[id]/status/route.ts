import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { action, reason, responderName = "Field Responder" } = body;

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        request: true,
        vehicle: true,
        shelter: true,
        responder: true,
      },
    });

    if (!assignment) {
      return NextResponse.json({ success: false, error: "Assignment not found." }, { status: 404 });
    }

    const result = await prisma.$transaction(async (tx) => {
      let newAssignmentStatus = assignment.status;
      let newRequestStatus = assignment.request.status;
      let eventType = "status_changed";

      switch (action) {
        case "accept":
          newAssignmentStatus = "accepted";
          eventType = "accepted";
          await tx.assignment.update({
            where: { id },
            data: { status: newAssignmentStatus, acceptedAt: new Date() },
          });
          break;

        case "decline":
          newAssignmentStatus = "declined";
          newRequestStatus = "matching";
          eventType = "declined";

          // Release reserved capacities back
          if (assignment.vehicleId) {
            await tx.resource.update({
              where: { id: assignment.vehicleId },
              data: { reservedCapacity: { decrement: assignment.request.groupSize } },
            });
          }
          if (assignment.shelterId) {
            await tx.resource.update({
              where: { id: assignment.shelterId },
              data: { reservedCapacity: { decrement: assignment.request.groupSize } },
            });
          }
          if (assignment.responderId) {
            await tx.responderDetail.update({
              where: { resourceId: assignment.responderId },
              data: { currentStatus: "available" },
            });
          }

          await tx.assignment.update({
            where: { id },
            data: { status: newAssignmentStatus, declineReason: reason || "Unable to fulfill" },
          });
          await tx.assistanceRequest.update({
            where: { id: assignment.requestId },
            data: { status: newRequestStatus },
          });
          break;

        case "en_route":
          newAssignmentStatus = "in_progress";
          newRequestStatus = "en_route";
          eventType = "en_route";
          await tx.assignment.update({
            where: { id },
            data: { status: newAssignmentStatus },
          });
          await tx.assistanceRequest.update({
            where: { id: assignment.requestId },
            data: { status: newRequestStatus },
          });
          break;

        case "arrived":
          newAssignmentStatus = "arrived";
          newRequestStatus = "arrived";
          eventType = "arrived";
          await tx.assignment.update({
            where: { id },
            data: { status: newAssignmentStatus, arrivedAt: new Date() },
          });
          await tx.assistanceRequest.update({
            where: { id: assignment.requestId },
            data: { status: newRequestStatus },
          });
          break;

        case "complete":
          newAssignmentStatus = "completed";
          newRequestStatus = "completed";
          eventType = "completed";

          // Settle reservations: deduct reserved, increment shelter occupancy, release vehicle
          if (assignment.shelterId) {
            await tx.resource.update({
              where: { id: assignment.shelterId },
              data: {
                reservedCapacity: { decrement: assignment.request.groupSize },
                currentOccupancy: { increment: assignment.request.groupSize },
              },
            });
          }
          if (assignment.vehicleId) {
            await tx.resource.update({
              where: { id: assignment.vehicleId },
              data: {
                reservedCapacity: { decrement: assignment.request.groupSize },
              },
            });
          }
          if (assignment.responderId) {
            await tx.responderDetail.update({
              where: { resourceId: assignment.responderId },
              data: { currentStatus: "available" },
            });
          }

          await tx.assignment.update({
            where: { id },
            data: { status: newAssignmentStatus, completedAt: new Date() },
          });
          await tx.assistanceRequest.update({
            where: { id: assignment.requestId },
            data: { status: newRequestStatus },
          });
          break;

        case "unable_to_assist":
          newAssignmentStatus = "failed";
          newRequestStatus = "pending_review";
          eventType = "unable_to_assist";

          // Release reservations for escalation
          if (assignment.vehicleId) {
            await tx.resource.update({
              where: { id: assignment.vehicleId },
              data: { reservedCapacity: { decrement: assignment.request.groupSize } },
            });
          }
          if (assignment.shelterId) {
            await tx.resource.update({
              where: { id: assignment.shelterId },
              data: { reservedCapacity: { decrement: assignment.request.groupSize } },
            });
          }
          if (assignment.responderId) {
            await tx.responderDetail.update({
              where: { resourceId: assignment.responderId },
              data: { currentStatus: "available" },
            });
          }

          await tx.assignment.update({
            where: { id },
            data: { status: newAssignmentStatus, declineReason: reason || "Field obstacle prevented access" },
          });
          await tx.assistanceRequest.update({
            where: { id: assignment.requestId },
            data: { status: newRequestStatus },
          });
          break;

        default:
          throw new Error(`Unrecognized action: ${action}`);
      }

      // Add to audit timeline
      await tx.caseTimeline.create({
        data: {
          requestId: assignment.requestId,
          eventType,
          actorRole: "responder",
          actorName: responderName,
          detailsJson: JSON.stringify({
            action,
            reason: reason || null,
            assignmentStatus: newAssignmentStatus,
            requestStatus: newRequestStatus,
          }),
        },
      });

      return { assignmentStatus: newAssignmentStatus, requestStatus: newRequestStatus };
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Responder status update error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

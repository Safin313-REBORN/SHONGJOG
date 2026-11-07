import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_STATE_TRANSITIONS: Record<string, string[]> = {
  assigned: ["accept", "decline"],
  accepted: ["en_route", "decline", "unable_to_assist"],
  in_progress: ["arrived", "unable_to_assist"],
  arrived: ["complete", "unable_to_assist"],
  completed: [],
  declined: [],
  failed: ["accept", "decline"],
};

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { action, reason, responderName = "Field Responder", responderId } = body;

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

    // Authorization check: Verify responder identity if provided
    if (assignment.responderId && responderId && assignment.responderId !== responderId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Assignment is designated for a different responder unit." },
        { status: 403 }
      );
    }

    // Idempotency: If already in target status, return cleanly without duplicating decrements
    const isAlreadyAccepted = action === "accept" && assignment.status === "accepted";
    const isAlreadyEnRoute = action === "en_route" && assignment.status === "in_progress";
    const isAlreadyArrived = action === "arrived" && assignment.status === "arrived";
    const isAlreadyCompleted = action === "complete" && assignment.status === "completed";

    if (isAlreadyAccepted || isAlreadyEnRoute || isAlreadyArrived || isAlreadyCompleted) {
      return NextResponse.json({
        success: true,
        data: { assignmentStatus: assignment.status, requestStatus: assignment.request.status },
        idempotent: true,
      });
    }

    // State Machine Validation: Prevent illegal out-of-order transitions
    const allowedActions = VALID_STATE_TRANSITIONS[assignment.status] || [];
    if (!allowedActions.includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: `Illegal state transition: Cannot perform action '${action}' on assignment with current status '${assignment.status}'.`,
        },
        { status: 400 }
      );
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

          // Release reserved capacities back atomically
          if (assignment.vehicleId) {
            const v = await tx.resource.findUnique({
              where: { id: assignment.vehicleId },
              select: { reservedCapacity: true },
            });
            if (v) {
              await tx.resource.update({
                where: { id: assignment.vehicleId },
                data: { reservedCapacity: Math.max(0, v.reservedCapacity - assignment.request.groupSize) },
              });
            }
          }
          if (assignment.shelterId) {
            const s = await tx.resource.findUnique({
              where: { id: assignment.shelterId },
              select: { reservedCapacity: true },
            });
            if (s) {
              await tx.resource.update({
                where: { id: assignment.shelterId },
                data: { reservedCapacity: Math.max(0, s.reservedCapacity - assignment.request.groupSize) },
              });
            }
          }
          if (assignment.responderId) {
            await tx.responderDetail.updateMany({
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

          // Settle reservations atomically: deduct reserved, increment shelter occupancy, release vehicle
          if (assignment.shelterId) {
            const s = await tx.resource.findUnique({
              where: { id: assignment.shelterId },
              select: { reservedCapacity: true, currentOccupancy: true },
            });
            if (s) {
              await tx.resource.update({
                where: { id: assignment.shelterId },
                data: {
                  reservedCapacity: Math.max(0, s.reservedCapacity - assignment.request.groupSize),
                  currentOccupancy: s.currentOccupancy + assignment.request.groupSize,
                },
              });
            }
          }
          if (assignment.vehicleId) {
            const v = await tx.resource.findUnique({
              where: { id: assignment.vehicleId },
              select: { reservedCapacity: true },
            });
            if (v) {
              await tx.resource.update({
                where: { id: assignment.vehicleId },
                data: { reservedCapacity: Math.max(0, v.reservedCapacity - assignment.request.groupSize) },
              });
            }
          }
          if (assignment.responderId) {
            await tx.responderDetail.updateMany({
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

          // Release reservations for escalation atomically
          if (assignment.vehicleId) {
            const v = await tx.resource.findUnique({
              where: { id: assignment.vehicleId },
              select: { reservedCapacity: true },
            });
            if (v) {
              await tx.resource.update({
                where: { id: assignment.vehicleId },
                data: { reservedCapacity: Math.max(0, v.reservedCapacity - assignment.request.groupSize) },
              });
            }
          }
          if (assignment.shelterId) {
            const s = await tx.resource.findUnique({
              where: { id: assignment.shelterId },
              select: { reservedCapacity: true },
            });
            if (s) {
              await tx.resource.update({
                where: { id: assignment.shelterId },
                data: { reservedCapacity: Math.max(0, s.reservedCapacity - assignment.request.groupSize) },
              });
            }
          }
          if (assignment.responderId) {
            await tx.responderDetail.updateMany({
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
    }, { maxWait: 15000, timeout: 30000 });

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

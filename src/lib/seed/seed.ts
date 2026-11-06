import { prisma } from "../prisma";
import { SEED_ALERT_EVENT, SEED_RESOURCES, SEED_REQUESTS } from "./data";

export async function resetAndSeedDatabase() {
  console.log("Beginning SHONGJOG simulation database reset and seed...");

  // Clear existing records in proper relational order
  await prisma.caseTimeline.deleteMany({});
  await prisma.reservation.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.supportNeed.deleteMany({});
  await prisma.assistanceRequest.deleteMany({});
  await prisma.vehicleDetail.deleteMany({});
  await prisma.shelterDetail.deleteMany({});
  await prisma.responderDetail.deleteMany({});
  await prisma.resource.deleteMany({});
  await prisma.alertEvent.deleteMany({});

  // 1. Create Active Alert Event
  await prisma.alertEvent.create({
    data: SEED_ALERT_EVENT,
  });

  // 2. Seed Resources
  for (const res of SEED_RESOURCES) {
    const { vehicleDetails, shelterDetails, responderDetails, ...resourceData } = res;

    await prisma.resource.create({
      data: {
        ...resourceData,
        lastVerifiedAt: new Date(),
        vehicleDetails: vehicleDetails ? { create: vehicleDetails } : undefined,
        shelterDetails: shelterDetails ? { create: shelterDetails } : undefined,
        responderDetails: responderDetails ? { create: responderDetails } : undefined,
      },
    });
  }

  // 3. Seed Requests & Assignments
  for (const req of SEED_REQUESTS) {
    const { supportNeeds, assignment, ...requestData } = req;

    const createdReq = await prisma.assistanceRequest.create({
      data: {
        ...requestData,
        supportNeeds: {
          create: supportNeeds.map((need) => ({
            needType: need,
            priority: "mandatory",
          })),
        },
      },
    });

    // Create Initial Intake Timeline Event
    await prisma.caseTimeline.create({
      data: {
        requestId: createdReq.id,
        eventType: "created",
        actorRole: "citizen",
        actorName: createdReq.contactName || "Citizen User",
        detailsJson: JSON.stringify({
          channel: "web_pwa",
          language: createdReq.language,
          groupSize: createdReq.groupSize,
          location: createdReq.approximateLocation,
        }),
      },
    });

    // Create AI Analysis Timeline Event
    await prisma.caseTimeline.create({
      data: {
        requestId: createdReq.id,
        eventType: "ai_analyzed",
        actorRole: "ai_engine",
        actorName: "Adaption AI Engine",
        detailsJson: createdReq.aiExtractionJson,
      },
    });

    // If pre-assigned (e.g. Case 6 or Case 8)
    if (assignment) {
      await prisma.assignment.create({
        data: {
          id: assignment.id,
          requestId: createdReq.id,
          vehicleId: assignment.vehicleId,
          shelterId: assignment.shelterId,
          responderId: assignment.responderId,
          status: assignment.status,
          assignedByCoordinator: assignment.assignedByCoordinator,
          acceptedAt: assignment.status === "completed" ? new Date(Date.now() - 3600000) : new Date(),
          arrivedAt: assignment.status === "completed" ? new Date(Date.now() - 1800000) : undefined,
          completedAt: assignment.status === "completed" ? new Date() : undefined,
        },
      });

      await prisma.caseTimeline.create({
        data: {
          requestId: createdReq.id,
          eventType: "assigned",
          actorRole: "coordinator",
          actorName: assignment.assignedByCoordinator,
          detailsJson: JSON.stringify({
            vehicleId: assignment.vehicleId,
            shelterId: assignment.shelterId,
            responderId: assignment.responderId,
          }),
        },
      });

      if (assignment.status === "completed") {
        await prisma.caseTimeline.create({
          data: {
            requestId: createdReq.id,
            eventType: "completed",
            actorRole: "responder",
            actorName: "Volunteer Team",
            detailsJson: JSON.stringify({
              outcome: "Evacuation confirmed safe. All persons accounted for in shelter ward.",
            }),
          },
        });
      }
    }
  }

  console.log("SHONGJOG simulation database seeded successfully.");
}

// Allow CLI execution: tsx / node run
if (require.main === module) {
  resetAndSeedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seed error:", err);
      process.exit(1);
    });
}

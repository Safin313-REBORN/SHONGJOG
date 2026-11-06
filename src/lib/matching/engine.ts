import { prisma } from "../prisma";
import { NeedType, ResourceMatchRecommendation, VerificationStatus } from "../types";

/**
 * Calculates straight-line distance in kilometers using the Haversine formula.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export interface MatchInput {
  requestId: string;
  groupSize: number;
  latitude: number | null;
  longitude: number | null;
  supportNeeds: NeedType[];
  urgency: string;
}

export async function findOptimalMatch(input: MatchInput): Promise<ResourceMatchRecommendation> {
  const { groupSize, latitude, longitude, supportNeeds } = input;
  const refLat = latitude ?? 22.571; // Dacope Upazila center
  const refLon = longitude ?? 89.512;

  const requiresWheelchair = supportNeeds.includes("wheelchair_transport");
  const requiresStepFree = supportNeeds.includes("step_free_access") || requiresWheelchair;
  const requiresPower = supportNeeds.includes("power_equipment");
  const requiresSignLang = supportNeeds.includes("sign_language");
  const requiresGuide = supportNeeds.includes("guided_assistance");

  const satisfiedNeeds: NeedType[] = [];
  const unmetNeeds: NeedType[] = [...supportNeeds];
  const reasons: string[] = [];
  const warnings: string[] = [];
  const checklist: string[] = [];

  // 1. Fetch Candidate Vehicles
  const allVehicles = await prisma.resource.findMany({
    where: {
      resourceType: "vehicle",
      isActive: true,
    },
    include: {
      vehicleDetails: true,
      assignmentsAsVeh: {
        where: {
          status: { in: ["assigned", "accepted", "in_progress"] },
        },
      },
    },
  });

  // Filter & Rank Vehicles
  const compatibleVehicles = allVehicles
    .filter((veh) => {
      // Must not be currently assigned
      if (veh.assignmentsAsVeh.length > 0) return false;

      // Available passenger capacity
      const availableCap = veh.totalCapacity - veh.reservedCapacity - veh.currentOccupancy;
      if (availableCap < groupSize) return false;

      // HARD CONSTRAINT: Wheelchair accessibility
      if (requiresWheelchair) {
        if (!veh.vehicleDetails?.wheelchairAccessible || (veh.vehicleDetails?.wheelchairCapacity ?? 0) < 1) {
          return false;
        }
      }

      // HARD CONSTRAINT: Must be verified to be in safe pool
      if (veh.verificationStatus !== "verified" && veh.verificationStatus !== "partner_verified") {
        return false;
      }

      return true;
    })
    .map((veh) => {
      const distance = calculateDistanceKm(refLat, refLon, veh.latitude, veh.longitude);
      return {
        id: veh.id,
        name: veh.name,
        type: veh.vehicleDetails?.vehicleType || "transport",
        wheelchair_accessible: veh.vehicleDetails?.wheelchairAccessible ?? false,
        stretcher_capable: veh.vehicleDetails?.stretcherCapable ?? false,
        capacity: veh.totalCapacity,
        available_capacity: veh.totalCapacity - veh.reservedCapacity - veh.currentOccupancy,
        verification_status: veh.verificationStatus as VerificationStatus,
        distance_km: distance,
      };
    })
    .sort((a, b) => a.distance_km - b.distance_km);

  const bestVehicle = compatibleVehicles[0] || null;

  if (bestVehicle) {
    reasons.push(
      `Selected ${bestVehicle.name} (${bestVehicle.distance_km} km away, ${bestVehicle.available_capacity} seats available).`
    );
    if (requiresWheelchair && bestVehicle.wheelchair_accessible) {
      satisfiedNeeds.push("wheelchair_transport");
      const idx = unmetNeeds.indexOf("wheelchair_transport");
      if (idx > -1) unmetNeeds.splice(idx, 1);
      reasons.push("Vehicle has verified ramp/lift and secure wheelchair tie-downs.");
    }
  } else {
    warnings.push("No verified vehicle currently available that satisfies capacity or wheelchair constraints.");
  }

  // 2. Fetch Candidate Shelters
  const allShelters = await prisma.resource.findMany({
    where: {
      resourceType: "shelter",
      isActive: true,
    },
    include: {
      shelterDetails: true,
    },
  });

  const compatibleShelters = allShelters
    .filter((shl) => {
      const availableCap = shl.totalCapacity - shl.reservedCapacity - shl.currentOccupancy;
      // HARD CONSTRAINT: Capacity
      if (availableCap < groupSize) return false;

      // HARD CONSTRAINT: Step-free access / ramp
      if (requiresStepFree) {
        if (!shl.shelterDetails?.stepFreeAccess && !shl.shelterDetails?.rampAvailable) {
          return false;
        }
      }

      // HARD CONSTRAINT: Continuous electrical power backup
      if (requiresPower) {
        if (!shl.shelterDetails?.powerBackup) {
          return false;
        }
      }

      // HARD CONSTRAINT: Verification
      if (shl.verificationStatus !== "verified" && shl.verificationStatus !== "partner_verified") {
        return false;
      }

      return true;
    })
    .map((shl) => {
      const distance = calculateDistanceKm(refLat, refLon, shl.latitude, shl.longitude);
      return {
        id: shl.id,
        name: shl.name,
        step_free_access: shl.shelterDetails?.stepFreeAccess ?? false,
        ramp_available: shl.shelterDetails?.rampAvailable ?? false,
        power_backup: shl.shelterDetails?.powerBackup ?? false,
        accessible_toilets: shl.shelterDetails?.accessibleToilets ?? false,
        total_capacity: shl.totalCapacity,
        available_capacity: shl.totalCapacity - shl.reservedCapacity - shl.currentOccupancy,
        verification_status: shl.verificationStatus as VerificationStatus,
        distance_km: distance,
      };
    })
    .sort((a, b) => a.distance_km - b.distance_km);

  const bestShelter = compatibleShelters[0] || null;

  if (bestShelter) {
    reasons.push(
      `Selected ${bestShelter.name} (${bestShelter.distance_km} km away, ${bestShelter.available_capacity} places available).`
    );
    if (requiresStepFree) {
      satisfiedNeeds.push("step_free_access");
      const idx = unmetNeeds.indexOf("step_free_access");
      if (idx > -1) unmetNeeds.splice(idx, 1);
      reasons.push("Shelter features step-free ramp access.");
    }
    if (requiresPower && bestShelter.power_backup) {
      satisfiedNeeds.push("power_equipment");
      const idx = unmetNeeds.indexOf("power_equipment");
      if (idx > -1) unmetNeeds.splice(idx, 1);
      reasons.push("Shelter has verified diesel generator with fuel reserve for assistive medical devices.");
    }
  } else {
    warnings.push("No verified shelter meets the combination of capacity, ramp access, and electrical requirements.");
  }

  // 3. Fetch Candidate Responders
  const allResponders = await prisma.resource.findMany({
    where: {
      resourceType: "responder",
      isActive: true,
    },
    include: {
      responderDetails: true,
      assignmentsAsResp: {
        where: {
          status: { in: ["assigned", "accepted", "in_progress"] },
        },
      },
    },
  });

  const compatibleResponders = allResponders
    .filter((resp) => {
      if (resp.assignmentsAsResp.length > 0) return false;
      if (resp.responderDetails?.currentStatus !== "available") return false;

      // Verification gate
      if (resp.verificationStatus !== "verified" && resp.verificationStatus !== "partner_verified") {
        return false;
      }

      return true;
    })
    .map((resp) => {
      let skills: string[] = [];
      try {
        skills = JSON.parse(resp.responderDetails?.skillsJson || "[]");
      } catch {
        skills = [];
      }

      const distance = calculateDistanceKm(refLat, refLon, resp.latitude, resp.longitude);
      let skillMatchScore = 0;
      if (requiresSignLang && skills.includes("sign_language")) skillMatchScore += 5;
      if (requiresGuide && skills.includes("guided_assistance")) skillMatchScore += 4;
      if (requiresWheelchair && skills.includes("mobility_support")) skillMatchScore += 3;
      if (skills.includes("first_aid")) skillMatchScore += 2;

      return {
        id: resp.id,
        name: resp.name,
        organization: resp.responderDetails?.organization || "Volunteer Unit",
        skills,
        verification_status: resp.verificationStatus as VerificationStatus,
        current_status: resp.responderDetails?.currentStatus || "available",
        distance_km: distance,
        skillMatchScore,
      };
    })
    .sort((a, b) => b.skillMatchScore - a.skillMatchScore || a.distance_km - b.distance_km);

  const bestResponder = compatibleResponders[0] || null;

  if (bestResponder) {
    reasons.push(
      `Assigned volunteer team: ${bestResponder.name} (${bestResponder.organization}, ${bestResponder.distance_km} km away).`
    );
    if (requiresSignLang && bestResponder.skills.includes("sign_language")) {
      satisfiedNeeds.push("sign_language");
      satisfiedNeeds.push("visual_communication");
      const idx1 = unmetNeeds.indexOf("sign_language");
      if (idx1 > -1) unmetNeeds.splice(idx1, 1);
      const idx2 = unmetNeeds.indexOf("visual_communication");
      if (idx2 > -1) unmetNeeds.splice(idx2, 1);
      reasons.push("Responder is certified in Bengali Sign Language (BdSL).");
    }
    if (requiresGuide && bestResponder.skills.includes("guided_assistance")) {
      satisfiedNeeds.push("guided_assistance");
      const idx = unmetNeeds.indexOf("guided_assistance");
      if (idx > -1) unmetNeeds.splice(idx, 1);
      reasons.push("Responder trained in sighted guide techniques for blind citizens.");
    }
  }

  // Determine overall match feasibility
  let feasibility: "verified_safe_match" | "partial_match" | "no_verified_safe_match" = "verified_safe_match";
  if (!bestShelter && !bestVehicle) {
    feasibility = "no_verified_safe_match";
  } else if (!bestShelter || (requiresWheelchair && !bestVehicle?.wheelchair_accessible) || unmetNeeds.length > 0) {
    feasibility = "partial_match";
  }

  checklist.push("Confirm citizen landmark and contact protocol before approving.");
  checklist.push("Verify driver is equipped with proper tie-down belts for wheelchair transport.");
  checklist.push("Notify shelter manager to prepare ground-floor accessible room.");

  return {
    vehicle: bestVehicle,
    shelter: bestShelter,
    responder: bestResponder,
    feasibility,
    score: feasibility === "verified_safe_match" ? 95 : feasibility === "partial_match" ? 65 : 20,
    satisfied_needs: Array.from(new Set(satisfiedNeeds)),
    unmet_needs: unmetNeeds,
    reasons,
    warnings,
    coordinator_checklist: checklist,
  };
}

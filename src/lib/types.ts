export type Language = "bn" | "en" | "banglish";

export type RequestStatus =
  | "pending_review"
  | "matching"
  | "assigned"
  | "en_route"
  | "arrived"
  | "completed"
  | "cancelled";

export type UrgencyLevel = "routine" | "urgent" | "critical" | "needs_human_review";

export type NeedType =
  | "wheelchair_transport"
  | "step_free_access"
  | "guided_assistance"
  | "visual_communication"
  | "sign_language"
  | "power_equipment"
  | "caregiver_accompaniment"
  | "older_adult_assistance"
  | "cognitive_support"
  | "other";

export type VerificationStatus =
  | "verified"
  | "partner_verified"
  | "community_reported"
  | "unverified"
  | "expired";

export type ResourceType = "vehicle" | "shelter" | "responder" | "equipment";

export type AssignmentStatus =
  | "assigned"
  | "accepted"
  | "declined"
  | "in_progress"
  | "arrived"
  | "completed"
  | "failed";

export interface AIAnalysisResult {
  language: Language;
  group_size: number;
  support_needs: NeedType[];
  requested_resources: string[];
  location: string | null;
  urgency: UrgencyLevel;
  missing_information: string[];
  requires_human_review: boolean;
  confidence_score: number;
  extracted_notes?: string;
  is_fallback: boolean;
  model_name: string;
}

export interface ResourceMatchRecommendation {
  vehicle: {
    id: string;
    name: string;
    type: string;
    wheelchair_accessible: boolean;
    stretcher_capable: boolean;
    capacity: number;
    available_capacity: number;
    verification_status: VerificationStatus;
    distance_km: number;
  } | null;
  shelter: {
    id: string;
    name: string;
    step_free_access: boolean;
    ramp_available: boolean;
    power_backup: boolean;
    accessible_toilets: boolean;
    total_capacity: number;
    available_capacity: number;
    verification_status: VerificationStatus;
    distance_km: number;
  } | null;
  responder: {
    id: string;
    name: string;
    organization: string;
    skills: string[];
    verification_status: VerificationStatus;
    current_status: string;
    distance_km: number;
  } | null;
  feasibility: "verified_safe_match" | "partial_match" | "no_verified_safe_match";
  score: number;
  satisfied_needs: NeedType[];
  unmet_needs: NeedType[];
  reasons: string[];
  warnings: string[];
  coordinator_checklist: string[];
}

export interface OfflineDraftRequest {
  localId: string;
  rawDescription: string;
  approximateLocation: string;
  groupSize: number;
  urgency: UrgencyLevel;
  supportNeeds: NeedType[];
  contactName?: string;
  contactPhone?: string;
  timestamp: string;
  syncStatus: "draft_saved_locally" | "syncing" | "synced" | "failed";
}

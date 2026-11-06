import { z } from "zod";
import { AIAnalysisResult, Language, NeedType, UrgencyLevel } from "../types";

export const AIAnalysisSchema = z.object({
  language: z.enum(["bn", "en", "banglish"]),
  group_size: z.number().int().min(1).default(1),
  support_needs: z.array(
    z.enum([
      "wheelchair_transport",
      "step_free_access",
      "guided_assistance",
      "visual_communication",
      "sign_language",
      "power_equipment",
      "caregiver_accompaniment",
      "older_adult_assistance",
      "cognitive_support",
      "other",
    ])
  ),
  requested_resources: z.array(z.string()),
  location: z.string().nullable(),
  urgency: z.enum(["routine", "urgent", "critical", "needs_human_review"]),
  missing_information: z.array(z.string()),
  requires_human_review: z.boolean(),
  confidence_score: z.number().min(0).max(1),
  extracted_notes: z.string().optional(),
  is_fallback: z.boolean(),
  model_name: z.string(),
});

/**
 * Detect language of input text (Bengali Unicode, Banglish transliteration, or English)
 */
export function detectLanguage(text: string): Language {
  // Bengali Unicode block: \u0980-\u09FF
  const bengaliCharCount = (text.match(/[\u0980-\u09FF]/g) || []).length;
  if (bengaliCharCount > 5 || (text.length > 0 && bengaliCharCount / text.length > 0.2)) {
    return "bn";
  }

  const banglishLexicon = [
    /\b(amar|amader|amra|dorkar|sahajjo|wheelchair|auto|gari|baba|ma|dada|nani|pani|uthte|parchena|parbena|hata|chola|shunte|paina|ondho|taratari|pathan|basa|ashroy|khulna|dacope)\b/i,
  ];

  if (banglishLexicon.some((pattern) => pattern.test(text))) {
    return "banglish";
  }

  return "en";
}

/**
 * Deterministic rule-based extractor for emergency needs.
 * Used as reliable fallback when Adaption API key is not provided or during offline operation.
 */
export function extractNeedsDeterministically(rawText: string, statedNeeds: NeedType[] = []): AIAnalysisResult {
  const text = rawText.toLowerCase();
  const detectedLang = detectLanguage(rawText);
  const detectedNeeds = new Set<NeedType>(statedNeeds);
  const missingInfo: string[] = [];

  // 1. Wheelchair & Step-free Transport
  if (
    /হুইলচেয়ার|হাঁটতে পারে না|হাঁটতে পারেন না|প্যারালাইজড|wheelchair|huilcheyar|wheel chair|cannot walk|can't walk|unable to walk|paralyzed|mobility/i.test(
      text
    )
  ) {
    detectedNeeds.add("wheelchair_transport");
    detectedNeeds.add("step_free_access");
  }

  // 2. Step-Free Access / Ramp
  if (/সিঁড়ি|র‍্যাম্প|সিঁড়িতে|ramp|step-free|stairs|steps/i.test(text)) {
    detectedNeeds.add("step_free_access");
  }

  // 3. Visual Impairment / Guided Navigation
  if (/অন্ধ|চোখে দেখেন না|চোখে দেখে না|দৃষ্টি প্রতিবন্ধী|blind|visually impaired|low vision|guided assistance|guide/i.test(text)) {
    detectedNeeds.add("guided_assistance");
  }

  // 4. Hearing Impairment / Deaf / Visual Comms
  if (/বধির|শুনতে পান না|শুনতে পারে না|শ্রবণ প্রতিবন্ধী|deaf|hard of hearing|hearing impaired|shunte paina|cannot hear/i.test(text)) {
    detectedNeeds.add("visual_communication");
  }

  // 5. Sign Language
  if (/ইশারা ভাষা|সাইন ল্যাঙ্গুয়েজ|ইশারা|sign language|ishara bhasha/i.test(text)) {
    detectedNeeds.add("sign_language");
    detectedNeeds.add("visual_communication");
  }

  // 6. Powered Medical Equipment (Oxygen, Ventilator, Suction)
  if (/অক্সিজেন|ভেন্টিলেটর|সাকশন|বিদ্যুৎ|নেবুলাইজার|oxygen|ventilator|suction machine|nebulizer|electricity|power backup|life support/i.test(text)) {
    detectedNeeds.add("power_equipment");
    detectedNeeds.add("step_free_access");
  }

  // 7. Caregiver Accompaniment
  if (/কেয়ারগিভার|পরিবারের সদস্য|সাহায্যকারী|caregiver|family member|attendant|sahajjo/i.test(text)) {
    detectedNeeds.add("caregiver_accompaniment");
  }

  // 8. Older Adults / Elderly
  if (/বৃদ্ধ|বয়স্ক|দাদা|নানা|দাদী|নানী|elderly|older adult|senior citizen|dada|nani|dadi/i.test(text)) {
    detectedNeeds.add("older_adult_assistance");
  }

  // Extract group size (supports ASCII digits, Bengali digits ০-৯, and Bengali/English words)
  let groupSize = 1;
  const bnToAsciiDigits: Record<string, string> = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9"
  };

  // Convert Bengali digits in text to ASCII digits
  let normalizedText = text;
  for (const [bnDigit, asciiDigit] of Object.entries(bnToAsciiDigits)) {
    normalizedText = normalizedText.replaceAll(bnDigit, asciiDigit);
  }

  const bnNumberWords: Record<string, number> = {
    এক: 1, দুই: 2, তিন: 3, চার: 4, পাঁচ: 5, ছয়: 6, সাত: 7, আট: 8, নয়: 9, দশ: 10,
  };

  const enNumberWords: Record<string, number> = {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  };

  const groupPattern = /(\d+)\s*(জন|people|persons|members|family members)?/i;
  const match = normalizedText.match(groupPattern);
  if (match && match[1]) {
    const parsed = parseInt(match[1], 10);
    if (!isNaN(parsed) && parsed > 0 && parsed < 50) {
      groupSize = parsed;
    }
  } else {
    for (const [word, val] of Object.entries({ ...bnNumberWords, ...enNumberWords })) {
      if (new RegExp(`\\b${word}\\s*(জন|people|persons|members)?\\b`, "i").test(text)) {
        groupSize = val;
        break;
      }
    }
  }

  // Check for location hints
  let location: string | null = null;
  const locMatch = text.match(
    /(?:at|in|near|কাছে|এলাকা|বাজার|ইউনিয়ন|গ্রামে|dacope|khulna|chalna|bajua|shyamnagar|bazar|ghat)\s*[:,-]?\s*([A-Za-z0-9\u0980-\u09FF\s]{3,35})/i
  );
  if (locMatch && locMatch[1]) {
    location = locMatch[1].trim();
  }

  if (!location) {
    missingInfo.push("approximate_location");
  }

  // Determine urgency
  let urgency: UrgencyLevel = "urgent";
  if (/জরুরি|বাঁচান|পানি ঢুকছে|ডুবে যাচ্ছে|দ্রুত|immediate|critical|drowning|life threatening|water rising rapidly|emergency/i.test(text)) {
    urgency = "critical";
  } else if (/সাধারণ|আগামীকাল|routine|later|not urgent/i.test(text)) {
    urgency = "routine";
  }

  const requestedResources: string[] = [];
  if (detectedNeeds.has("wheelchair_transport")) requestedResources.push("accessible_vehicle");
  if (detectedNeeds.has("step_free_access")) requestedResources.push("accessible_shelter");
  if (detectedNeeds.has("power_equipment")) requestedResources.push("generator_shelter");
  if (detectedNeeds.has("guided_assistance") || detectedNeeds.has("visual_communication")) {
    requestedResources.push("trained_volunteer");
  }

  return {
    language: detectedLang,
    group_size: groupSize,
    support_needs: Array.from(detectedNeeds),
    requested_resources: requestedResources,
    location,
    urgency,
    missing_information: missingInfo,
    requires_human_review: true,
    confidence_score: 0.91,
    extracted_notes: "Deterministic rule-based extraction based on validated emergency keywords.",
    is_fallback: true,
    model_name: "simulated-rule-engine-v1",
  };
}

/**
 * Main AI entry point.
 * Invokes live Adaption API if ADAPTION_API_KEY is present;
 * otherwise gracefully falls back to deterministic rule engine.
 */
export async function analyzeEmergencyNeeds(
  rawText: string,
  statedNeeds: NeedType[] = []
): Promise<AIAnalysisResult> {
  const apiKey = process.env.ADAPTION_API_KEY?.trim();

  // If no API key is provided, safely invoke transparent fallback
  if (!apiKey) {
    return extractNeedsDeterministically(rawText, statedNeeds);
  }

  try {
    const endpoint = process.env.ADAPTION_API_URL || "https://api.adaptionlabs.ai/v1";
    const prompt = `You are an emergency needs extraction AI for SHONGJOG in Bangladesh.
Translate this emergency text into structured functional needs without making clinical diagnoses.
Analyze the following text:
"${rawText}"

Respond ONLY with valid JSON matching this schema:
{
  "language": "bn" | "en" | "banglish",
  "group_size": number,
  "support_needs": string[], (Allowed: wheelchair_transport, step_free_access, guided_assistance, visual_communication, sign_language, power_equipment, caregiver_accompaniment, older_adult_assistance, cognitive_support, other),
  "requested_resources": string[],
  "location": string | null,
  "urgency": "critical" | "urgent" | "routine" | "needs_human_review",
  "missing_information": string[],
  "requires_human_review": boolean,
  "confidence_score": number (0.0 to 1.0),
  "extracted_notes": string
}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6 second strict SLA

    const response = await fetch(`${endpoint}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "adaption-v1-multilingual",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`Adaption API returned status ${response.status}. Falling back to deterministic engine.`);
      return extractNeedsDeterministically(rawText, statedNeeds);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return extractNeedsDeterministically(rawText, statedNeeds);
    }

    const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const validated = AIAnalysisSchema.parse({
      ...parsed,
      is_fallback: false,
      model_name: "adaption-v1-multilingual",
    });

    return validated;
  } catch (error) {
    console.warn("Adaption API call failed or timed out. Falling back to deterministic engine.", error);
    return extractNeedsDeterministically(rawText, statedNeeds);
  }
}

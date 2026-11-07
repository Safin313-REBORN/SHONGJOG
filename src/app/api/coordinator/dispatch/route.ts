import { NextRequest } from "next/server";
import { POST as assignmentsPost } from "@/app/api/assignments/route";

export async function POST(request: NextRequest) {
  // Delegate directly to the atomic assignment and dispatch transaction handler
  return assignmentsPost(request);
}


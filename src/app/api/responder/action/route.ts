import { NextRequest, NextResponse } from "next/server";
import { POST as assignmentStatusPost } from "@/app/api/assignments/[id]/status/route";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assignmentId, action, notes, reason, responderName, responderId } = body;

    if (!assignmentId) {
      return NextResponse.json(
        { success: false, error: "assignmentId is required." },
        { status: 400 }
      );
    }

    // Forward to the assignment status transition handler
    const forwardedRequest = new NextRequest(request.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        reason: reason || notes,
        responderName: responderName || "Field Responder",
        responderId,
      }),
    });

    return assignmentStatusPost(forwardedRequest, {
      params: Promise.resolve({ id: assignmentId }),
    });
  } catch (error) {
    console.error("Responder action route error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}


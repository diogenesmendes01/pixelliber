import { NextRequest, NextResponse } from "next/server";

// Session validation placeholder - depends on issue #5 (auth)
async function validateSession(request: NextRequest): Promise<{ valid: boolean; userId?: string; companyId?: string }> {
  // TODO: Implement session validation after issue #5 (auth) is resolved
  // Expected: read session cookie, validate JWT, return { userId, companyId }
  const sessionCookie = request.cookies.get("session");
  if (!sessionCookie?.value) {
    return { valid: false };
  }
  // Placeholder: decode/validate session token
  // In real implementation, verify JWT and extract user/company info
  try {
    const sessionData = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString());
    return { valid: true, userId: sessionData.userId, companyId: sessionData.companyId };
  } catch {
    return { valid: false };
  }
}

// Subscription validation placeholder - depends on issue #4 (catalogo)
async function validateActiveSubscription(companyId: string): Promise<boolean> {
  // TODO: Implement subscription check after issue #4 (catalogo) is resolved
  // Expected: query database for active subscription status
  // Placeholder: always return true for demo
  return true;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const isDownload = searchParams.get("download") === "1";

  // Step 1: Validate session
  const session = await validateSession(request);
  if (!session.valid || !session.companyId) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  // Step 2: Validate active subscription
  const hasActiveSubscription = await validateActiveSubscription(session.companyId);
  if (!hasActiveSubscription) {
    return NextResponse.json(
      { error: "Active subscription required." },
      { status: 403 }
    );
  }

  // Step 3: Determine PDF path based on e-book ID
  const pdfFilename = `${id}.pdf`;
  const pdfPath = `/pdfs/${pdfFilename}`;

  try {
    // Step 4: Increment download counter (only for downloads, not inline reads)
    if (isDownload) {
      // TODO: After issue #4 (catalogo), increment contadorDownloads in database
      // await incrementDownloadCounter(id);
    }

    // Step 5: Serve PDF file
    const pdfUrl = new URL(request.url);
    const proxyUrl = `${pdfUrl.origin}${pdfPath}`;

    const pdfResponse = await fetch(proxyUrl);
    if (!pdfResponse.ok) {
      return NextResponse.json(
        { error: "PDF not found." },
        { status: 404 }
      );
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": isDownload
          ? `attachment; filename="${pdfFilename}"`
          : `inline; filename="${pdfFilename}"`,
        "Content-Length": pdfBuffer.byteLength.toString(),
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error(`Error serving PDF for ebook ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to serve PDF." },
      { status: 500 }
    );
  }
}

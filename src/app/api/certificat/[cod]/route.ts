import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { getCertificateForViewer } from "@/lib/certificates";
import { renderCertificatePdf } from "@/lib/certificate-pdf";
import { getSettings } from "@/lib/settings";

// Descarcă certificatul ca PDF. Doar proprietarul sau adminul îl pot obține.
export async function GET(_req: Request, { params }: { params: Promise<{ cod: string }> }) {
  const code = (await params).cod.toUpperCase();
  const viewer = await getCurrentUser();
  if (!viewer) return NextResponse.json({ error: "neautentificat" }, { status: 401 });

  const [certificate, settings] = await Promise.all([getCertificateForViewer(code, viewer), getSettings()]);
  if (!certificate) return NextResponse.json({ error: "negasit" }, { status: 404 });

  const pdf = await renderCertificatePdf({
    studentName: [certificate.user.surname, certificate.user.name].filter(Boolean).join(" "),
    courseTitle: certificate.course.title,
    issuedAt: certificate.issuedAt,
    code: certificate.code,
    signature: settings.certificat_semnatura,
    text: settings.certificat_text || "pentru finalizarea cu succes a cursului",
  });

  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificat-${certificate.code}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}

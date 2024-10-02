import { NextResponse } from "next/server";

const API_URL = "https://www.whoisxmlapi.com/whoisserver/WhoisService";

export async function POST(request: Request) {
  try {
    const { domain, type } = await request.json();
    const apiKey = process.env.NEXT_PUBLIC_WHOISXML_API_KEY;

    const url = `${API_URL}?apiKey=${apiKey}&domainName=${domain}&outputFormat=JSON`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.ErrorMessage || "Failed to lookup domain information"
      );
    }

    const whoisRecord = data.WhoisRecord;

    if (type === "domain") {
      return NextResponse.json({
        domainName: whoisRecord.domainName,
        registrar: whoisRecord.registrarName,
        registrationDate: whoisRecord.createdDate,
        expirationDate: whoisRecord.expiresDate,
        estimatedDomainAge: calculateAge(whoisRecord.createdDate),
        hostnames: whoisRecord.nameServers?.hostNames || [],
      });
    } else if (type === "contact") {
      const registrant = whoisRecord.registrant || {};
      const admin = whoisRecord.administrativeContact || {};
      const tech = whoisRecord.technicalContact || {};

      return NextResponse.json({
        registrantName: registrant.name || "Not available",
        technicalContactName: tech.name || "Not available",
        administrativeContactName: admin.name || "Not available",
        contactEmail:
          registrant.email || admin.email || tech.email || "Not available",
      });
    } else {
      return NextResponse.json(
        { error: "Invalid lookup type" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in domain lookup:", error);
    return NextResponse.json(
      { error: "Failed to lookup domain information" },
      { status: 500 }
    );
  }
}

function calculateAge(creationDate: string) {
  if (!creationDate) return "Unknown";
  const ageInMs = Date.now() - new Date(creationDate).getTime();
  const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25));
  return `${ageInYears} years`;
}

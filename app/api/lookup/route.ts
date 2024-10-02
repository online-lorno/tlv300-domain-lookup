import { ContactInfo, DomainInfo } from "@/app/types";
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
      const data: DomainInfo = {
        domainName: whoisRecord.domainName,
        registrar: whoisRecord.registrarName,
        registrationDate:
          whoisRecord.registryData?.createdDate || "Not available",
        expirationDate:
          whoisRecord.registryData?.expiresDate || "Not available",
        estimatedDomainAge: whoisRecord.estimatedDomainAge
          ? calculateDomainAge(Number(whoisRecord.estimatedDomainAge))
          : "Not available",
        hostnames: whoisRecord.nameServers?.hostNames || [],
      };

      return NextResponse.json(data);
    } else if (type === "contact") {
      const data: ContactInfo = {
        registrantName: whoisRecord.registrant?.organization || "Not available",
        technicalContactName:
          whoisRecord.technicalContact?.organization || "Not available",
        administrativeContactName:
          whoisRecord.administrativeContact?.organization || "Not available",
        contactEmail: whoisRecord.contactEmail || "Not available",
      };

      return NextResponse.json(data);
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

function calculateDomainAge(days: number): string {
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const remainingDays = days - years * 365 - months * 30;

  return `${years} years, ${months} months, ${remainingDays} days`;
}

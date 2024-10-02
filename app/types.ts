export type LookupType = "domain" | "contact";

export type DomainInfo = {
  domainName: string;
  registrar: string;
  registrationDate: string;
  expirationDate: string;
  estimatedDomainAge: string;
  hostnames: string[];
};

export type ContactInfo = {
  registrantName: string;
  technicalContactName: string;
  administrativeContactName: string;
  contactEmail: string;
};

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type LookupType = "domain" | "contact";

type DomainInfo = {
  domainName: string;
  registrar: string;
  registrationDate: string;
  expirationDate: string;
  estimatedDomainAge: string;
  hostnames: string[];
};

type ContactInfo = {
  registrantName: string;
  technicalContactName: string;
  administrativeContactName: string;
  contactEmail: string;
};

export default function DomainLookup() {
  const [domain, setDomain] = useState("");
  const [lookupType, setLookupType] = useState<LookupType>("domain");
  const [result, setResult] = useState<DomainInfo | ContactInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch("/api/lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain, type: lookupType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to lookup domain information");
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to lookup domain information. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Domain Lookup</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <Input
          placeholder="Enter domain name"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <Select
          value={lookupType}
          onValueChange={(value: LookupType) => setLookupType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select lookup type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="domain">Domain Information</SelectItem>
            <SelectItem value="contact">Contact Information</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" disabled={loading}>
          {loading ? "Looking up..." : "Lookup"}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Table>
          <TableCaption>
            {lookupType === "domain"
              ? "Domain Information"
              : "Contact Information"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Field</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(result).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className="font-medium">{key}</TableCell>
                <TableCell>
                  {Array.isArray(value) ? value.join(", ") : value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

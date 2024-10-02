"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DomainInfo } from "../types";

export default function DomainInfoTabe({ info }: { info: DomainInfo }) {
  return (
    <Table>
      <TableCaption>Domain Information</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Domain Name</TableHead>
          <TableHead>Registrar</TableHead>
          <TableHead>Registration Date</TableHead>
          <TableHead>Expiration Date</TableHead>
          <TableHead>Estimated Domain Age</TableHead>
          <TableHead>Hostnames</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{info.domainName}</TableCell>
          <TableCell>{info.registrar}</TableCell>
          <TableCell>{info.registrationDate}</TableCell>
          <TableCell>{info.expirationDate}</TableCell>
          <TableCell>{info.estimatedDomainAge}</TableCell>
          <TableCell>
            {info.hostnames.join(", ").length > 25
              ? info.hostnames.join(", ").substring(0, 25) + "..."
              : info.hostnames.join(", ")}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

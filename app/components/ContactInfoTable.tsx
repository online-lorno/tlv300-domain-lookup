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
import { ContactInfo } from "../types";

export default function ContactInfoTable({ info }: { info: ContactInfo }) {
  return (
    <Table>
      <TableCaption>Contact Information</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Registrant Name</TableHead>
          <TableHead>Technical Contact Name</TableHead>
          <TableHead>Administrative Contact Name</TableHead>
          <TableHead>Contact Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{info.registrantName}</TableCell>
          <TableCell>{info.technicalContactName}</TableCell>
          <TableCell>{info.administrativeContactName}</TableCell>
          <TableCell>{info.contactEmail}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

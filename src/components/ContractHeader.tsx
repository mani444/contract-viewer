import { Badge } from "@/components/ui/badge";
import { Calendar, Users, FileText } from "lucide-react";
import type { Contract } from "@/types";

interface ContractHeaderProps {
  contract: Contract;
}

export function ContractHeader({ contract }: ContractHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
        {contract.document_title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            Effective Date: {contract.effective_date}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="text-sm">
            {contract.parties.length}{" "}
            {contract.parties.length === 1 ? "party" : "parties"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span className="text-sm">
            {contract.clauses.length}{" "}
            {contract.clauses.length === 1 ? "clause" : "clauses"}
          </span>
        </div>
      </div>

      {/* Parties Information */}
      <div className="mt-4 flex flex-wrap gap-2">
        {contract.parties.map((party, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {party.name} ({party.role})
          </Badge>
        ))}
      </div>
    </div>
  );
}

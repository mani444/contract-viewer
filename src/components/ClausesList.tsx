import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { ClausesListProps, Clause } from "@/types/components";

export function ClausesList({
  contract,
  onClauseClick,
  highlightedClause,
}: ClausesListProps) {
  // Use array index as consistent identifier to avoid confusion with inconsistent data
  const getClauseId = (index: number) => {
    return `clause-${index}`;
  };

  const getClauseTitle = (clause: Clause, index: number) => {
    if (clause.number && clause.title) {
      return `${clause.number}. ${clause.title}`;
    }
    if (clause.title) {
      return clause.title;
    }
    if (clause.number) {
      return `Clause ${clause.number}`;
    }
    return `Clause ${index + 1}`;
  };

  const hasContent = (clause: Clause) => {
    return clause.content && clause.content.trim().length > 0;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Contract Clauses
          <Badge variant="secondary" className="text-xs">
            {contract.clauses.length} clauses
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)] px-6 pb-6">
          <Accordion type="multiple" className="space-y-2">
            {contract.clauses.map((clause, index) => {
              const clauseId = getClauseId(index);
              const isHighlighted = highlightedClause === clauseId;

              return (
                <AccordionItem
                  key={clauseId}
                  value={clauseId}
                  className={`border rounded-lg px-4 transition-colors ${
                    isHighlighted
                      ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                      : ""
                  }`}
                >
                  <AccordionTrigger
                    className="hover:no-underline"
                    onClick={() => onClauseClick(clauseId)}
                  >
                    <div className="flex flex-col items-start text-left space-y-1">
                      <span className="font-medium text-sm">
                        {getClauseTitle(clause, index)}
                      </span>
                      {!hasContent(clause) && (
                        <Badge variant="outline" className="text-xs">
                          No content
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  {hasContent(clause) && (
                    <AccordionContent className="pt-2">
                      <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {clause.content}
                      </div>
                    </AccordionContent>
                  )}
                </AccordionItem>
              );
            })}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

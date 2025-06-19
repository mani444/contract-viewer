import { Contract } from "@/types/contract";

export const sampleContract: Contract = {
  "document_title": "Consulting Services Agreement",
  "effective_date": "2025-06-01",
  "parties": [
    { "name": "Acme Inc.", "role": "Company" },
    { "name": "Jane Doe", "role": "Consultant" }
  ],
  "clauses": [
    {
      "number": "1",
      "title": "Scope of Services",
      "content": "The Consultant shall provide strategic advisory services, including but not limited to business development, partnership outreach, and operational guidance."
    },
    {
      "number": "2",
      "title": "Term",
      "content": "This Agreement shall commence on June 1, 2025 and remain in effect for a period of one (1) year unless terminated earlier as provided herein."
    },
    {
      "number": "3",
      "title": "Compensation",
      "content": " The Consultant will be paid a monthly fee of $5,000 USD, payable on the last business day of each calendar month. "
    },
    {
      "number": "4",
      "content": "Each party agrees to keep confidential all non-public information received from the other party during the term of this Agreement."
    },
    {
      "number": "5",
      "title": "Termination"
    },
    {
      "title": "Governing Law",
      "content": "This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware."
    },
    {
      "number": "7",
      "title": "Entire Agreement",
      "content": "This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements or understandings."
    }
  ]
};
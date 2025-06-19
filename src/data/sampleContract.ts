import { Contract } from "@/types/contract";

export const sampleContract: Contract = {
  document_title: "Consulting Services Agreement",
  effective_date: "2025-06-01",
  parties: [
    { name: "Acme Inc.", role: "Company" },
    { name: "Jane Doe", role: "Consultant" },
  ],
  clauses: [
    {
      number: "1",
      title: "Scope of Services",
      content:
        "The Consultant shall provide strategic advisory services, including but not limited to business development, partnership outreach, and operational guidance to help Company achieve its business objectives.",
    },
    {
      number: "2",
      title: "Term",
      content:
        "This Agreement shall commence on June 1, 2025 and remain in effect for a period of one (1) year unless terminated earlier as provided herein. The term may be extended by mutual written agreement of both parties.",
    },
    {
      number: "3",
      title: "Compensation",
      content:
        "The Consultant will be paid a monthly fee of $5,000 USD, payable on the last business day of each calendar month. Payment shall be made via wire transfer or ACH to the account designated by Consultant.",
    },
    {
      number: "4",
      title: "Confidentiality",
      content:
        "Each party agrees to keep confidential all non-public information received from the other party during the term of this Agreement. This obligation shall survive termination of this Agreement for a period of five (5) years.",
    },
    {
      number: "5",
      title: "Termination",
      content:
        "Either party may terminate this Agreement with thirty (30) days written notice to the other party. Upon termination, all unpaid fees through the termination date shall become immediately due and payable.",
    },
    {
      number: "6",
      title: "Governing Law",
      content:
        "This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of laws provisions. Any disputes shall be resolved in the courts of Delaware.",
    },
    {
      number: "7",
      title: "Entire Agreement",
      content:
        "This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements or understandings, whether written or oral, relating to the subject matter hereof. This Agreement may only be modified in writing signed by both parties.",
    },
  ],
};

import type { EvidenceLedger } from "@/types/prototype";

export const evidenceLedgerMap: Record<string, EvidenceLedger> = {
  "p-s3-1": {
    title: "Evidence for the current accessibility obligation",
    summary:
      "This answer depends on recent policy wording, internal interpretation, and whether the organisation falls inside the relevant obligation scope.",
    confidence: "Medium (72%)",
    freshness: "2 sources current · 1 source older than 12 months",
    used: [
      {
        id: "used-1",
        title: "Internal accessibility policy v3.2",
        note: "Used to confirm how the organisation currently interprets the obligation for internal teams.",
        tag: "Updated Mar 2026",
        url: "https://example.com/internal-accessibility-policy-v32",
        excerpt:
          "All customer-facing web journeys in scope must be reviewed against the current accessibility baseline before release approval is granted.",
      },
      {
        id: "used-2",
        title: "Public regulation summary",
        note: "Used to anchor the obligation to the latest externally visible wording of the rule.",
        tag: "Updated Jan 2026",
        url: "https://example.com/public-regulation-summary",
        excerpt:
          "The latest obligation applies to organisations delivering digital services in the covered market segment, subject to the stated sector and size conditions.",
      },
      {
        id: "used-3",
        title: "Implementation checklist",
        note: "Used to connect the obligation to concrete reporting and remediation steps.",
        tag: "Operational source",
        url: "https://example.com/implementation-checklist",
        excerpt:
          "Teams must document the accessibility review result, log unresolved findings, and assign remediation owners before the next release cycle.",
      },
    ],
    omitted: [
      {
        id: "omitted-1",
        title: "Legacy procurement checklist",
        note: "Considered but left out because it predates the current obligation scope and uses older terminology.",
        tag: "Outdated",
        url: "https://example.com/legacy-procurement-checklist",
        excerpt:
          "Accessibility checks are recommended for selected public contracts when procurement teams request them.",
      },
      {
        id: "omitted-2",
        title: "Industry blog commentary",
        note: "Considered but omitted because it interpreted the rule more broadly than the source policy supports.",
        tag: "Low authority",
        url: "https://example.com/industry-blog-commentary",
        excerpt:
          "In practice, every organisation with a website should assume the regulation already applies in full, regardless of current scope conditions.",
      },
    ],
    inaccessible: [
      {
        id: "inaccessible-1",
        title: "Legal counsel memo",
        note: "Not accessible in this prototype path because it is permission-restricted and unavailable to the current user role.",
        tag: "Restricted",
        url: "https://example.com/legal-counsel-memo",
      },
    ],
  },
  "p-s3-2": {
    title: "Evidence used for the policy comparison",
    summary:
      "The comparison is strongest when the assistant shows which text fragments support each reported difference and which apparent differences were discarded.",
    confidence: "High (81%)",
    freshness: "Version mismatch detected · one compared source is older",
    used: [
      {
        id: "used-4",
        title: "Policy summary A · version 2026.1",
        note: "Used for the current wording on approval steps and external-sharing conditions.",
        tag: "Current version",
        url: "https://example.com/policy-summary-a-2026-1",
        excerpt:
          "External sharing requires team-lead approval, confirmation of the approved vendor category, and a documented reason for disclosure.",
      },
      {
        id: "used-5",
        title: "Policy summary B · approved guidance note",
        note: "Used to verify where the process diverges and where it only appears different because of wording.",
        tag: "Reviewed source",
        url: "https://example.com/policy-summary-b-guidance-note",
        excerpt:
          "Project teams may share the approved document set externally once approval is logged and the disclosure condition is captured in the record.",
      },
    ],
    omitted: [
      {
        id: "omitted-3",
        title: "Archived comparison deck",
        note: "Considered but omitted because it summarised an older workflow and would overstate the difference between the two policies.",
        tag: "Superseded",
        url: "https://example.com/archived-comparison-deck",
        excerpt:
          "Policy A requires director approval while Policy B allows unrestricted external sharing after internal review.",
      },
      {
        id: "omitted-4",
        title: "Working draft excerpt",
        note: "Considered but not used because the draft was incomplete and not approved for operational use.",
        tag: "Unapproved",
        url: "https://example.com/working-draft-excerpt",
        excerpt:
          "The next revision may remove the current approval checkpoint and replace it with a team-level decision.",
      },
    ],
    inaccessible: [
      {
        id: "inaccessible-2",
        title: "Department-specific exception log",
        note: "Not accessible in this prototype path because the current role does not have access to the exception register.",
        tag: "Role-limited",
        url: "https://example.com/department-exception-log",
      },
    ],
  },
};

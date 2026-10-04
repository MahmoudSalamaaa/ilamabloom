export type ReviewStatus="planned"|"editorial-review"|"clinically-reviewed";
export type EvidenceCategory="educational-reference"|"contextual-safety"|"clinical-guidance";

export type ContentGovernance={
  source:string;
  evidenceCategory:EvidenceCategory;
  reviewedDate:string;
  clinicalReviewer:string;
  reviewStatus:ReviewStatus;
};

export const LIFE_STAGES_GOVERNANCE:ContentGovernance={
  source:"ILAMA BLOOM editorial safety and life-stage reference",
  evidenceCategory:"contextual-safety",
  reviewedDate:"2026-10-04",
  clinicalReviewer:"Clinical review status pending confirmation",
  reviewStatus:"editorial-review",
};

export const FOOD_ATLAS_GOVERNANCE:ContentGovernance={
  source:"ILAMA BLOOM Egyptian food reference",
  evidenceCategory:"educational-reference",
  reviewedDate:"2026-10-04",
  clinicalReviewer:"Clinical review status pending confirmation",
  reviewStatus:"editorial-review",
};

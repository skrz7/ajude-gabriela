import type { CampaignConfig } from "../config/campaign.ts";
export function getFundraising(config: CampaignConfig) {
  const data = config.fundraising.confirmed;
  const confirmed = Boolean(data && Number.isSafeInteger(data.goalCents) && data.goalCents > 0 && Number.isSafeInteger(data.raisedCents) && data.raisedCents >= 0 && Number.isFinite(Date.parse(data.verifiedAt)));
  return {
    goalCents: confirmed ? data!.goalCents : config.fundraising.estimatedGoalCents,
    raisedCents: confirmed ? data!.raisedCents : null,
    progress: confirmed ? Math.min(100, Math.round(data!.raisedCents / data!.goalCents * 10_000) / 100) : null,
    remainingCents: confirmed ? Math.max(0, data!.goalCents - data!.raisedCents) : null,
    confirmed,
  };
}

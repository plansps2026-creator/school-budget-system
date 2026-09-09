export const AI_ALLOWED=['ANALYZE','DRAFT','EXPLAIN','SUMMARIZE'] as const;
export const AI_FORBIDDEN=['APPROVE','REJECT','TRANSFER','PAY'] as const;
export function isAiActionAllowed(action:string){if((AI_FORBIDDEN as readonly string[]).includes(action))return false;return (AI_ALLOWED as readonly string[]).includes(action)}

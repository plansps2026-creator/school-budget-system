const ALLOWED=new Set(['ANALYZE','DRAFT','EXPLAIN','SUMMARIZE']);
const FORBIDDEN=new Set(['APPROVE','REJECT','TRANSFER','PAY']);
export function isAiActionAllowed(action:string){if(FORBIDDEN.has(action))return false;return ALLOWED.has(action)}

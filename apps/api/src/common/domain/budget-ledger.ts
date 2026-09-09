export type LedgerType='OPENING'|'ALLOCATION'|'TRANSFER_IN'|'TRANSFER_OUT'|'COMMITMENT'|'EXPENSE'|'ADJUSTMENT'|'REVERSAL';
export const ADD_TYPES=new Set<LedgerType>(['OPENING','ALLOCATION','TRANSFER_IN','ADJUSTMENT','REVERSAL']);
export const SUB_TYPES=new Set<LedgerType>(['TRANSFER_OUT','COMMITMENT','EXPENSE']);
export function calculateLedger(txs:Array<{type:LedgerType;amount:number}>){let available=0,commitments=0,actualExpenses=0;for(const tx of txs){if(ADD_TYPES.has(tx.type))available+=tx.amount;if(SUB_TYPES.has(tx.type))available-=tx.amount;if(tx.type==='COMMITMENT')commitments+=tx.amount;if(tx.type==='EXPENSE')actualExpenses+=tx.amount;}return{available,commitments,actualExpenses}}
export function assertSufficientBudget(available:number,amount:number){if(!Number.isFinite(amount)||amount<0)throw new Error('Amount must be a non-negative number');if(amount>available)throw new Error('Insufficient available budget')}

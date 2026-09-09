export type Free15RateInput={category:string;levelCode:string;studentCount:number;rate:number};
export function calculateFree15(rates:Free15RateInput[]){const items=rates.filter(x=>x.studentCount>0).map(x=>({...x,amount:x.studentCount*x.rate}));const total=items.reduce((s,x)=>s+x.amount,0);return{items,total}}

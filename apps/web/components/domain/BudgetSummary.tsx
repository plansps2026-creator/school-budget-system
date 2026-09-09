import { Card } from '../ui/Card';

type BudgetSummaryProps = {
  allocated: number;
  committed: number;
  spent: number;
  remaining: number;
};

const money = (value: number) => `${new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)} บาท`;

export function BudgetSummary({ allocated, committed, spent, remaining }: BudgetSummaryProps) {
  const items = [
    ['ได้รับจัดสรร', allocated],
    ['ผูกพัน', committed],
    ['เบิกจ่าย', spent],
    ['คงเหลือ', remaining],
  ];
  return (
    <div className="grid" aria-label="สรุปงบประมาณ">
      {items.map(([label, value]) => (
        <Card key={label as string}>
          <div className="muted">{label}</div>
          <div className="metric numeric">{money(value as number)}</div>
        </Card>
      ))}
    </div>
  );
}

import Link from 'next/link';
import { Card } from '../../components/ui/Card';

const expenses = [
  { no: 'EXP-2569-0012', activity: 'จัดซื้อหนังสือและสื่อการอ่าน', date: '10 มิ.ย. 2569', desc: 'หนังสือส่งเสริมการอ่าน', category: 'วัสดุการศึกษา', amount: 39000, evidence: 'ใบเสร็จ 1 รายการ' },
  { no: 'EXP-2569-0018', activity: 'Reading Camp', date: '20 ก.ค. 2569', desc: 'ค่าอาหารและวัสดุกิจกรรม', category: 'กิจกรรม', amount: 26000, evidence: 'เอกสาร 2 รายการ' },
];
const total = expenses.reduce((sum, e) => sum + e.amount, 0);

export default function ExpensesPage() {
  return <div className="page-stack">
    <div className="breadcrumb"><Link href="/projects">โครงการ</Link><span>/</span><Link href="/projects/view">PRJ-2569-001</Link><span>/</span><span>ค่าใช้จ่าย</span></div>
    <div className="page-header"><div><p className="eyebrow">EXPENSE WORKBENCH</p><h1>ค่าใช้จ่าย</h1><p className="muted">โครงการส่งเสริมการอ่าน · กิจกรรมทั้งหมด · ปีงบประมาณ 2569</p></div><button className="btn btn-primary btn-md" type="button">+ บันทึกค่าใช้จ่าย</button></div>
    <div className="grid"><Card><div className="muted">งบโครงการ</div><div className="metric numeric">100,000.00 บาท</div></Card><Card><div className="muted">เบิกจ่ายแล้ว</div><div className="metric numeric">{total.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท</div></Card><Card><div className="muted">คงเหลือ</div><div className="metric numeric">{(100000 - total).toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท</div></Card></div>
    <Card><div className="alert alert-info"><strong>Financial control:</strong> ระบบต้องตรวจ budget sufficiency จาก ledger ก่อน post ค่าใช้จ่าย และไม่อนุญาตให้ client override ยอดคงเหลือ</div><div className="toolbar"><div className="form-field compact"><label htmlFor="expense-search">ค้นหา</label><input id="expense-search" placeholder="เลขที่/รายละเอียด" /></div><div className="form-field compact"><label htmlFor="expense-category">หมวด</label><select id="expense-category"><option>ทั้งหมด</option><option>วัสดุการศึกษา</option><option>กิจกรรม</option></select></div></div></Card>
    <Card><div className="section-heading"><div><h2>รายการค่าใช้จ่าย</h2><p className="muted">รายการที่แสดงเป็นข้อมูลตัวอย่างของ Web UI foundation</p></div></div><div className="table-wrap"><table className="data-table"><thead><tr><th>เลขที่</th><th>กิจกรรม / รายละเอียด</th><th>วันที่</th><th>หมวด</th><th className="numeric">จำนวนเงิน</th><th>หลักฐาน</th><th>การดำเนินการ</th></tr></thead><tbody>{expenses.map((e) => <tr key={e.no}><td><strong>{e.no}</strong></td><td>{e.activity}<div className="muted">{e.desc}</div></td><td>{e.date}</td><td>{e.category}</td><td className="numeric">{e.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท</td><td>{e.evidence}</td><td><button className="btn btn-ghost btn-sm" type="button">ดู</button></td></tr>)}</tbody></table></div></Card>
    <div className="form-actions"><Link className="btn btn-secondary btn-md" href="/activities">← กลับกิจกรรม</Link><Link className="btn btn-primary btn-md" href="/projects/view">กลับโครงการ</Link></div>
  </div>;
}

import Link from 'next/link';
import { Card } from '../../components/ui/Card';

const activities = [
  { code: 'ACT-01', name: 'จัดซื้อหนังสือและสื่อการอ่าน', owner: 'ณัฐริกา', status: 'COMPLETED', planned: 40000, spent: 39000, date: '10 มิ.ย. 2569' },
  { code: 'ACT-02', name: 'Reading Camp', owner: 'ณัฐริกา', status: 'IN_PROGRESS', planned: 45000, spent: 26000, date: '20 ก.ค. 2569' },
  { code: 'ACT-03', name: 'ประเมินผลและสรุปโครงการ', owner: 'ณัฐริกา', status: 'PLANNED', planned: 15000, spent: 0, date: '15 ส.ค. 2569' },
];

const label: Record<string, string> = { COMPLETED: 'เสร็จสิ้น', IN_PROGRESS: 'กำลังดำเนินการ', PLANNED: 'วางแผน' };
const tone: Record<string, string> = { COMPLETED: 'success', IN_PROGRESS: 'info', PLANNED: 'warning' };

export default function ActivitiesPage() {
  return <div className="page-stack">
    <div className="breadcrumb"><Link href="/projects">โครงการ</Link><span>/</span><Link href="/projects/view">PRJ-2569-001</Link><span>/</span><span>กิจกรรม</span></div>
    <div className="page-header"><div><p className="eyebrow">ACTIVITY WORKBENCH</p><h1>กิจกรรม</h1><p className="muted">โครงการส่งเสริมการอ่าน · ปีงบประมาณ 2569</p></div><Link className="btn btn-primary btn-md" href="/activities">+ เพิ่มกิจกรรม</Link></div>
    <div className="grid"><Card><div className="muted">กิจกรรมทั้งหมด</div><div className="metric">{activities.length}</div></Card><Card><div className="muted">งบกิจกรรม</div><div className="metric numeric">100,000.00 บาท</div></Card><Card><div className="muted">เบิกจ่าย</div><div className="metric numeric">65,000.00 บาท</div></Card></div>
    <Card><div className="toolbar"><div className="form-field compact"><label htmlFor="activity-search">ค้นหากิจกรรม</label><input id="activity-search" placeholder="ชื่อหรือรหัสกิจกรรม" /></div><div className="form-field compact"><label htmlFor="activity-status">สถานะ</label><select id="activity-status"><option>ทั้งหมด</option><option>วางแผน</option><option>กำลังดำเนินการ</option><option>เสร็จสิ้น</option></select></div></div></Card>
    <Card><div className="section-heading"><div><h2>รายการกิจกรรม</h2><p className="muted">งบประมาณกิจกรรมต้องสัมพันธ์กับ Project budget</p></div></div><div className="table-wrap"><table className="data-table"><thead><tr><th>กิจกรรม</th><th>ผู้รับผิดชอบ</th><th>วันที่</th><th>สถานะ</th><th className="numeric">งบประมาณ</th><th className="numeric">เบิกจ่าย</th><th>การดำเนินการ</th></tr></thead><tbody>{activities.map((a) => <tr key={a.code}><td><strong>{a.name}</strong><div className="muted">{a.code}</div></td><td>{a.owner}</td><td>{a.date}</td><td><span className={`status status-${tone[a.status]}`}>{label[a.status]}</span></td><td className="numeric">{a.planned.toLocaleString('th-TH')} บาท</td><td className="numeric">{a.spent.toLocaleString('th-TH')} บาท</td><td><Link className="table-link" href="/expenses">ค่าใช้จ่าย</Link></td></tr>)}</tbody></table></div></Card>
  </div>;
}

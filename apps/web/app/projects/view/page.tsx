import Link from 'next/link';
import { Card } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { BudgetSummary } from '../../../components/domain/BudgetSummary';

const activities = [
  { code: 'ACT-01', name: 'จัดซื้อหนังสือและสื่อการอ่าน', date: '10 มิ.ย. 2569', status: 'COMPLETED', budget: 40000, spent: 39000 },
  { code: 'ACT-02', name: 'Reading Camp', date: '20 ก.ค. 2569', status: 'IN_PROGRESS', budget: 45000, spent: 26000 },
  { code: 'ACT-03', name: 'ประเมินผลและสรุปโครงการ', date: '15 ส.ค. 2569', status: 'PLANNED', budget: 15000, spent: 0 },
];

export default function ProjectViewPage() {
  return <div className="page-stack">
    <div className="breadcrumb"><Link href="/projects">โครงการ</Link><span>/</span><span>PRJ-2569-001</span></div>
    <div className="page-header"><div><p className="eyebrow">PRJ-2569-001</p><h1>โครงการส่งเสริมการอ่าน</h1><p className="muted">ผู้รับผิดชอบ: นางสาวณัฐริกา อุปพงษ์ · ปีงบประมาณ 2569</p></div><div className="actions"><StatusBadge status="APPROVED" /><Link className="btn btn-secondary btn-md" href="/projects/edit">แก้ไข</Link></div></div>

    <BudgetSummary allocated={100000} committed={72000} spent={65000} remaining={35000} />

    <div className="two-column">
      <Card><div className="section-heading"><h2>ข้อมูลโครงการ</h2></div><dl className="detail-list"><div><dt>หลักการและเหตุผล</dt><dd>พัฒนานิสัยรักการอ่านและเพิ่มโอกาสการเข้าถึงสื่อการเรียนรู้</dd></div><div><dt>วัตถุประสงค์</dt><dd>ส่งเสริมการอ่านอย่างต่อเนื่องและพัฒนาทักษะการสื่อสาร</dd></div><div><dt>กลุ่มเป้าหมาย</dt><dd>นักเรียนระดับชั้น ป.4–ม.3 จำนวน 200 คน</dd></div><div><dt>ระยะเวลา</dt><dd>1 มิ.ย. 2569 – 31 ส.ค. 2569</dd></div></dl></Card>
      <Card><div className="section-heading"><h2>KPI และความก้าวหน้า</h2></div><div className="kpi"><strong>นักเรียนเข้าร่วมกิจกรรม</strong><span>160 / 200 คน</span><div className="progress"><span style={{ width: '80%' }} /></div><small>80% ของเป้าหมาย</small></div><div className="kpi"><strong>ผลประเมินทักษะการอ่าน</strong><span>82 / 100</span><div className="progress"><span style={{ width: '82%' }} /></div><small>เป้าหมาย ≥ 80</small></div></Card>
    </div>

    <Card><div className="section-heading"><div><h2>กิจกรรม</h2><p className="muted">งานปฏิบัติทั้งหมดภายใต้โครงการ</p></div><Link className="btn btn-primary btn-sm" href="/activities">จัดการกิจกรรม</Link></div><div className="table-wrap"><table className="data-table"><thead><tr><th>กิจกรรม</th><th>วันที่</th><th>สถานะ</th><th className="numeric">งบประมาณ</th><th className="numeric">เบิกจ่าย</th></tr></thead><tbody>{activities.map((a) => <tr key={a.code}><td><strong>{a.name}</strong><div className="muted">{a.code}</div></td><td>{a.date}</td><td><span className={`status status-${a.status === 'COMPLETED' ? 'success' : a.status === 'IN_PROGRESS' ? 'info' : 'warning'}`}>{a.status === 'COMPLETED' ? 'เสร็จสิ้น' : a.status === 'IN_PROGRESS' ? 'กำลังดำเนินการ' : 'วางแผน'}</span></td><td className="numeric">{a.budget.toLocaleString('th-TH')} บาท</td><td className="numeric">{a.spent.toLocaleString('th-TH')} บาท</td></tr>)}</tbody></table></div></Card>

    <div className="two-column"><Card><div className="section-heading"><h2>Workflow</h2></div><ol className="timeline"><li className="done"><strong>จัดทำแบบร่าง</strong><small>เจ้าของโครงการ · 1 มิ.ย. 2569</small></li><li className="done"><strong>ส่งตรวจสอบ</strong><small>เจ้าหน้าที่แผนงาน · 2 มิ.ย. 2569</small></li><li className="done"><strong>อนุมัติ</strong><small>ผู้บริหาร · 3 มิ.ย. 2569</small></li><li><strong>ดำเนินการ</strong><small>อยู่ระหว่างติดตาม</small></li></ol></Card><Card><div className="section-heading"><h2>Audit ล่าสุด</h2><Link href="/projects/view" className="muted">ดูทั้งหมด</Link></div><ul className="audit-list"><li><strong>บันทึกค่าใช้จ่าย</strong><span>วันนี้ 10:24 · ผู้รับผิดชอบ</span></li><li><strong>เพิ่มหลักฐานกิจกรรม</strong><span>เมื่อวาน 15:42 · ผู้รับผิดชอบ</span></li><li><strong>อนุมัติโครงการ</strong><span>3 มิ.ย. 2569 · ผู้บริหาร</span></li></ul></Card></div>
  </div>;
}

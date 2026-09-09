import Link from 'next/link';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { BudgetSummary } from '../../components/domain/BudgetSummary';

const projects = [
  { code: 'PRJ-2569-001', name: 'โครงการส่งเสริมการอ่าน', owner: 'นางสาวณัฐริกา อุปพงษ์', source: 'เงินอุดหนุน', status: 'APPROVED' as const, budget: 100000, spent: 65000, progress: 80 },
  { code: 'PRJ-2569-002', name: 'โครงการพัฒนาทักษะดิจิทัล', owner: 'นายสมชาย ใจดี', source: 'เรียนฟรี 15 ปี', status: 'PENDING' as const, budget: 85000, spent: 12000, progress: 35 },
  { code: 'PRJ-2569-003', name: 'โครงการยกระดับผลสัมฤทธิ์ทางการเรียน', owner: 'นางสาวกมลวรรณ รักเรียน', source: 'เงินอุดหนุน', status: 'DRAFT' as const, budget: 120000, spent: 0, progress: 10 },
  { code: 'PRJ-2569-004', name: 'โครงการกิจกรรมพัฒนาผู้เรียน', owner: 'นายอนันต์ พัฒนกิจ', source: 'เรียนฟรี 15 ปี', status: 'COMPLETED' as const, budget: 70000, spent: 68500, progress: 100 },
];

const total = projects.reduce((sum, item) => sum + item.budget, 0);
const spent = projects.reduce((sum, item) => sum + item.spent, 0);

export default function ProjectsPage() {
  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Project Management</p>
          <h1>โครงการ</h1>
          <p className="muted">บริหารโครงการตั้งแต่การวางแผน งบประมาณ กิจกรรม ค่าใช้จ่าย และการอนุมัติ</p>
        </div>
        <Link className="btn btn-primary btn-md" href="/projects/edit">+ สร้างโครงการ</Link>
      </div>

      <BudgetSummary allocated={total} committed={total - spent} spent={spent} remaining={total - spent} />

      <Card>
        <div className="toolbar">
          <div className="form-field compact"><label htmlFor="project-search">ค้นหาโครงการ</label><input id="project-search" placeholder="รหัสหรือชื่อโครงการ" /></div>
          <div className="form-field compact"><label htmlFor="project-status">สถานะ</label><select id="project-status" defaultValue="ALL"><option value="ALL">ทั้งหมด</option><option value="DRAFT">แบบร่าง</option><option value="PENDING">รอตรวจสอบ</option><option value="APPROVED">อนุมัติ</option><option value="COMPLETED">เสร็จสิ้น</option></select></div>
          <div className="form-field compact"><label htmlFor="project-source">แหล่งเงิน</label><select id="project-source" defaultValue="ALL"><option value="ALL">ทั้งหมด</option><option>เงินอุดหนุน</option><option>เรียนฟรี 15 ปี</option></select></div>
        </div>
      </Card>

      <Card>
        <div className="section-heading"><div><h2>รายการโครงการ</h2><p className="muted">ปีงบประมาณ 2569 · โรงเรียน</p></div><span className="muted">{projects.length} โครงการ</span></div>
        <div className="table-wrap"><table className="data-table"><thead><tr><th>โครงการ</th><th>ผู้รับผิดชอบ</th><th>แหล่งเงิน</th><th>สถานะ</th><th className="numeric">งบประมาณ</th><th className="numeric">เบิกจ่าย</th><th>ความก้าวหน้า</th></tr></thead><tbody>
          {projects.map((project) => <tr key={project.code}><td><Link className="table-link" href="/projects/view"><strong>{project.name}</strong></Link><div className="muted">{project.code}</div></td><td>{project.owner}</td><td>{project.source}</td><td><StatusBadge status={project.status} /></td><td className="numeric">{project.budget.toLocaleString('th-TH')} บาท</td><td className="numeric">{project.spent.toLocaleString('th-TH')} บาท</td><td><div className="progress"><span style={{ width: `${project.progress}%` }} /></div><small>{project.progress}%</small></td></tr>)}
        </tbody></table></div>
      </Card>
    </div>
  );
}

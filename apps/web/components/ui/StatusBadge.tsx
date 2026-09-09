type Status = 'DRAFT' | 'SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';

const labels: Record<Status, string> = {
  DRAFT: 'แบบร่าง',
  SUBMITTED: 'ส่งแล้ว',
  PENDING: 'รอตรวจสอบ',
  APPROVED: 'อนุมัติ',
  REJECTED: 'ไม่อนุมัติ',
  COMPLETED: 'เสร็จสิ้น',
  CANCELLED: 'ยกเลิก',
};

const tone: Record<Status, string> = {
  DRAFT: 'neutral', SUBMITTED: 'info', PENDING: 'warning',
  APPROVED: 'success', REJECTED: 'danger', COMPLETED: 'success', CANCELLED: 'neutral',
};

export function StatusBadge({ status }: { status: Status }) {
  return <span className={`status status-${tone[status]}`} role="status">{labels[status]}</span>;
}

# Architecture

ระบบเป็น modular monorepo: Next.js web + NestJS API + PostgreSQL/Prisma โดยแยกโดเมน Master Data, Budget, Project, Activity, Workflow, Regulation และ AI ออกจากกัน

Budget ใช้ immutable-style ledger: ยอดคงเหลือได้จาก transaction ที่ POSTED เท่านั้น ไม่เก็บฟิลด์ balance ให้แก้โดยตรง

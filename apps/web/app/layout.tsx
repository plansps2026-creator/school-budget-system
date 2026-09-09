import './globals.css';
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="th"><body><div className="shell"><nav><a href="/dashboard">Dashboard</a><a href="/budgets">งบประมาณ</a><a href="/login">เข้าสู่ระบบ</a></nav>{children}</div></body></html>}

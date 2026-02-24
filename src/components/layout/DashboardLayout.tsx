import Sidebar from './Sidebar';
import Header from './Header';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full overflow-hidden" style={{ background: 'hsl(var(--background))' }}>
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main
                    className="flex-1 overflow-y-auto"
                    style={{
                        background: 'hsl(var(--background))',
                        backgroundImage: `
                            radial-gradient(ellipse at 20% 0%, hsl(var(--primary) / 0.03) 0%, transparent 50%),
                            radial-gradient(ellipse at 80% 100%, hsl(192 80% 60% / 0.02) 0%, transparent 50%)
                        `,
                    }}
                >
                    <div className="p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

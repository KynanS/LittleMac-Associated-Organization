import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Trophy, BarChart2, Home, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

export function Layout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const location = useLocation();

    const navItems = [
        { label: 'Home', path: '/', icon: Home },
        { label: 'LMSL Statistics', path: '/lmsl', icon: Trophy },
        { label: 'LMML Statistics', path: '/lmml', icon: BarChart2 },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
                    <div className="mr-4 flex">
                        <Link to="/" className="mr-6 flex items-center space-x-2">
                            <span className="font-bold text-xl inline-block bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
                                LMAO Analytics
                            </span>
                        </Link>
                        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        "transition-colors hover:text-foreground/80 flex items-center gap-2",
                                        location.pathname === item.path ? "text-foreground" : "text-foreground/60"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <button
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t p-4 space-y-4 bg-background">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground/80"
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                )}
            </header>
            <main className="flex-1 container py-6 max-w-screen-2xl px-4">
                <Outlet />
            </main>
            <footer className="border-t py-6 md:px-8 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built for the LittleMac Associated Organization. Data from <a href="https://liquipedia.net" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">Liquipedia</a>.
                    </p>
                </div>
            </footer>
        </div>
    );
}

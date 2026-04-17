'use client';

import { useLogoutMutation } from '@/service/auth';
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Monitor,
  Moon,
  Network,
  Puzzle,
  Rows3,
  Search,
  Settings,
  Shield,
  Sun,
  Terminal,
  User,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCrawlerOpen, setIsCrawlerOpen] = useState(false);
  const pathname = usePathname();

  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        window.location.href = '/login';
      },
    });
  };

  // Auto-expand Crawler if a sub-item is active
  useEffect(() => {
    if (pathname === '/extensions' || pathname === '/crawl-sessions') {
      setIsCrawlerOpen(true);
    }
  }, [pathname]);

  useEffect(() => {
    // Check initial scheme
    setIsDarkMode(!document.documentElement.classList.contains('light'));
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        document.body.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.body.style.colorScheme = 'light';
      }
      return newMode;
    });
  };

  interface NavItem {
    icon: React.ElementType;
    label: string;
    href?: string;
    isGroup?: boolean;
    children?: { icon: React.ElementType; label: string; href: string }[];
  }

  const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Monitor, label: 'Workers', href: '/workers' },
    {
      label: 'Crawler',
      icon: Zap,
      isGroup: true,
      children: [
        { icon: Puzzle, label: 'Extensions', href: '/extensions' },
        { icon: Rows3, label: 'Sessions', href: '/crawl-sessions' },
      ],
    },
    { icon: Shield, label: 'Security', href: '#' },
    { icon: Terminal, label: 'Logs', href: '#' },
    { icon: Settings, label: 'Settings', href: '#' },
  ];

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary/30 min-h-screen">
      {/* SideNavBar */}
      <aside
        className={`fixed left-0 top-0 h-screen border-r border-white/5 bg-[#0d1322]/80 backdrop-blur-xl z-40 hidden md:flex flex-col shadow-2xl shadow-black/50 py-8 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}
      >
        <div className={`flex items-center mb-10 h-10 ${isExpanded ? 'px-8 justify-start' : 'justify-center'}`}>
          {isExpanded ? (
            <div>
              <h1 className="text-xl font-black text-[#f97316] font-headline tracking-tighter leading-tight whitespace-nowrap">
                FLASH PICK
              </h1>
              <p className="font-headline uppercase tracking-widest text-[10px] font-bold text-slate-500 whitespace-nowrap">
                Precision Monitor
              </p>
            </div>
          ) : (
            <div className="text-xl font-black tracking-tighter text-[#f97316] drop-shadow-[0_0_8px_rgba(249,115,22,0.4)] font-headline uppercase">
              F
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-x-hidden">
          <div className="flex flex-col">
            {navItems.map((item) => {
              if (item.isGroup) {
                const isGroupActive = item.children?.some((child) => pathname === child.href);
                return (
                  <div key={item.label} className="flex flex-col">
                    <button
                      onClick={() => setIsCrawlerOpen(!isCrawlerOpen)}
                      className={`flex items-center transition-all duration-300 ease-in-out font-headline uppercase tracking-widest text-xs font-bold w-full
                        ${
                          isGroupActive
                            ? 'text-[#f97316] bg-[#f97316]/5'
                            : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                        }
                        ${isExpanded ? 'px-8 py-3' : 'justify-center mx-3 my-1 py-3 rounded-xl'}
                      `}
                    >
                      <item.icon size={20} className="shrink-0" />
                      {isExpanded && (
                        <div className="flex items-center justify-between w-full ml-4">
                          <span className="whitespace-nowrap">{item.label}</span>
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-300 ${isCrawlerOpen ? 'rotate-180' : ''}`}
                          />
                        </div>
                      )}
                    </button>

                    {/* Sub-items */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isCrawlerOpen && isExpanded ? 'max-h-40 opacity-100 mb-2' : 'max-h-0 opacity-0'
                      }`}
                    >
                      {item.children?.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`flex items-center pl-14 py-2.5 transition-all duration-200 font-headline uppercase tracking-widest text-[10px] font-bold
                              ${isChildActive ? 'text-[#f97316]' : 'text-slate-500 hover:text-slate-300'}
                            `}
                          >
                            <child.icon size={16} className="mr-3" />
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              const isActive = pathname === item.href;
              const href = item.href || '#';
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center transition-all duration-300 ease-in-out font-headline uppercase tracking-widest text-xs font-bold
                    ${
                      isActive
                        ? `text-[#f97316] bg-[#f97316]/10 ${isExpanded ? 'space-x-4 px-8 py-3 border-r-2 border-[#f97316]' : 'justify-center mx-3 my-1 py-3 rounded-xl'}`
                        : `text-slate-500 hover:text-slate-200 ${isExpanded ? 'space-x-4 px-8 py-3 hover:bg-white/5' : 'justify-center mx-3 my-1 py-3 rounded-xl hover:bg-white/10'}`
                    }`}
                >
                  <item.icon size={20} className="shrink-0" />
                  {isExpanded && <span className="ml-4 whitespace-nowrap">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5 overflow-hidden flex flex-col">
          <button
            className={`flex items-center text-slate-500 hover:text-slate-200 transition-all duration-300 ease-in-out font-headline uppercase tracking-widest text-xs font-bold ${isExpanded ? 'space-x-4 px-8 py-3 hover:bg-white/5' : 'justify-center mx-3 my-1 py-3 rounded-xl hover:bg-white/10'}`}
          >
            <HelpCircle size={20} className="shrink-0" />
            {isExpanded && <span className="whitespace-nowrap">Support</span>}
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex items-center text-slate-500 hover:text-slate-200 transition-all duration-300 ease-in-out font-headline uppercase tracking-widest text-xs font-bold ${isExpanded ? 'space-x-4 px-8 py-3 hover:bg-white/5' : 'justify-center mx-3 my-1 py-3 rounded-xl hover:bg-white/10'}`}
          >
            <LogOut size={20} className="shrink-0" />
            {isExpanded && <span className="whitespace-nowrap">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>}
          </button>

          <div className="flex items-center justify-center pt-8">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:bg-[#f97316]/20 hover:text-[#f97316] transition-all shadow-lg border border-white/10 hover:border-[#f97316]/50"
              title={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </aside>

      {/* TopNavBar */}
      <header
        className={`fixed top-0 right-0 z-30 flex items-center justify-between px-6 h-16 bg-[#0d1322]/60 backdrop-blur-md border-b border-white/5 shadow-sm shadow-black/20 transition-all duration-300 ${isExpanded ? 'left-0 md:left-64' : 'left-0 md:left-20'}`}
      >
        <div className="flex items-center gap-8">
          <span className="hidden md:block text-lg font-bold text-[#f97316] font-headline">FLASH PICK</span>
          <div className="relative group">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search resources..."
              className="bg-surface-container-high border-none rounded-full py-1.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-[#f97316]/50 w-64 transition-shadow placeholder:text-slate-500 text-white outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
            <Bell size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
            <Grid size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-white/10 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-slate-700" title="Admin User" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={`pt-24 pb-24 md:pb-8 pl-6 pr-6 transition-all duration-300 ${isExpanded ? 'md:pl-72' : 'md:pl-28'}`}
      >
        {children}
      </main>

      {/* Mobile BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-2 md:hidden bg-[#0d1322]/90 backdrop-blur-2xl h-16 rounded-t-[2rem] border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <button className="flex flex-col items-center justify-center bg-[#f97316] text-white rounded-full p-3 shadow-[0_0_20px_rgba(249,115,22,0.4)] -translate-y-4 transition-transform">
          <LayoutDashboard size={24} />
        </button>
        <button className="flex flex-col items-center justify-center text-slate-500 p-2">
          <Network size={24} />
        </button>
        <button className="flex flex-col items-center justify-center text-slate-500 p-2">
          <Bell size={24} />
        </button>
        <button className="flex flex-col items-center justify-center text-slate-500 p-2">
          <Terminal size={24} />
        </button>
        <button className="flex flex-col items-center justify-center text-slate-500 p-2">
          <User size={24} />
        </button>
      </nav>
    </div>
  );
}

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Timer,
  ChartNoAxesCombined,
  Target,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { Logo } from "@/components/ui/primitives";
import { StudyProvider } from "@/components/dashboard/study-provider";
const nav = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "My Subjects", href: "/subjects", icon: BookOpen },
  { label: "Study Sessions", href: "/sessions", icon: Timer },
  { label: "Progress", href: "/progress", icon: ChartNoAxesCombined },
  { label: "Goals", href: "/goals", icon: Target },
];
export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [mobile, setMobile] = useState(false);
  const [panel, setPanel] = useState("");
  const [query, setQuery] = useState("");
  return (
    <StudyProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <Link href="/" aria-label="StudyFlow dashboard">
          <Logo />
        </Link>
        <nav
          aria-label="Main navigation"
          className={mobile ? "main-nav open" : "main-nav"}
        >
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setMobile(false)}
              className={path === n.href ? "active" : ""}
            >
              <n.icon size={17} />
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="nav-tools">
          <button
            className="icon-button"
            aria-label="Search StudyFlow"
            aria-expanded={panel === "search"}
            onClick={() => setPanel(panel === "search" ? "" : "search")}
          >
            <Search size={20} />
          </button>
          <button
            className="icon-button notification-button"
            aria-label="Notifications"
            aria-expanded={panel === "notifications"}
            onClick={() =>
              setPanel(panel === "notifications" ? "" : "notifications")
            }
          >
            <Bell size={20} />
            <span />
          </button>
          <span className="nav-divider" />
          <button
            className="profile-button"
            aria-label="Your profile"
            aria-expanded={panel === "profile"}
            onClick={() => setPanel(panel === "profile" ? "" : "profile")}
          >
            <span className="avatar">MN</span>
            <ChevronDown size={14} />
          </button>
          <button
            className="icon-button mobile-toggle"
            aria-label={mobile ? "Close navigation" : "Open navigation"}
            aria-expanded={mobile}
            onClick={() => setMobile(!mobile)}
          >
            {mobile ? <X /> : <Menu />}
          </button>
        </div>
        {panel && (
          <div className="nav-popover">
            <div className="popover-heading">
              <strong>
                {panel === "search"
                  ? "Find your workspace"
                  : panel === "profile"
                    ? "Nguyễn Minh"
                    : "A little encouragement"}
              </strong>
              <button
                className="icon-button"
                aria-label="Close panel"
                onClick={() => setPanel("")}
              >
                <X size={18} />
              </button>
            </div>
            {panel === "search" ? (
              <>
                <input
                  autoFocus
                  placeholder="Search pages, subjects, sessions…"
                  aria-label="Search pages"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {nav
                  .filter((n) =>
                    n.label.toLowerCase().includes(query.toLowerCase()),
                  )
                  .map((n) => (
                    <Link
                      onClick={() => setPanel("")}
                      href={n.href}
                      key={n.href}
                    >
                      <n.icon size={17} />
                      {n.label}
                    </Link>
                  ))}
                {query &&
                  !nav.some((n) =>
                    n.label.toLowerCase().includes(query.toLowerCase()),
                  ) && <p>No matching pages. Try “subjects” or “goals”.</p>}
              </>
            ) : panel === "profile" ? (
              <>
                <p>Your personal study workspace</p>
                <span className="badge green">
                  Demo account · Saved on this device
                </span>
                <Link href="/welcome" onClick={() => setPanel("")}>
                  About StudyFlow
                </Link>
              </>
            ) : (
              <>
                <p>
                  <Sparkles size={18} /> You’re building a steady rhythm. Keep
                  it going.
                </p>
                <Link href="/goals" onClick={() => setPanel("")}>
                  Check in on your weekly goals
                </Link>
                <Link href="/subjects" onClick={() => setPanel("")}>
                  Give Calculus a little attention
                </Link>
              </>
            )}
          </div>
        )}
      </header>
      <main id="main" className="app-main">
        {children}
      </main>
      <footer className="app-footer">
        <Link href="/welcome">
          <Logo />
        </Link>
        <span>Progress comes from consistency, not perfection.</span>
        <div>
          <Link href="/welcome#study-tips">
            <HelpCircle size={14} /> Study tips
          </Link>
          <Link href="/welcome#privacy">Privacy</Link>
          <span>© 2026 StudyFlow</span>
        </div>
      </footer>
    </StudyProvider>
  );
}

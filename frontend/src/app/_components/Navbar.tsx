"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/items", label: "My Items" },
  { href: "/sales", label: "Sales"},
  { href: "/reports", label: "Reports" },
  { href: "/login", label: "Login"}
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="top-navbar">
      <nav className="top-navbar__inner" aria-label="Main navigation">
        <Link className="top-navbar__brand" href="/">
          Inventory Tracker
        </Link>

        <div className="top-navbar__links">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className="top-navbar__link"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

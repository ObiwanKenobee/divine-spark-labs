import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-3" aria-label="Joseph-Marie Foundation — Home">
              <div className="h-10 w-10 rounded-md flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-bold">JM</div>
              <div className="hidden sm:block">
                <span className="text-lg font-semibold leading-tight">Joseph‑Marie Foundation</span>
                <div className="text-xs text-slate-500">Discernment-as-a-Service for planetary good</div>
              </div>
            </a>
          </div>

          <nav className="hidden lg:flex lg:items-center lg:space-x-6" aria-label="Primary">
            <a href="#platform" className="text-sm font-medium text-slate-700 hover:text-slate-900">Platform</a>
            <a href="#impact" className="text-sm font-medium text-slate-700 hover:text-slate-900">Impact</a>
            <a href="#ethics" className="text-sm font-medium text-slate-700 hover:text-slate-900">Ethics</a>
            <a href="#community" className="text-sm font-medium text-slate-700 hover:text-slate-900">Community</a>

            <div className="relative">
              <button id="solutionsMenuBtn" onClick={() => setOpen((s) => !s)} className="text-sm font-medium text-slate-700 hover:text-slate-900 flex items-center gap-2" aria-expanded={open} aria-haspopup="true">
                Solutions
                <svg className="w-3 h-3 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 011.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0L5.24 8.27a.75.75 0 01-.01-1.06z" clipRule="evenodd"/></svg>
              </button>
              <div id="solutionsMenu" className={`absolute right-0 mt-3 w-72 bg-white border rounded-lg shadow-lg p-4 ${open ? "block" : "hidden"}`}>
                <a href="#discernment-api" className="block py-2 text-sm hover:bg-slate-50 rounded">Discernment API</a>
                <a href="#wisdomgraph" className="block py-2 text-sm hover:bg-slate-50 rounded">Wisdom Graph</a>
                <a href="#impact-cloud" className="block py-2 text-sm hover:bg-slate-50 rounded">Impact Cloud</a>
                <a href="#ethicsops" className="block py-2 text-sm hover:bg-slate-50 rounded">EthicsOps</a>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = '/enterprise')}>Enterprise</Button>
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = '/pricing')}>Pricing</Button>
            </div>

            <div className="ml-2">
              <Button variant="outline" size="sm" onClick={() => (window.location.href = '/auth')}>Sign In</Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

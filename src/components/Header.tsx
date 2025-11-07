import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, Globe, LogIn, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState(() => localStorage.getItem('jmf_lang') || 'en');
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('jmf_lang', lang);
  }, [lang]);

  // Fetch user's workspaces if logged in
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const userId = session.user.id;
        const { data } = await supabase
          .from('workspace_members')
          .select('workspace_id, role, workspaces(id,name,slug)')
          .eq('user_id', userId);
        if (data) {
          const ws = data.map((r: any) => r.workspaces).filter(Boolean);
          setWorkspaces(ws);
          if (ws.length > 0) setSelectedWorkspace(ws[0].id);
        }
      } catch (e) {
        console.warn('Failed to load workspaces', e);
      }
    };
    fetchWorkspaces();
  }, []);

  const onSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!search) return;
    window.location.href = `/search?q=${encodeURIComponent(search)}`;
  };

  const startSSO = (provider: string) => {
    // Prototype: redirect to auth with provider query
    window.location.href = `/auth?provider=${encodeURIComponent(provider)}`;
  };

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

          <div className="flex-1 px-4">
            <form onSubmit={onSearchSubmit} className="hidden md:flex items-center max-w-xl mx-auto">
              <div className="relative w-full">
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources, research, people..." className="w-full rounded-full border px-4 py-2 pl-10 text-sm" aria-label="Search" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </form>
          </div>

          <nav className="hidden lg:flex lg:items-center lg:space-x-6" aria-label="Primary">
            <a href="#platform" className="text-sm font-medium text-slate-700 hover:text-slate-900">Platform</a>
            <a href="#impact" className="text-sm font-medium text-slate-700 hover:text-slate-900">Impact</a>
            <a href="#ethics" className="text-sm font-medium text-slate-700 hover:text-slate-900">Ethics</a>
            <a href="#community" className="text-sm font-medium text-slate-700 hover:text-slate-900">Community</a>

            <div className="relative">
              {/* Radix DropdownMenu for accessible keyboard navigation */}
              <div>
                {/* Using native Radix DropdownMenu gives arrow-key navigation and focus management */}
                <div className="inline-block text-left">
                  <div>
                    <button onClick={() => setOpen((s) => !s)} id="solutionsMenuBtn" aria-haspopup="true" aria-expanded={open} className="text-sm font-medium text-slate-700 hover:text-slate-900 flex items-center gap-2">
                      Solutions
                      <svg className="w-3 h-3 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 011.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0L5.24 8.27a.75.75 0 01-.01-1.06z" clipRule="evenodd"/></svg>
                    </button>
                  </div>

                  <div className={`absolute right-0 mt-3 w-72 bg-white border rounded-lg shadow-lg p-2 ${open ? 'block' : 'hidden'}`} role="menu" aria-labelledby="solutionsMenuBtn">
                    <button role="menuitem" onClick={() => { window.location.hash = '#discernment-api'; setOpen(false);} } className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded">Discernment API</button>
                    <button role="menuitem" onClick={() => { window.location.hash = '#wisdomgraph'; setOpen(false);} } className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded">Wisdom Graph</button>
                    <button role="menuitem" onClick={() => { window.location.hash = '#impact-cloud'; setOpen(false);} } className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded">Impact Cloud</button>
                    <button role="menuitem" onClick={() => { window.location.hash = '#ethicsops'; setOpen(false);} } className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded">EthicsOps</button>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = '/enterprise')}>Enterprise</Button>
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = '/pricing')}>Pricing</Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center px-2">
                <Globe className="mr-2" />
                <select value={lang} onChange={(e) => setLang(e.target.value)} className="text-sm bg-transparent">
                  <option value="en">English</option>
                  <option value="sw">Kiswahili</option>
                  <option value="fr">Français</option>
                </select>
              </div>

              <div className="hidden md:flex items-center">
                <select value={selectedWorkspace || ''} onChange={(e) => setSelectedWorkspace(e.target.value)} className="text-sm bg-transparent border rounded px-2 py-1">
                  {workspaces.length === 0 && <option value="">No workspace</option>}
                  {workspaces.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => startSSO('google') }><LogIn className="mr-2" />Sign in</Button>
              </div>

              <div className="ml-2">
                <Button variant="outline" size="sm" onClick={() => (window.location.href = '/auth')}>Sign In</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

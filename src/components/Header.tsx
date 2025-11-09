import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Globe } from "lucide-react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { supabase } from "@/integrations/supabase/client";

export default function Header() {
  const navigate = useNavigate();
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
    navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  const [mobileOpen, setMobileOpen] = useState(false);

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

          <nav className="hidden md:flex md:items-center md:space-x-6" aria-label="Primary">
            <button onClick={() => navigate('/platform')} className="text-sm font-medium text-slate-700 hover:text-slate-900">Platform</button>
            <button onClick={() => navigate('/impact')} className="text-sm font-medium text-slate-700 hover:text-slate-900">Impact</button>
            <button onClick={() => navigate('/ethics')} className="text-sm font-medium text-slate-700 hover:text-slate-900">Ethics</button>
            <button onClick={() => navigate('/community')} className="text-sm font-medium text-slate-700 hover:text-slate-900">Community</button>

            <div className="relative">
              <div className="inline-block text-left">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button id="exploreMenuBtn" aria-haspopup="true" className="text-sm font-medium text-slate-700 hover:text-slate-900 flex items-center gap-2">
                      Explore
                      <svg className="w-3 h-3 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 011.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0L5.24 8.27a.75.75 0 01-.01-1.06z" clipRule="evenodd"/></svg>
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content sideOffset={8} align="end" className="absolute right-0 mt-3 w-80 bg-white border rounded-lg shadow-lg p-2 max-h-64 overflow-auto scrollbar-thin">
                      <DropdownMenu.Item className="px-3 py-2 text-sm hover:bg-slate-50 rounded" onSelect={() => navigate('/about')}>About</DropdownMenu.Item>
                      <DropdownMenu.Item className="px-3 py-2 text-sm hover:bg-slate-50 rounded" onSelect={() => navigate('/mission')}>Mission & Governance</DropdownMenu.Item>
                      <DropdownMenu.Item className="px-3 py-2 text-sm hover:bg-slate-50 rounded" onSelect={() => navigate('/women')}>Women’s Empowerment</DropdownMenu.Item>
                      <DropdownMenu.Item className="px-3 py-2 text-sm hover:bg-slate-50 rounded" onSelect={() => navigate('/labs')}>Age‑Group Labs</DropdownMenu.Item>
                      <DropdownMenu.Item className="px-3 py-2 text-sm hover:bg-slate-50 rounded" onSelect={() => navigate('/mentorship')}>Mentorship & Collaboration</DropdownMenu.Item>
                      <DropdownMenu.Item className="px-3 py-2 text-sm hover:bg-slate-50 rounded" onSelect={() => navigate('/innovation')}>Innovation Cloud</DropdownMenu.Item>
                      <DropdownMenu.Item className="px-3 py-2 text-sm hover:bg-slate-50 rounded" onSelect={() => navigate('/learning')}>Learning & Research</DropdownMenu.Item>
                      <DropdownMenu.Item className="px-3 py-2 text-sm hover:bg-slate-50 rounded" onSelect={() => navigate('/faith')}>Faith & Philosophy</DropdownMenu.Item>
                      <DropdownMenu.Item className="px-3 py-2 text-sm hover:bg-slate-50 rounded" onSelect={() => navigate('/partnerships')}>Partnerships & Investment</DropdownMenu.Item>
                      <DropdownMenu.Item className="px-3 py-2 text-sm hover:bg-slate-50 rounded" onSelect={() => navigate('/legal')}>Legal & Transparency</DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </div>

            <div className="relative">
              <div className="inline-block text-left">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button id="solutionsMenuBtn" aria-haspopup="true" className="text-sm font-medium text-slate-700 hover:text-slate-900 flex items-center gap-2">
                      Solutions
                      <svg className="w-3 h-3 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 011.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0L5.24 8.27a.75.75 0 01-.01-1.06z" clipRule="evenodd"/></svg>
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content sideOffset={8} align="end" className="absolute right-0 mt-3 w-72 bg-white border rounded-lg shadow-lg p-2 max-h-64 overflow-auto scrollbar-thin">
                      <DropdownMenu.Item className="px-3 py-2 text-sm hover:bg-slate-50 rounded" onSelect={() => navigate('/solutions#discernment-api')}>Discernment API</DropdownMenu.Item>
                        <DropdownMenu.Item className="px-3 py-2 text-sm hover:bg-slate-50 rounded" onSelect={() => navigate('/solutions#wisdomgraph')}>Wisdom Graph</DropdownMenu.Item>
                        <DropdownMenu.Item className="px-3 py-2 text-sm hover:bg-slate-50 rounded" onSelect={() => navigate('/solutions#impact-cloud')}>Impact Cloud</DropdownMenu.Item>
                        <DropdownMenu.Item className="px-3 py-2 text-sm hover:bg-slate-50 rounded" onSelect={() => navigate('/solutions#ethicsops')}>EthicsOps</DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/enterprise')}>Enterprise</Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/pricing')}>Pricing</Button>
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

              <div className="flex items-center gap-2">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button aria-label="User menu" className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent font-semibold">JM</button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content sideOffset={6} align="end" className="absolute right-0 mt-3 w-48 bg-white border rounded-lg shadow-lg p-2 max-h-64 overflow-auto scrollbar-thin">
                      <DropdownMenu.Item className="px-3 py-2 text-sm hover:bg-slate-50 rounded" onSelect={() => navigate('/auth?provider=google')}>Sign in with Google</DropdownMenu.Item>
                      <DropdownMenu.Item className="px-3 py-2 text-sm hover:bg-slate-50 rounded" onSelect={() => navigate('/auth')}>Sign in with Email</DropdownMenu.Item>
                      <DropdownMenu.Separator className="my-1" />
                      <DropdownMenu.Item className="px-3 py-2 text-sm hover:bg-slate-50 rounded" onSelect={() => navigate('/onboarding')}>Create Account</DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>

                <div className="ml-2">
                  <Button variant="outline" size="sm" onClick={() => (window.location.href = '/auth')}>Sign In</Button>
                </div>

                <div className="md:hidden ml-2">
                  <button aria-label="Open menu" className="p-2 rounded-md border" onClick={() => setMobileOpen((s) => !s)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2z" clipRule="evenodd"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden absolute left-0 right-0 top-16 bg-white border-t shadow-lg p-4 z-40">
          <div className="flex flex-col gap-2">
            <button onClick={() => { navigate('/platform'); setMobileOpen(false); }} className="py-2 px-3 rounded hover:bg-slate-50 text-left">Platform</button>
            <button onClick={() => { navigate('/impact'); setMobileOpen(false); }} className="py-2 px-3 rounded hover:bg-slate-50 text-left">Impact</button>
            <button onClick={() => { navigate('/ethics'); setMobileOpen(false); }} className="py-2 px-3 rounded hover:bg-slate-50 text-left">Ethics</button>
            <button onClick={() => { navigate('/community'); setMobileOpen(false); }} className="py-2 px-3 rounded hover:bg-slate-50 text-left">Community</button>
            <div className="border-t pt-2 mt-2">
              <div className="text-xs uppercase text-slate-500 px-3 mb-1">Explore</div>
              <button onClick={() => { navigate('/about'); setMobileOpen(false); }} className="block py-2 px-3 rounded hover:bg-slate-50 text-left">About</button>
              <button onClick={() => { navigate('/mission'); setMobileOpen(false); }} className="block py-2 px-3 rounded hover:bg-slate-50 text-left">Mission & Governance</button>
              <button onClick={() => { navigate('/women'); setMobileOpen(false); }} className="block py-2 px-3 rounded hover:bg-slate-50 text-left">Women’s Empowerment</button>
              <button onClick={() => { navigate('/labs'); setMobileOpen(false); }} className="block py-2 px-3 rounded hover:bg-slate-50 text-left">Age‑Group Labs</button>
              <button onClick={() => { navigate('/mentorship'); setMobileOpen(false); }} className="block py-2 px-3 rounded hover:bg-slate-50 text-left">Mentorship & Collaboration</button>
              <button onClick={() => { navigate('/innovation'); setMobileOpen(false); }} className="block py-2 px-3 rounded hover:bg-slate-50 text-left">Innovation Cloud</button>
              <button onClick={() => { navigate('/learning'); setMobileOpen(false); }} className="block py-2 px-3 rounded hover:bg-slate-50 text-left">Learning & Research</button>
              <button onClick={() => { navigate('/faith'); setMobileOpen(false); }} className="block py-2 px-3 rounded hover:bg-slate-50 text-left">Faith & Philosophy</button>
              <button onClick={() => { navigate('/partnerships'); setMobileOpen(false); }} className="block py-2 px-3 rounded hover:bg-slate-50 text-left">Partnerships & Investment</button>
              <button onClick={() => { navigate('/legal'); setMobileOpen(false); }} className="block py-2 px-3 rounded hover:bg-slate-50 text-left">Legal & Transparency</button>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="text-xs uppercase text-slate-500 px-3 mb-1">Solutions</div>
              <button onClick={() => { navigate('/solutions#discernment-api'); setMobileOpen(false); }} className="block py-2 px-3 rounded hover:bg-slate-50 text-left">Discernment API</button>
              <button onClick={() => { navigate('/solutions#wisdomgraph'); setMobileOpen(false); }} className="block py-2 px-3 rounded hover:bg-slate-50 text-left">Wisdom Graph</button>
              <button onClick={() => { navigate('/solutions#impact-cloud'); setMobileOpen(false); }} className="block py-2 px-3 rounded hover:bg-slate-50 text-left">Impact Cloud</button>
              <button onClick={() => { navigate('/solutions#ethicsops'); setMobileOpen(false); }} className="block py-2 px-3 rounded hover:bg-slate-50 text-left">EthicsOps</button>
            </div>
            <div className="border-t pt-2 mt-2 flex flex-col gap-2">
              <button className="py-2 px-3 rounded bg-primary text-primary-foreground" onClick={() => { navigate('/enterprise'); setMobileOpen(false); }}>Enterprise</button>
              <button className="py-2 px-3 rounded border" onClick={() => { navigate('/pricing'); setMobileOpen(false); }}>Pricing</button>
              <button className="py-2 px-3 rounded" onClick={() => { navigate('/auth'); setMobileOpen(false); }}>Sign In</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

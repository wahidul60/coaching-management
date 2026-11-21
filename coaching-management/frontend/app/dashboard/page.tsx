import { AlertTriangle, BarChart3, BookOpen, Boxes, KeyRound, Link2, Network, X } from 'lucide-react';

const quickStart = [
  { number: '1.', title: 'Create API key', text: 'Go to API Keys. Generate one key per environment.', icon: KeyRound, tone: 'pink' },
  { number: '2.', title: 'Connect providers', text: 'Add accounts in Providers. Supports OAuth, API Key, and free tiers.', icon: Boxes, tone: 'green' },
  { number: '3.', title: 'Point your client', text: 'Set base URL to http://localhost:20128/v1 in your IDE or API client.', icon: Link2, tone: 'blue' },
  { number: '4.', title: 'Monitor & optimize', text: 'Track tokens, cost and errors in Request Logs and Analytics.', icon: BarChart3, tone: 'amber' },
];

const providers = [
  ['Kiro AI', 'top-6 left-[47%]', 'violet'], ['ZenMux Free (Web)', 'top-16 left-[36%]', 'green'], ['LLM7.io', 'top-16 left-[58%]', 'violet'], ['OpenCode Free', 'top-24 left-[47%]', 'pink'], ['Kilo Code', 'top-28 left-[55%]', 'yellow'], ['Kiml Web (Moonshot AI)', 'top-28 left-[40%]', 'slate'], ['MiMoCode (Free)', 'top-36 left-[63%]', 'slate'], ['Z.ai Web (Free)', 'top-36 left-[31%]', 'blue'], ['DuckDuckGo AI Chat', 'top-44 left-[42%]', 'orange'], ['Antigravity CLI', 'top-44 left-[57%]', 'slate'],
];

const toneClasses: Record<string, string> = { pink: 'bg-[#321d32] text-[#e65687]', green: 'bg-[#153a2e] text-[#50d598]', blue: 'bg-[#162b4b] text-[#54a7ee]', amber: 'bg-[#41341a] text-[#efba4b]' };

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1160px]">
      <div className="mb-5 flex items-center justify-between"><span className="text-[12px] text-[#c4c8d0]">Home</span><div className="hidden items-center gap-2 rounded-lg border border-[#605728] bg-[#181b1e] px-3 py-2 text-[#d8d9d1] sm:flex"><AlertTriangle size={15} className="text-[#e7c851]" /><div><p className="text-[11px] font-medium">API Key Warning</p><p className="text-[10px] text-[#92959b]">1 API key(s) in warning state due to elevated failure rate in connections: main. Review to prevent rotation issues.</p></div><X size={12} className="ml-4 text-[#73767b]" /></div></div>
      <section className="rounded-xl border border-[#2a3039] bg-[#151a21] p-5 shadow-lg shadow-black/10 md:p-5">
        <div className="mb-4 flex items-center justify-between"><div><h2 className="text-[15px] font-semibold text-[#dfe2e8]">Quick Start</h2><p className="mt-1 text-[11px] text-[#858b96]">Get up and running in 4 steps. Connect providers, route models, monitor everything.</p></div><button className="hidden items-center gap-2 rounded-md border border-[#323843] px-3 py-2 text-[10px] text-[#c3c7cf] transition hover:bg-[#202630] sm:flex"><BookOpen size={14} /> Full Docs</button></div>
        <div className="grid gap-2 md:grid-cols-2">{quickStart.map(({ number, title, text, icon: Icon, tone }) => <div key={title} className="flex min-h-[63px] items-center gap-3 rounded-md border border-[#252c36] bg-[#10151d] px-3"><div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded ${toneClasses[tone]}`}><Icon size={15} /></div><div className="min-w-0"><p className="text-[12px] font-semibold text-[#d5d9e1]"><span className="mr-1 text-[#cfd3dc]">{number}</span>{title}</p><p className="truncate text-[11px] text-[#858b96]">{text.split(/(API Keys|Providers|Request Logs|Analytics)/).map((part, index) => ['API Keys', 'Providers', 'Request Logs', 'Analytics'].includes(part) ? <span key={`${part}-${index}`} className="text-[#e15082]">{part}</span> : part)}</p></div></div>)}</div>
      </section>
      <section className="mt-6 rounded-xl border border-[#2a3039] bg-[#151a21] p-5"><div className="mb-3 flex items-center justify-between"><div><h2 className="text-[15px] font-semibold text-[#dfe2e8]">Provider Topology</h2><p className="mt-1 text-[11px] text-[#858b96]">Connected providers routing through OmniRoute in real time</p></div><div className="hidden gap-3 text-[10px] text-[#a1a6b0] sm:flex"><span><i className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#43d28a]" />Active</span><span><i className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#e8b84d]" />Recent</span><span><i className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#e44c78]" />Error</span></div></div><div className="relative h-[310px] overflow-hidden rounded-lg border border-[#2a3039] bg-[#12171e]"><div className="absolute left-1/2 top-[42%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#713c59] bg-[#321c2e] shadow-[0_0_36px_rgba(209,65,127,.12)]"><div className="flex h-full flex-col items-center justify-center gap-1 text-[#e05d8b]"><Network size={18} /><span className="text-[10px] font-semibold">OmniRoute</span></div></div>{providers.map(([name, position, tone]) => <div key={name} className={`absolute ${position} hidden -translate-x-1/2 rounded-md border border-[#29313e] bg-[#0c1118] px-2 py-1 text-[9px] text-[#c3c7d0] shadow-md sm:block`}><span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${tone === 'green' ? 'bg-[#47d492]' : tone === 'pink' ? 'bg-[#df507b]' : tone === 'yellow' ? 'bg-[#e8c44f]' : 'bg-[#637bda]'}`} />{name}</div>)}</div></section>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';

interface CommandHistory {
  command: string;
  output: React.ReactNode;
}

const About: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: 'sys.init()',
      output: 'System initialized. Type "help" to see available commands.'
    }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    let output: React.ReactNode = '';
    
    switch (cmd) {
      case 'help':
        output = (
          <div className="text-white/70">
            Available commands:<br/>
            <span className="text-primary">whoami</span> - Display profile information<br/>
            <span className="text-primary">skills</span> - List technical capabilities<br/>
            <span className="text-primary">clear</span> - Clear terminal output<br/>
            <span className="text-primary">sudo hire</span> - Initiate contact protocol
          </div>
        );
        break;
      case 'whoami':
        output = 'API Engineer & Automation Specialist focusing on scalable backend systems and high-performance intelligent bots.';
        break;
      case 'skills':
        output = 'PostgreSQL, Redis, Microservices, Python, Node.js, Go, Shell Scripting, Docker, Kubernetes.';
        break;
      case 'sudo hire':
        output = (
          <a href="#contact" className="text-primary hover:underline font-bold">
            {'>>'} Redirecting to secure contact channel...
          </a>
        );
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        output = <span className="text-red-400">Command not found: {cmd}. Type "help" for a list of commands.</span>;
    }

    setHistory(prev => [...prev, { command: input, output }]);
    setInput('');
  };

  return (
    <section id="about" className="py-24 px-6 relative">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-6 grid-rows-2 gap-4 h-auto md:h-[600px]">
          
          {/* Main Intro Card - Terminal Emulator */}
          <div className="md:col-span-4 md:row-span-2 bento-card flex flex-col group bg-black border-white/20 p-0 overflow-hidden font-vt323">
            <div className="bg-white/10 px-4 py-3 flex items-center gap-2 border-b border-white/10">
               <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
               </div>
               <span className="text-white/50 text-xs ml-4">root@muh4rhq:~</span>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-black flex flex-col gap-2 text-lg">
                {history.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-primary">
                            <span className="text-white/50">$</span> {item.command}
                        </div>
                        <div className="text-white/80 pl-4">{item.output}</div>
                    </div>
                ))}
                <form onSubmit={handleCommand} className="flex items-center gap-2 mt-2 text-primary">
                    <span className="text-white/50">$</span>
                    <input 
                        type="text" 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        className="bg-transparent outline-none flex-1 text-primary w-full caret-primary"
                        autoFocus
                    />
                </form>
                <div ref={bottomRef} />
            </div>
          </div>

          {/* Skill Card 1 */}
          <div className="md:col-span-2 md:row-span-1 bento-card bg-black flex flex-col justify-between border-white/10">
             <div className="flex gap-2">
                <div className="w-2 h-2 bg-primary/40"></div>
                <div className="w-2 h-2 bg-primary/40"></div>
             </div>
             <div>
                <h3 className="text-xl font-bold mb-2 uppercase tracking-tighter">Automation</h3>
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Logic & Bot Specialist</p>
             </div>
          </div>

          {/* Location Card */}
          <div className="md:col-span-2 md:row-span-1 bento-card flex flex-col justify-between bg-black border-white/10">
             <div className="p-4 bg-white/5 border border-white/10 w-fit">
                <Globe className="w-6 h-6 text-white" />
             </div>
             <div>
                <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-1">Based in</p>
                <h3 className="text-xl font-black uppercase">Pontianak, ID</h3>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;

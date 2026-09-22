import os

# Define the replacements mapping
class_map = {
    'glass-panel-hover': 'transition-all duration-300 hover:bg-slate-800/70 hover:border-blue-400/30 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]',
    'glass-panel': 'bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]',
    'drop-zone': 'bg-slate-900/40 backdrop-blur-lg border-2 border-dashed border-blue-400/30 rounded-[2rem] transition-all duration-300 hover:border-blue-400/80 hover:bg-slate-800/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]',
    'text-gradient': 'bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent',
    'btn-primary': 'inline-flex items-center justify-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-[0_4px_15px_rgba(37,99,235,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_25px_rgba(37,99,235,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-0.5 hover:brightness-110 active:scale-95',
    'btn-ghost': 'inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-slate-300 font-semibold rounded-2xl transition-all duration-300 hover:bg-blue-400/10 hover:border-blue-400/30 hover:text-white hover:-translate-y-0.5',
    'input-premium': 'w-full bg-slate-950/70 border border-white/10 text-slate-50 rounded-2xl transition-all duration-300 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/15 focus:bg-slate-900/80 placeholder:text-slate-500 font-mono',
    'badge-glass accent animate-pulse-glow': 'inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/30 text-blue-300 text-[11px] font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse',
    'badge-glass accent': 'inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/30 text-blue-300 text-[11px] font-bold tracking-widest uppercase',
    'badge-glass': 'inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-slate-300 text-xs font-semibold tracking-wide uppercase',
    'icon-premium': 'flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 text-blue-300 rounded-2xl transition-transform duration-300',
    'nav-glass': 'bg-slate-950/80 backdrop-blur-2xl border-b border-white/5'
}

directories = [
    r"y:\QuickDrop\Frontend\src\Layout\Pages",
    r"y:\QuickDrop\Frontend\src\assets\Components"
]

import re

for dir_path in directories:
    for filename in os.listdir(dir_path):
        if filename.endswith(".jsx"):
            filepath = os.path.join(dir_path, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            new_content = content
            # We want to replace whole words only to avoid replacing parts of other classes
            # Since some keys have spaces, we'll sort keys by length descending to replace larger chunks first
            for key in sorted(class_map.keys(), key=len, reverse=True):
                val = class_map[key]
                # Regex word boundary might not work well with spaces in the key, so we do a simple replace
                # but careful not to replace already replaced content.
                # Actually, simple replace should be mostly fine as long as we don't have overlapping class names.
                # To be safe, we'll just use simple replace since our keys are very specific.
                new_content = new_content.replace(key, val)
                
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filename}")

print("Done.")

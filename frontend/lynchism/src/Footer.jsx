import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#050505] border-t border-zinc-900 pt-24 pb-12 px-10 font-mono uppercase">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1">
            <h2 className="text-white text-[22px] font-black tracking-tighter mb-6">
              ERASERHEAD
            </h2>
            <div className="space-y-1">
              <p className="text-zinc-600 text-[9px] leading-relaxed tracking-[0.3em]">
                INDUSTRIAL_STREETWEAR_LAB
              </p>
              <p className="text-zinc-600 text-[9px] leading-relaxed tracking-[0.3em]">
                DESIGNED_IN_DNIPRO // UA
              </p>
              <p className="text-zinc-700 text-[8px] mt-4 tracking-[0.1em]">
                STATUS: SYSTEM_OPERATIONAL_04
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-zinc-500 text-[10px] tracking-[0.4em] mb-2">[ SECTIONS ]</h3>
            <div className="flex flex-col gap-3">
              <a href="/shop" className="text-zinc-400 hover:text-white text-[11px] transition-all duration-300 hover:translate-x-1">Catalog</a>
              <a href="/archive" className="text-zinc-400 hover:text-white text-[11px] transition-all duration-300 hover:translate-x-1">Archive</a>
              <a href="/info" className="text-zinc-400 hover:text-white text-[11px] transition-all duration-300 hover:translate-x-1">Information</a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-zinc-500 text-[10px] tracking-[0.4em] mb-2">[ HELP_DESK ]</h3>
            <div className="flex flex-col gap-3">
              <a href="/shipping" className="text-zinc-400 hover:text-white text-[11px] transition-all duration-300 hover:translate-x-1">Shipping</a>
              <a href="/returns" className="text-zinc-400 hover:text-white text-[11px] transition-all duration-300 hover:translate-x-1">Returns</a>
              <a href="/contact" className="text-zinc-400 hover:text-white text-[11px] transition-all duration-300 hover:translate-x-1">Contact</a>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-zinc-500 text-[10px] tracking-[0.4em] mb-2">[ CONNECT ]</h3>
            <div className="flex flex-col gap-3">
              <a href="https://instagram.com" className="text-zinc-400 hover:text-white text-[11px] transition-all duration-300 hover:translate-x-1">Instagram</a>
              <a href="https://t.me" className="text-zinc-400 hover:text-white text-[11px] transition-all duration-300 hover:translate-x-1">Telegram</a>
              <a href="#" className="text-zinc-400 hover:text-white text-[11px] transition-all duration-300 hover:translate-x-1">Discord</a>
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-900 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-zinc-800 text-[8px] tracking-[0.5em] font-medium">
            © 2026 VOID_CONTROL_SYSTEMS // ALL_RIGHTS_RESERVED
          </div>
          <div className="flex gap-8 items-center">
            <div className="flex gap-1.5 grayscale opacity-30 hover:opacity-100 transition-opacity">
               <div className="w-7 h-4 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[6px] text-zinc-500">VISA</div>
               <div className="w-7 h-4 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[6px] text-zinc-500">MC</div>
               <div className="w-7 h-4 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[6px] text-zinc-500">BIT</div>
            </div>
            <span className="text-zinc-800 text-[9px] font-mono tracking-tighter italic">V.1.0.4_STABLE_BUILD</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
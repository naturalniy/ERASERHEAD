import React from 'react';
// Импортируем нужные иконки
import { 
  MagnifyingGlassIcon, 
  UserIcon, 
  ShoppingBagIcon 
} from '@heroicons/react/24/outline';
import {Link} from 'react-router-dom';

const Header = ({ cartCount }) => {
  return (
    <>
    <div className='flex bg-[#1a1a1a] p-4 justify-between items-center'>
      <div className='flex h-full items-stretch'>
        <Link to="/" className="text-white text-3xl font-[700] tracking-[0.03em] uppercase cursor-pointer">        
          Eraserhead
        </Link>
        <div className='flex items-center items-stretch text-white gap-7 ml-10 font-medium uppercase text-zinc-400 text-[13px] tracking-[0.01em] cursor-pointer'>
          <Link to="/" className='flex hover:text-zinc-200 items-center px-2'>Home</Link>
          <Link to="/catalog" className='flex hover:text-zinc-200 items-center px-2'>Catalog</Link>
          <Link to="/about" className='flex hover:text-zinc-200 items-center px-2'>About</Link>
        </div>
      </div>
      

      <div className="flex items-center gap-5">
        <button className="text-gray-400 hover:text-white transition-colors">
            <Link to="/profile">
              <UserIcon className="w-6 h-6 stroke-[1.5]" />
            </Link>
            
        </button>

        <Link to="/cart" className="relative flex items-center group cursor-pointer text-gray-400 hover:text-white transition-colors mr-4">
            <ShoppingBagIcon className="w-6 h-6 stroke-[1.5]" />
            {cartCount > 0 && (
            <span className="ml-2 text-[11px] font-bold">{cartCount}</span>
            )}
        </Link>
      </div>
    </div>
    <div className="border-t border-white/10 w-full bg-black"></div>
    </>
  );
};

export default Header;
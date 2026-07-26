import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const WebsiteLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-[#C9A227] selection:text-zinc-950">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default WebsiteLayout;

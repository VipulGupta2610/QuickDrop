import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../assets/Components/Header'
import Footer from '../assets/Components/Footer'

function AppLayout() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 font-sans selection:bg-blue-500/30 selection:text-white overflow-x-hidden relative">
      {/* Background gradients that used to be in body */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 15% 50%, rgba(37, 99, 235, 0.12) 0%, transparent 40%), radial-gradient(circle at 85% 30%, rgba(147, 51, 234, 0.1) 0%, transparent 40%)`
      }}></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default AppLayout

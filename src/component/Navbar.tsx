"use client"
import { Network } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Navbar = () => {
  const router=useRouter();
  return (
    <div>
        <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Network className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Enterprise KG</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-purple-200 hover:text-white transition-colors">Features</a>
            {/* <a href="#solutions" className="text-purple-200 hover:text-white transition-colors">Solutions</a> */}
            <a href="#pricing" className="text-purple-200 hover:text-white transition-colors">Pricing</a>
            <a href="#docs" className="text-purple-200 hover:text-white transition-colors">Docs</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-purple-200 hover:text-white transition-colors font-medium"
              onClick={()=>{router.push('/auth')}}
            >
              Sign In
            </button>
            <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl">
              Get Started
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
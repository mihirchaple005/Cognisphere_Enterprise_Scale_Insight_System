import React from 'react';
import { ArrowRight, Network, Brain, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => (
  <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-50">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Network className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">CogniSphere</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
          <Link href="/auth" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

const LandingPage = () => {
  const features = [
    {
      icon: <Network className="w-7 h-7" />,
      title: "Connected Data Intelligence",
      description: "Unify disparate data sources into a single, interconnected knowledge graph for unprecedented insights."
    },
    {
      icon: <Brain className="w-7 h-7" />,
      title: "AI-Powered Insights",
      description: "Leverage machine learning to discover hidden patterns and relationships in your enterprise data."
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Enterprise-Grade Security",
      description: "Bank-level encryption and compliance with SOC2, GDPR, and HIPAA standards."
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Lightning Fast Queries",
      description: "Sub-second query performance even on billion-node graphs with our optimized graph engine."
    }
  ];

  const stats = [
    { value: "500+", label: "Enterprise Customers" },
    { value: "10B+", label: "Data Relationships" },
    { value: "99.99%", label: "Uptime SLA" },
    { value: "50ms", label: "Avg Query Time" }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6 bg-linear-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Transform Data Into
              <span className="text-blue-500"> Connected Intelligence</span>
            </h1>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
              Build powerful knowledge graphs that unlock the hidden value in your enterprise data. 
              Connect, analyze, and discover insights at scale with our industry-leading platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 group">
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700">
                Watch Demo
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-6">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>

          {/* Hero Visual */}
          <div className="mt-16">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square bg-slate-800 rounded-lg border border-slate-700"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-6 bg-slate-900 border-y border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Build Knowledge Graphs
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Powerful features designed for enterprise-scale data management and analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-slate-700 transition-all"
              >
                <div className="w-14 h-14 bg-blue-600/10 rounded-lg flex items-center justify-center mb-5 text-blue-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id='pricing' className="py-20 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl p-12 shadow-xl">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Data?
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Join hundreds of enterprises already building with our knowledge graph platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3.5 bg-white text-blue-600 font-medium rounded-lg transition-all hover:bg-slate-50">
                Start Free Trial
              </button>
              <button className="px-8 py-3.5 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-lg transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Network className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-white">Enterprise KG</span>
              </div>
              <p className="text-slate-400 text-sm">
                Building the future of connected enterprise data
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">© 2025 Enterprise KG. All rights reserved.</p>
            <div className="flex gap-6 text-slate-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
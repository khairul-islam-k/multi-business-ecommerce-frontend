"use client";

import {
  ArrowRight,
  Calculator,
  CheckCircle,
  ClipboardList,
  Home,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Smartphone,
} from "lucide-react";

export default function WhyUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Visual Mockup */}
          <div className="relative">
            {/* Main Mockup Frame */}
            <div className="relative bg-white border border-zinc-200 rounded-xl shadow-2xl overflow-hidden">
              {/* Browser Top Bar */}
              <div className="h-11 bg-zinc-100 border-b flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="mx-auto text-xs text-zinc-500">
                  Why OneComm?
                </div>
              </div>

              {/* Mockup Content */}
              <div className="p-8">
                <h3 className="text-lg font-semibold mb-6">Why OneComm?</h3>

                {/* Three Small Cards */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                  <div className="bg-white border border-zinc-100 rounded-2xl p-5 text-center hover:border-blue-200 transition-colors group">
                    <div className="mx-auto mb-3 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Calculator className="w-7 h-7 text-blue-600" />
                    </div>
                    <p className="text-xs font-medium text-zinc-700 leading-tight">
                      Accurate GST & Tax Engine
                    </p>
                  </div>

                  <div className="bg-white border border-zinc-100 rounded-2xl p-5 text-center hover:border-blue-200 transition-colors group">
                    <div className="mx-auto mb-3 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Package className="w-7 h-7 text-blue-600" />
                    </div>
                    <p className="text-xs font-medium text-zinc-700 leading-tight">
                      Advanced Warehouse Management
                    </p>
                  </div>

                  <div className="bg-white border border-zinc-100 rounded-2xl p-5 text-center hover:border-blue-200 transition-colors group">
                    <div className="mx-auto mb-3 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <LayoutDashboard className="w-7 h-7 text-blue-600" />
                    </div>
                    <p className="text-xs font-medium text-zinc-700 leading-tight">
                      Unified Omnichannel Dashboard
                    </p>
                  </div>
                </div>

                {/* Circular Diagram */}
                <div className="relative h-80 flex items-center justify-center">
                  <div className="relative w-72 h-72">
                    <div className="relative w-[300px] h-[300px]">
                      {/* Dashed Circle */}
                      <div className="absolute inset-0 border-[3px] border-dashed border-zinc-300 rounded-full" />

                      {/* Center Icon */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-200 rounded-2xl flex items-center justify-center shadow-lg">
                        <ShoppingCart className="w-12 h-12 text-white" />
                      </div>

                      {/* Orbiting Icons */}
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-2xl shadow flex items-center justify-center border border-zinc-200 hover:scale-110 transition-transform">
                        <Home className="w-6 h-6 text-zinc-700" />
                      </div>
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-2xl shadow flex items-center justify-center border border-zinc-200 hover:scale-110 transition-transform">
                        <Package className="w-6 h-6 text-zinc-700" />
                      </div>
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-2xl shadow flex items-center justify-center border border-zinc-200 hover:scale-110 transition-transform">
                        <ClipboardList className="w-6 h-6 text-zinc-700" />
                      </div>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-2xl shadow flex items-center justify-center border border-zinc-200 hover:scale-110 transition-transform">
                        <Smartphone className="w-6 h-6 text-zinc-700" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Green Card */}
            <div className="absolute -bottom-12 -right-4 bg-blue-600 text-white rounded-3xl p-8 shadow-2xl w-72">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/20 p-3 rounded-2xl">
                  <ShoppingCart className="w-8 h-8" />
                </div>
              </div>
              <h4 className="text-2xl font-bold leading-tight mb-6">
                Catering to upscale
                <br />
                eCommerce in Bangladesh
              </h4>
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Sell
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Reconcile
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Grow
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-10">
            <div>
              <span className="text-blue-600 font-semibold tracking-widest text-sm">
                WHY ONECOMM?
              </span>
              <h2 className="text-5xl font-bold text-zinc-900 leading-tight mt-4">
                Ecommerce solutions that can boost your digital revenue
              </h2>
            </div>

            <p className="text-zinc-600 text-lg leading-relaxed max-w-md">
              Choosing OneComm is choosing robust security protocols to
              safeguard your eCommerce data from breaches. Our automated
              inventory management, reporting analytics and AI engines coupled
              with 220+ integrations can guarantee consistent growth to your
              business.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white border border-zinc-100 rounded-3xl p-8">
                <div className="text-5xl font-bold text-blue-600">20%</div>
                <p className="text-zinc-600 mt-2">Increase in profit margin</p>
              </div>
              <div className="bg-white border border-zinc-100 rounded-3xl p-8">
                <div className="text-5xl font-bold text-blue-600">1.5X</div>
                <p className="text-zinc-600 mt-2">Revenue growth</p>
              </div>
            </div>

            <button className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white! px-9 py-4 rounded-full font-medium text-base transition-colors">
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

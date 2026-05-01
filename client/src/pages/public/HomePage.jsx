import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { CheckCircle2, Truck, Sparkles, Clock } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-900 to-blue-700 text-white flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Premium Laundry Services Delivered to Your Door
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-lg">
              FreshPress takes the hassle out of laundry day. Professional cleaning, careful folding, and timely delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-8 py-4 rounded-lg text-center transition-colors text-lg shadow-lg">
                Get Started
              </Link>
              <Link to="/login" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-medium px-8 py-4 rounded-lg text-center transition-colors text-lg">
                Log In to Account
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&q=80&w=1000" 
              alt="Fresh Laundry" 
              className="rounded-2xl shadow-2xl object-cover h-[500px] w-full"
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How FreshPress Works</h2>
            <p className="mt-4 text-lg text-slate-600">Three simple steps to fresh, clean clothes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: <CheckCircle2 className="w-10 h-10 text-blue-600" />, title: "1. Place an Order", desc: "Select your garments and schedule a pickup time that works for you." },
              { icon: <Sparkles className="w-10 h-10 text-blue-600" />, title: "2. We Clean It", desc: "Our professionals carefully wash, dry, and fold your items with premium products." },
              { icon: <Truck className="w-10 h-10 text-blue-600" />, title: "3. Fast Delivery", desc: "Your fresh clothes are delivered back to your door within 72 hours." }
            ].map((step, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
                <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <p>&copy; {new Date().getFullYear()} FreshPress Laundry. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;

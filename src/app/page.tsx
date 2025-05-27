'use client';
import { useState, useEffect } from 'react';
import { Clock, Mail, Bell } from 'lucide-react';
import Image from 'next/image';

export default function ComingSoon() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Launch date - set to a future date
  const launchDate = new Date('2025-07-01T00:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = launchDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubscribed(true);
        setEmail('');
      } else {
        alert(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <Image
              src="/logo.png"
              alt="AtlanticDunes Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            AtlanticDunes
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Enterprise insights and innovation
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {value.toString().padStart(2, '0')}
                </div>
                <div className="text-xs sm:text-sm text-gray-300 capitalize">
                  {unit}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center text-gray-400 text-sm">
            <Clock className="w-4 h-4 mr-2" />
            Until launch
          </div>
        </div>

        {/* Email Subscription */}
        <div className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
            Get notified when we launch
          </h2>
          
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-200 transform hover:scale-105"
              >
                Notify Me
              </button>
            </form>
          ) : (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center justify-center text-green-400">
                <Bell className="w-5 h-5 mr-2" />
                Thank you! We'll notify you when we launch.
              </div>
            </div>
          )}
        </div>

        {/* Admin Access */}
        <div className="text-center">
          <a
            href="/admin/login"
            className="block text-gray-400 hover:text-white text-sm transition-colors duration-200 underline"
          >
            Admin Access
          </a>
        </div>
      </div>
    </div>
  );
}


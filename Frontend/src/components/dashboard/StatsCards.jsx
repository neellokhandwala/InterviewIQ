import React from 'react';
import { Users, Zap } from 'lucide-react';

export default function StatsCards({ activeSessions, totalSessions }) {
  const stats = [
    {
      icon: Users,
      label: 'Active Sessions',
      value: activeSessions,
      color: 'from-emerald-500 to-teal-600',
      lightColor: 'from-emerald-500/10 to-teal-600/10',
    },
    {
      icon: Zap,
      label: 'Total Sessions',
      value: totalSessions,
      color: 'from-blue-500 to-cyan-600',
      lightColor: 'from-blue-500/10 to-cyan-600/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animation-fade-in animation-delay-100">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105"
          >
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl" />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.lightColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            {/* Glow effect on hover */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`} />

            {/* Content */}
            <div className="relative flex items-center justify-between">
              <div className="flex-1">
                <p className="text-slate-400 text-sm font-medium mb-2">{stat.label}</p>
                <p className="text-4xl md:text-5xl font-bold text-white">
                  {stat.value}
                </p>
              </div>

              {/* Icon */}
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg shadow-current/30 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
            </div>

            {/* Bottom accent line */}
            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.color} w-0 group-hover:w-full transition-all duration-500`} />
          </div>
        );
      })}
    </div>
  );
}

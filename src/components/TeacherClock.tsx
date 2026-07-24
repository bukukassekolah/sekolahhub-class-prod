import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sparkles } from 'lucide-react';

export const TeacherClock: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Time-based motivational greeting for TK/SD teachers
  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 11) return 'Selamat pagi Guru Hebat! Siap mendampingi tumbuh kembang si kecil hari ini? 🌟';
    if (hour < 15) return 'Selamat siang! Tetap semangat mendampingi aktivitas kelas hari ini. 🎨';
    if (hour < 18) return 'Selamat sore! Waktunya merekap administrasi dan jurnal mengajar. 📝';
    return 'Selamat malam! Rehat sejenak untuk persiapan kelas esok hari. 🌙';
  };

  return (
    <div id="teacher-clock-card" className="bg-[#5A5A40] text-[#FDFCF9] rounded-2xl p-5 md:p-6 shadow-md relative overflow-hidden border border-[#464632]">
      <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
        <Clock className="w-56 h-56 text-[#FDFCF9]" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#E9E5D9] text-sm font-medium mb-1">
            <Calendar className="w-4 h-4 text-[#A4AC86]" />
            <span>{formatDate(time)}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#FDFCF9] mb-2">
            Jam Digital Administrasi Guru
          </h2>
          <p className="text-xs md:text-sm text-[#E9E5D9]/90 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#DDBEA9] shrink-0" />
            <span>{getGreeting()}</span>
          </p>
        </div>

        <div className="bg-[#464632]/80 backdrop-blur-md rounded-xl px-5 py-3 border border-[#6E6E51]/60 self-start md:self-auto text-center min-w-[170px]">
          <div className="text-xs text-[#E9E5D9] font-medium uppercase tracking-wider mb-0.5">
            Waktu Real-time
          </div>
          <div className="text-2xl md:text-3xl font-mono font-bold text-[#FFE8D6] tracking-wider">
            {formatTime(time)}
          </div>
        </div>
      </div>
    </div>
  );
};

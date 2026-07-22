import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ReportsView } from './ReportsView';

export const Laporan: React.FC = () => {
  const { teacherProfile, students, attendance, notes } = useAuth();
  const [toastMsg, setToastMsg] = useState<{ type: string; text: string } | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', msg: string) => {
    setToastMsg({ type, text: msg });
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div>
      {toastMsg && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold animate-fade-in">
          {toastMsg.text}
        </div>
      )}
      <ReportsView
        profile={teacherProfile}
        students={students}
        attendanceRecords={attendance}
        notes={notes}
        showToast={showToast}
      />
    </div>
  );
};

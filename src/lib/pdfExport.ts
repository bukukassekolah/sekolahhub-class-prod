import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student, AttendanceRecord, TeacherNote, TeacherProfile } from '../types';

export function generateStudentsPDF(profile: TeacherProfile, students: Student[]) {
  const doc = new jsPDF();
  
  // Header / KOP
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(profile.schoolName || 'SEKOLAHHUB CLASS BASIC', 105, 18, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`LAPORAN DAFTAR SISWA - ${profile.className || 'Kelas'}`, 105, 25, { align: 'center' });
  doc.text(`Tahun Pelajaran: ${profile.academicYear} | Semester: ${profile.semester}`, 105, 31, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.line(14, 35, 196, 35);

  doc.setFontSize(10);
  doc.text(`Wali Kelas / Guru: ${profile.teacherName}`, 14, 42);
  doc.text(`Total Siswa: ${students.length} (${students.filter(s => s.gender === 'L').length} L, ${students.filter(s => s.gender === 'P').length} P)`, 196, 42, { align: 'right' });

  // Table
  const tableData = students.map((s, idx) => [
    (idx + 1).toString(),
    s.nis || '-',
    s.name,
    s.gender === 'L' ? 'Laki-laki' : 'Perempuan',
    s.parentName || '-',
    s.parentWhatsapp || '-',
    s.address || '-',
    s.isActive ? 'Aktif' : 'Nonaktif'
  ]);

  autoTable(doc, {
    startY: 47,
    head: [['No', 'NIS/NISN', 'Nama Siswa', 'JK', 'Nama Orang Tua', 'No. WhatsApp', 'Alamat', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 22 },
      2: { cellWidth: 35 },
      3: { cellWidth: 18, halign: 'center' },
      4: { cellWidth: 28 },
      5: { cellWidth: 25 },
      6: { cellWidth: 32 },
      7: { cellWidth: 15, halign: 'center' },
    }
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 150;
  doc.setFontSize(9);
  doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, finalY + 15);
  doc.text(`${profile.teacherName}`, 150, finalY + 30, { align: 'center' });
  doc.text('_______________________', 150, finalY + 31, { align: 'center' });
  doc.text('Guru / Wali Kelas', 150, finalY + 36, { align: 'center' });

  doc.save(`Daftar_Siswa_${profile.className.replace(/\s+/g, '_')}.pdf`);
}

export function generateAttendancePDF(
  profile: TeacherProfile, 
  students: Student[], 
  attendanceRecords: AttendanceRecord[], 
  monthYearStr: string // YYYY-MM
) {
  const doc = new jsPDF({ orientation: 'landscape' });
  const [yearStr, monthNumStr] = monthYearStr.split('-');
  const monthName = new Date(parseInt(yearStr), parseInt(monthNumStr) - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  // Header / KOP
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(profile.schoolName || 'SEKOLAHHUB CLASS BASIC', 148, 18, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`REKAPITULASI PRESENSI KEHADIRAN SISWA - ${profile.className || 'Kelas'}`, 148, 25, { align: 'center' });
  doc.text(`Bulan: ${monthName} | Tahun Pelajaran: ${profile.academicYear}`, 148, 31, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.line(14, 35, 283, 35);

  doc.setFontSize(10);
  doc.text(`Guru Kelas: ${profile.teacherName}`, 14, 42);

  // Summarize per student
  const tableData = students.map((s, idx) => {
    const studentRecs = attendanceRecords.filter(r => r.studentId === s.id && r.date.startsWith(monthYearStr));
    const hadir = studentRecs.filter(r => r.status === 'Hadir').length;
    const izin = studentRecs.filter(r => r.status === 'Izin').length;
    const sakit = studentRecs.filter(r => r.status === 'Sakit').length;
    const alfa = studentRecs.filter(r => r.status === 'Alfa').length;
    const totalRecorded = hadir + izin + sakit + alfa;
    const percent = totalRecorded > 0 ? Math.round((hadir / totalRecorded) * 100) : 0;

    return [
      (idx + 1).toString(),
      s.nis || '-',
      s.name,
      s.gender,
      hadir.toString(),
      izin.toString(),
      sakit.toString(),
      alfa.toString(),
      `${percent}%`
    ];
  });

  autoTable(doc, {
    startY: 46,
    head: [['No', 'NIS/NISN', 'Nama Siswa', 'JK', 'Hadir (H)', 'Izin (I)', 'Sakit (S)', 'Alfa (A)', '% Kehadiran']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 35 },
      2: { cellWidth: 75 },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 25, halign: 'center' },
      5: { cellWidth: 25, halign: 'center' },
      6: { cellWidth: 25, halign: 'center' },
      7: { cellWidth: 25, halign: 'center' },
      8: { cellWidth: 25, halign: 'center' },
    }
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 140;
  doc.setFontSize(9);
  doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, finalY + 15);
  doc.text(`${profile.teacherName}`, 230, finalY + 25, { align: 'center' });
  doc.text('_______________________', 230, finalY + 26, { align: 'center' });
  doc.text('Guru / Wali Kelas', 230, finalY + 31, { align: 'center' });

  doc.save(`Rekap_Kehadiran_${monthYearStr}_${profile.className.replace(/\s+/g, '_')}.pdf`);
}

export function generateNotesPDF(profile: TeacherProfile, notes: TeacherNote[]) {
  const doc = new jsPDF();
  
  // Header / KOP
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(profile.schoolName || 'SEKOLAHHUB CLASS BASIC', 105, 18, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`JURNAL & CATATAN HARIAN GURU - ${profile.className || 'Kelas'}`, 105, 25, { align: 'center' });
  doc.text(`Tahun Pelajaran: ${profile.academicYear}`, 105, 31, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.line(14, 35, 196, 35);

  doc.setFontSize(10);
  doc.text(`Guru Kelas: ${profile.teacherName}`, 14, 42);

  const tableData = notes.map((n, idx) => [
    (idx + 1).toString(),
    n.date,
    n.category,
    n.title,
    n.content
  ]);

  autoTable(doc, {
    startY: 46,
    head: [['No', 'Tanggal', 'Kategori', 'Judul Catatan', 'Isi Catatan / Jurnal']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 25 },
      2: { cellWidth: 32 },
      3: { cellWidth: 40 },
      4: { cellWidth: 75 },
    }
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 150;
  doc.setFontSize(9);
  doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, finalY + 15);
  doc.text(`${profile.teacherName}`, 150, finalY + 30, { align: 'center' });
  doc.text('_______________________', 150, finalY + 31, { align: 'center' });
  doc.text('Guru / Wali Kelas', 150, finalY + 36, { align: 'center' });

  doc.save(`Catatan_Guru_${profile.className.replace(/\s+/g, '_')}.pdf`);
}

import { EducationLevel } from '../types';

/**
 * Mapping mata pelajaran / aspek penilaian berdasarkan Jenjang Pendidikan.
 * Dibuat extensible untuk kemudahan penambahan jenjang baru (SMP, SMA, SMK, dll).
 */
export const LEVEL_SUBJECTS_MAP: Record<string, string[]> = {
  // Jenjang TK / PAUD / RA
  PAUD: [
    'Nilai Agama & Budi Pekerti',
    'Fisik Motorik',
    'Kognitif',
    'Bahasa',
    'Sosial Emosional',
    'Seni'
  ],
  TK: [
    'Nilai Agama & Budi Pekerti',
    'Fisik Motorik',
    'Kognitif',
    'Bahasa',
    'Sosial Emosional',
    'Seni'
  ],
  RA: [
    'Nilai Agama & Budi Pekerti',
    'Fisik Motorik',
    'Kognitif',
    'Bahasa',
    'Sosial Emosional',
    'Seni'
  ],

  // Jenjang SD / MI
  SD: [
    'Pendidikan Agama',
    'PPKn',
    'Bahasa Indonesia',
    'Matematika',
    'IPAS',
    'Seni Budaya',
    'PJOK',
    'Bahasa Inggris',
    'Muatan Lokal'
  ],
  MI: [
    'Pendidikan Agama',
    'PPKn',
    'Bahasa Indonesia',
    'Matematika',
    'IPAS',
    'Seni Budaya',
    'PJOK',
    'Bahasa Inggris',
    'Muatan Lokal'
  ],

  // Jenjang SMP / MTs (Extensible)
  SMP: [
    'Pendidikan Agama & Budi Pekerti',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Matematika',
    'IPA',
    'IPS',
    'Bahasa Inggris',
    'Seni Budaya',
    'PJOK',
    'Informatika',
    'Muatan Lokal'
  ],
  MTS: [
    'Pendidikan Agama & Budi Pekerti',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Matematika',
    'IPA',
    'IPS',
    'Bahasa Inggris',
    'Seni Budaya',
    'PJOK',
    'Informatika',
    'Muatan Lokal'
  ],

  // Jenjang SMA / MA / SMK (Extensible)
  SMA: [
    'Pendidikan Agama',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Matematika',
    'Bahasa Inggris',
    'Fisika',
    'Kimia',
    'Biologi',
    'Ekonomi',
    'Sosiologi',
    'Geografi',
    'Seni Budaya',
    'PJOK',
    'Informatika'
  ],
  MA: [
    'Pendidikan Agama',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Matematika',
    'Bahasa Inggris',
    'Fisika',
    'Kimia',
    'Biologi',
    'Ekonomi',
    'Sosiologi',
    'Geografi',
    'Seni Budaya',
    'PJOK',
    'Informatika'
  ],
  SMK: [
    'Pendidikan Agama',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Matematika',
    'Bahasa Inggris',
    'Kejuruan',
    'Proyek IPAS',
    'Seni Budaya',
    'PJOK',
    'Informatika'
  ]
};

export const DEFAULT_SUBJECTS = LEVEL_SUBJECTS_MAP.TK;

/**
 * Membaca daftar mata pelajaran/kategori tab berdasarkan jenjang kelas.
 */
export function getSubjectsByLevel(level?: EducationLevel | string): string[] {
  if (!level) return DEFAULT_SUBJECTS;
  const key = level.trim().toUpperCase();

  if (LEVEL_SUBJECTS_MAP[key]) {
    return LEVEL_SUBJECTS_MAP[key];
  }

  // Fallback pattern matching
  if (key.includes('TK') || key.includes('PAUD') || key.includes('RA')) {
    return LEVEL_SUBJECTS_MAP.TK;
  }
  if (key.includes('SD') || key.includes('MI')) {
    return LEVEL_SUBJECTS_MAP.SD;
  }
  if (key.includes('SMP') || key.includes('MTS')) {
    return LEVEL_SUBJECTS_MAP.SMP;
  }
  if (key.includes('SMA') || key.includes('MA') || key.includes('SMK')) {
    return LEVEL_SUBJECTS_MAP.SMA;
  }

  return DEFAULT_SUBJECTS;
}

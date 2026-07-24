import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Trash2, X } from 'lucide-react';
import { StudentProfile } from '../types';

interface StudentAvatarProps {
  student: StudentProfile;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCameraButton?: boolean;
  onPhotoChange?: (newPhotoUrl: string) => void;
  className?: string;
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({
  student,
  size = 'md',
  showCameraButton = true,
  onPhotoChange,
  className = ''
}) => {
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper to compute initials from student name
  const getInitials = (fullName: string, nickname?: string) => {
    const name = fullName.trim() || nickname?.trim() || 'S';
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(student.fullName, student.nickname);

  // Size mapping
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-16 h-16 text-lg'
  }[size];

  const cameraIconSizes = {
    sm: 'w-2.5 h-2.5 p-0.5',
    md: 'w-3 h-3 p-1',
    lg: 'w-3.5 h-3.5 p-1',
    xl: 'w-4 h-4 p-1'
  }[size];

  // Crop image element/video to 1:1 square canvas & convert to base64 JPEG
  const processAndSaveImage = (imageSource: HTMLImageElement | HTMLVideoElement) => {
    const canvas = document.createElement('canvas');
    const targetSize = 300;
    canvas.width = targetSize;
    canvas.height = targetSize;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    let srcWidth = 0;
    let srcHeight = 0;

    if (imageSource instanceof HTMLVideoElement) {
      srcWidth = imageSource.videoWidth;
      srcHeight = imageSource.videoHeight;
    } else {
      srcWidth = imageSource.naturalWidth || imageSource.width;
      srcHeight = imageSource.naturalHeight || imageSource.height;
    }

    if (!srcWidth || !srcHeight) return;

    // Calculate center crop 1:1
    const minDim = Math.min(srcWidth, srcHeight);
    const sx = (srcWidth - minDim) / 2;
    const sy = (srcHeight - minDim) / 2;

    ctx.drawImage(imageSource, sx, sy, minDim, minDim, 0, 0, targetSize, targetSize);

    const base64Photo = canvas.toDataURL('image/jpeg', 0.85);
    if (onPhotoChange) {
      onPhotoChange(base64Photo);
    }
    closeAll();
  };

  // 1. Start Camera
  const handleStartCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Kamera tidak dapat diakses. Silakan pilih foto dari galeri.');
    }
  };

  // Stop Camera stream
  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Capture Frame from Camera
  const handleCapturePhoto = () => {
    if (videoRef.current) {
      processAndSaveImage(videoRef.current);
    }
  };

  // 2. Select from Gallery
  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        processAndSaveImage(img);
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  // 3. Delete Photo
  const handleDeletePhoto = () => {
    if (onPhotoChange) {
      onPhotoChange('');
    }
    closeAll();
  };

  const closeAll = () => {
    stopCameraStream();
    setIsOpenBottomSheet(false);
    setCameraError(null);
  };

  const hasCustomPhoto = Boolean(
    student.photoUrl &&
    student.photoUrl.trim() !== '' &&
    !student.photoUrl.includes('unsplash.com')
  );

  return (
    <>
      <div className={`relative inline-block shrink-0 ${className}`}>
        {/* Avatar Image or Initial Circle */}
        <div
          className={`${sizeClasses} rounded-2xl overflow-hidden flex items-center justify-center font-bold shadow-xs border transition-transform ${
            hasCustomPhoto
              ? 'bg-stone-100 border-stone-200'
              : student.gender === 'P'
              ? 'bg-pink-100 text-pink-900 border-pink-200/90'
              : 'bg-emerald-100 text-emerald-900 border-emerald-200/90'
          }`}
        >
          {hasCustomPhoto ? (
            <img
              src={student.photoUrl}
              alt={student.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="tracking-wider select-none font-extrabold">{initials}</span>
          )}
        </div>

        {/* Camera Button at Bottom Right */}
        {showCameraButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpenBottomSheet(true);
            }}
            id={`btn-camera-avatar-${student.id}`}
            className="absolute -bottom-1 -right-1 bg-emerald-800 hover:bg-emerald-700 active:scale-90 text-white rounded-full border-2 border-white shadow-md transition-all z-10 flex items-center justify-center cursor-pointer"
            title="Ubah Foto Siswa"
          >
            <Camera className={cameraIconSizes} />
          </button>
        )}
      </div>

      {/* Hidden File Input for Gallery */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleGallerySelect}
        className="hidden"
      />

      {/* Bottom Sheet / Camera Modal */}
      {isOpenBottomSheet && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 border border-stone-200 shadow-2xl relative animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-sm text-stone-900">
                  Foto Profil Siswa
                </h3>
              </div>
              <button
                type="button"
                onClick={closeAll}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student Name Indicator */}
            <div className="text-xs font-semibold text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>{student.fullName} ({student.nickname})</span>
            </div>

            {/* If Camera is Active */}
            {isCameraActive ? (
              <div className="space-y-3">
                <div className="relative bg-black rounded-2xl overflow-hidden aspect-square flex items-center justify-center border border-stone-800 shadow-inner">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Viewfinder Overlay */}
                  <div className="absolute inset-4 border-2 border-dashed border-white/60 rounded-2xl pointer-events-none flex items-center justify-center">
                    <span className="text-[10px] text-white/90 bg-black/50 px-2.5 py-1 rounded-full font-medium">
                      Posisikan Wajah Siswa
                    </span>
                  </div>
                </div>

                {cameraError && (
                  <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    {cameraError}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={stopCameraStream}
                    className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors"
                  >
                    Batal Kamera
                  </button>
                  <button
                    type="button"
                    onClick={handleCapturePhoto}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Ambil Foto</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Bottom Sheet Menu Options */
              <div className="space-y-2 pt-1">
                {/* Option 1: Ambil Foto */}
                <button
                  type="button"
                  onClick={handleStartCamera}
                  className="w-full p-3.5 rounded-2xl bg-stone-50 hover:bg-emerald-50 text-stone-800 hover:text-emerald-900 border border-stone-200 hover:border-emerald-300 font-semibold text-xs flex items-center gap-3 transition-all text-left shadow-2xs group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-200 transition-colors">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900">Ambil Foto</div>
                    <div className="text-[11px] text-stone-500 font-normal">Gunakan kamera perangkat langsung</div>
                  </div>
                </button>

                {/* Option 2: Pilih dari Galeri */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-3.5 rounded-2xl bg-stone-50 hover:bg-blue-50 text-stone-800 hover:text-blue-900 border border-stone-200 hover:border-blue-300 font-semibold text-xs flex items-center gap-3 transition-all text-left shadow-2xs group"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-colors">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900">Pilih dari Galeri</div>
                    <div className="text-[11px] text-stone-500 font-normal">Unggah foto dari galeri HP/Laptop</div>
                  </div>
                </button>

                {/* Option 3: Hapus Foto (if custom photo exists) */}
                {hasCustomPhoto && (
                  <button
                    type="button"
                    onClick={handleDeletePhoto}
                    className="w-full p-3.5 rounded-2xl bg-rose-50/70 hover:bg-rose-100 text-rose-900 border border-rose-200 font-semibold text-xs flex items-center gap-3 transition-all text-left shadow-2xs group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 group-hover:bg-rose-200 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-rose-900">Hapus Foto</div>
                      <div className="text-[11px] text-rose-600 font-normal">Kembalikan ke avatar inisial default</div>
                    </div>
                  </button>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={closeAll}
                    className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

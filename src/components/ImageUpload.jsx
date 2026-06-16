import React, { useRef, useCallback } from 'react'
import useKitchenStore from '../store/useKitchenStore'

export default function ImageUpload({ compact = false }) {
  const { referenceImage, setReferenceImage } = useKitchenStore()
  const inputRef = useRef()

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => setReferenceImage(e.target.result)
    reader.readAsDataURL(file)
  }, [setReferenceImage])

  const handleChange = (e) => {
    handleFile(e.target.files[0])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all"
          style={{
            background: 'rgba(255,255,255,0.1)',
            color: '#ccc',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
          title="Upload reference photo"
        >
          <span>📷</span>
          <span>Upload Photo</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
        {referenceImage && (
          <div className="relative">
            <img
              src={referenceImage}
              alt="Reference"
              className="w-full rounded-lg object-cover"
              style={{ height: '80px' }}
            />
            <button
              onClick={() => setReferenceImage(null)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              ×
            </button>
            <div className="absolute bottom-0 left-0 right-0 text-xs text-center text-white py-0.5 rounded-b-lg"
              style={{ background: 'rgba(0,0,0,0.5)' }}>
              Reference Photo
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
        style={{ background: 'rgba(255,255,255,0.03)' }}
      >
        <div className="text-3xl mb-2">📷</div>
        <div className="text-sm font-medium text-gray-300">
          Drop a kitchen photo here
        </div>
        <div className="text-xs text-gray-500 mt-1">
          or click to browse
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      {referenceImage && (
        <div className="relative">
          <img
            src={referenceImage}
            alt="Reference"
            className="w-full rounded-xl object-cover"
            style={{ maxHeight: '150px' }}
          />
          <button
            onClick={() => setReferenceImage(null)}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white text-sm flex items-center justify-center font-bold hover:bg-red-600 transition-colors"
          >
            ×
          </button>
          <div
            className="absolute bottom-0 left-0 right-0 text-xs text-center text-white py-1 rounded-b-xl"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            Reference Photo — shown on back wall in 3D
          </div>
        </div>
      )}
    </div>
  )
}

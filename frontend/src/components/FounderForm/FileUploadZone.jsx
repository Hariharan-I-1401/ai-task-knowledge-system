import React, { useState } from 'react';
import { UploadCloud, FileCheck, AlertTriangle } from 'lucide-react';

const FileUploadZone = ({ onFileSelected, selectedFile }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDragOverLeave = (e) => {
    e.preventDefault();
    setDragActive(e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleManualSelectionChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2 max-w-xl mx-auto">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block">
        Supporting Documentation / Pitch Deck (PDF preferred)
      </label>
      
      <div
        onDragOver={handleDragOverLeave}
        onDragLeave={handleDragOverLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
          dragActive 
            ? "border-blue-500 bg-blue-500/5" 
            : selectedFile 
              ? "border-emerald-500/40 bg-emerald-500/5" 
              : "border-slate-800 hover:border-slate-700 bg-[#131B2E]"
        }`}
      >
        <input
          type="file"
          id="file-upload-input"
          accept=".pdf,.doc,.docx"
          onChange={handleManualSelectionChange}
          className="hidden"
        />
        
        <label htmlFor="file-upload-input" className="cursor-pointer w-full flex flex-col items-center">
          {selectedFile ? (
            <>
              <FileCheck className="h-10 w-10 text-emerald-400 mb-3" />
              <span className="text-xs font-bold text-white block truncate max-w-xs">{selectedFile.name}</span>
              <span className="text-[10px] text-slate-400 mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready</span>
            </>
          ) : (
            <>
              <UploadCloud className="h-10 w-10 text-slate-500 mb-3" />
              <span className="text-xs font-bold text-slate-300 block">Drag & drop your files here</span>
              <span className="text-[10px] text-slate-500 mt-1">or click to browse local storage (Max 15MB)</span>
            </>
          )}
        </label>
      </div>
    </div>
  );
};

export default FileUploadZone;
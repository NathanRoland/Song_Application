import React, { useState, useRef } from "react";
import axios from "axios";

function DubFinder() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setUploadResult(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setError(null);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await axios.post('http://localhost:5000/dubfinder/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResult(response.data);
      
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>DubFinder</h2>
      <p style={{ textAlign: "center", color: "#666", marginBottom: 32 }}>
        Upload an audio file to find similar songs and releases
      </p>

      {/* File Upload Area */}
      <div
        style={{
          border: `2px dashed ${isDragOver ? "#007bff" : "#ddd"}`,
          borderRadius: 8,
          padding: 40,
          textAlign: "center",
          backgroundColor: isDragOver ? "#f8f9fa" : "#fff",
          transition: "all 0.3s ease",
          marginBottom: 24,
          cursor: "pointer"
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎵</div>
        <p style={{ fontSize: 18, marginBottom: 8, color: "#333" }}>
          {selectedFile ? selectedFile.name : "Drop your audio file here or click to browse"}
        </p>
        <p style={{ fontSize: 14, color: "#666" }}>
          Supports MP3, WAV, FLAC, and other audio formats
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div style={{ 
          padding: 16, 
          background: "#f8f9fa", 
          borderRadius: 8, 
          marginBottom: 24,
          border: "1px solid #e9ecef"
        }}>
          <h4 style={{ margin: "0 0 8px 0" }}>Selected File:</h4>
          <p style={{ margin: "4px 0", fontSize: 14 }}>
            <strong>Name:</strong> {selectedFile.name}
          </p>
          <p style={{ margin: "4px 0", fontSize: 14 }}>
            <strong>Size:</strong> {formatFileSize(selectedFile.size)}
          </p>
          <p style={{ margin: "4px 0", fontSize: 14 }}>
            <strong>Type:</strong> {selectedFile.type || "Unknown"}
          </p>
        </div>
      )}

      {/* Upload Button */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          style={{
            padding: "12px 32px",
            fontSize: 16,
            borderRadius: 6,
            background: !selectedFile || uploading ? "#ccc" : "#007bff",
            color: "#fff",
            border: "none",
            cursor: !selectedFile || uploading ? "not-allowed" : "pointer",
            transition: "background 0.3s ease"
          }}
        >
          {uploading ? "Uploading..." : "Upload & Analyze"}
        </button>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span>Upload Progress:</span>
            <span>{uploadProgress}%</span>
          </div>
          <div style={{ 
            width: "100%", 
            height: 8, 
            backgroundColor: "#e9ecef", 
            borderRadius: 4,
            overflow: "hidden"
          }}>
            <div style={{
              width: `${uploadProgress}%`,
              height: "100%",
              backgroundColor: "#007bff",
              transition: "width 0.3s ease"
            }} />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{ 
          padding: 12, 
          marginBottom: 16, 
          background: "#f8d7da", 
          color: "#721c24", 
          borderRadius: 6, 
          border: "1px solid #f5c6cb" 
        }}>
          {error}
        </div>
      )}

      {/* Upload Result */}
      {uploadResult && (
        <div style={{ 
          padding: 16, 
          background: "#d4edda", 
          borderRadius: 8, 
          border: "1px solid #c3e6cb",
          marginTop: 24
        }}>
          <h4 style={{ margin: "0 0 12px 0", color: "#155724" }}>Analysis Complete!</h4>
          <div style={{ fontSize: 14, color: "#155724" }}>
            <p><strong>File processed successfully.</strong></p>
            <p>Similar songs and releases will be displayed here once the backend analysis is complete.</p>
            {/* Add your result display logic here */}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div style={{ marginTop: 32, padding: 16, background: "#f8f9fa", borderRadius: 8 }}>
        <h4 style={{ margin: "0 0 12px 0" }}>How it works:</h4>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: "#666" }}>
          <li>Upload an audio file (MP3, WAV, FLAC, etc.)</li>
          <li>Our system will analyze the audio characteristics</li>
          <li>Find similar songs and releases in our database</li>
          <li>Get recommendations based on your uploaded track</li>
        </ul>
      </div>
    </div>
  );
}

export default DubFinder; 
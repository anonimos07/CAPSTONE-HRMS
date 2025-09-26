"use client"

import { useState } from "react"
import { Upload, FileText, Loader, CheckCircle, AlertCircle } from "lucide-react"
import Header from "../../components/Header"
import { useReviewResumeFile } from "../../Api"

const ResumeReview = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [reviewResult, setReviewResult] = useState(null)

  const reviewMutation = useReviewResumeFile()

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (isValidFile(file)) {
        setSelectedFile(file)
      } else {
        alert("Please upload a PDF or TXT file only.")
      }
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (isValidFile(file)) {
        setSelectedFile(file)
      } else {
        alert("Please upload a PDF or TXT file only.")
      }
    }
  }

  const isValidFile = (file) => {
    const validTypes = ["application/pdf", "text/plain"]
    return validTypes.includes(file.type)
  }

  const handleReview = () => {
    if (!selectedFile) return

    reviewMutation.mutate(selectedFile, {
      onSuccess: (data) => {
        setReviewResult(data)
      },
      onError: (error) => {
        console.error("Review failed:", error)
        alert("Failed to review resume. Please try again.")
      },
    })
  }

  const handleReset = () => {
    setSelectedFile(null)
    setReviewResult(null)
    setDragActive(false)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole="HR" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Resume Review</h1>
          <p className="text-gray-600 mt-2">Upload resumes for AI-powered analysis and insights</p>
        </div>

        {/* Upload Section */}
        {!reviewResult && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Resume for Review</h2>
              <p className="text-gray-600 mb-6">Supported formats: PDF, TXT (Max size: 10MB)</p>

              {/* File Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
                  dragActive
                    ? "border-[#8b1e3f] bg-red-50" 
                    : selectedFile
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {!selectedFile && (
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                )}

                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(selectedFile.size)} • {selectedFile.type}
                      </p>
                    </div>
                    <div className="flex space-x-4 mt-6">
                      <button
                        onClick={handleReview}
                        disabled={reviewMutation.isPending}
                        className="bg-[#8b1e3f] hover:bg-[#7a1a38] text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center space-x-2" // Updated button colors to violet-red theme
                      >
                        {reviewMutation.isPending ? (
                          <>
                            <Loader className="animate-spin h-4 w-4" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4" />
                            <span>Review Resume</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleReset}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Choose Different File
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-900">Drop your resume here</p>
                      <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Review Results */}
        {reviewResult && (
          <div className="space-y-6">
            {/* Success Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Resume Analysis Complete</h2>
                    <p className="text-gray-600">File: {selectedFile?.name}</p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Review Another Resume
                </button>
              </div>
            </div>

            {/* AI Review Results */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[#8b1e3f]" /> // Updated icon color to violet-red theme AI
                  Analysis Results
                </h3>
              </div>
              <div className="p-6">
                <div className="prose max-w-none">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{reviewResult}</pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg font-medium transition-colors">
                  Shortlist Candidate
                </button>
                <button className="bg-[#8b1e3f] bg-opacity-10 hover:bg-[#8b1e3f] hover:bg-opacity-20 text-[#8b1e3f] px-4 py-2 rounded-lg font-medium transition-colors">
                  {" "}
                  // Updated button colors to violet-red theme Schedule Interview
                </button>
                <button className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-lg font-medium transition-colors">
                  Request More Info
                </button>
                <button className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg font-medium transition-colors">
                  Decline Application
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        {!reviewResult && (
          <div className="mt-8 bg-red-50 rounded-lg p-6 border border-[#8b1e3f] border-opacity-30">
            {" "}
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-[#8b1e3f] mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-[#8b1e3f] mb-2">
                  {" "}
                </h3>
                <ul className="text-gray-700 space-y-1 text-sm">
                  {" "}
                  <li>• Upload clear, well-formatted PDF or text files for best results</li>
                  <li>• The AI will analyze skills, experience, education, and overall fit</li>
                  <li>• Review results include strengths, weaknesses, and recommendations</li>
                  <li>• Use the analysis to make informed hiring decisions</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumeReview

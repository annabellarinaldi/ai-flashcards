// frontend/src/components/DocumentUpload.js
import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContexts'
import API_URL from '../config/api'

const DocumentUpload = ({ onFlashcardsGenerated }) => {
    const { user } = useAuthContext()
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)
    const [dragActive, setDragActive] = useState(false)

    const handleFileSelect = (selectedFile) => {
        if (selectedFile) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'text/plain']
            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Please upload a PDF or TXT file')
                return
            }

            // Validate file size (10MB limit)
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('File too large. Maximum size is 10MB.')
                return
            }

            setFile(selectedFile)
            setError(null)
        }
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        handleFileSelect(selectedFile)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragActive(false)
        
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile) {
            handleFileSelect(droppedFile)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setDragActive(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setDragActive(false)
    }

    const handleUpload = async () => {
        if (!file || !user) return

        try {
            setUploading(true)
            setError(null)

            const formData = new FormData()
            formData.append('document', file)

            const response = await fetch(`${API_URL}/api/documents/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                body: formData
            })

            const result = await response.json()

            if (response.ok) {
                console.log('✅ Document processed successfully:', result)
                onFlashcardsGenerated(result)
                
                // Reset form
                setFile(null)
                // Reset file input
                const fileInput = document.getElementById('file-input')
                if (fileInput) fileInput.value = ''
                
            } else {
                setError(result.error || 'Failed to process document')
            }

        } catch (error) {
            console.error('Upload error:', error)
            setError('Network error. Please check your connection and try again.')
        } finally {
            setUploading(false)
        }
    }

    const removeFile = () => {
        setFile(null)
        setError(null)
        // Reset file input
        const fileInput = document.getElementById('file-input')
        if (fileInput) fileInput.value = ''
    }

    return (
        <div className="document-upload">
            <h3>📄 Generate Flashcards from Document</h3>
            <p className="upload-description">
                Upload a PDF or text file and AI will automatically create flashcards from the content.
            </p>

            {!file ? (
                <div 
                    className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => document.getElementById('file-input').click()}
                >
                    <div className="upload-icon">📁</div>
                    <div className="upload-text">
                        <p><strong>Click to browse</strong> or drag and drop</p>
                        <p className="upload-formats">Supports: PDF, TXT files (max 10MB)</p>
                    </div>
                    <input
                        id="file-input"
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </div>
            ) : (
                <div className="file-preview">
                    <div className="file-info">
                        <div className="file-icon">
                            {file.type === 'application/pdf' ? '📄' : '📝'}
                        </div>
                        <div className="file-details">
                            <div className="file-name">{file.name}</div>
                            <div className="file-size">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                        </div>
                        <button 
                            className="remove-file-btn"
                            onClick={removeFile}
                            disabled={uploading}
                        >
                            ✕
                        </button>
                    </div>
                    
                    <button 
                        className="upload-btn"
                        onClick={handleUpload}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <>
                                <span className="loading-spinner">⏳</span>
                                Processing Document...
                            </>
                        ) : (
                            <>
                                <span>🤖</span>
                                Generate Flashcards
                            </>
                        )}
                    </button>
                </div>
            )}

            {error && (
                <div className="error upload-error">
                    {error}
                </div>
            )}

            {uploading && (
                <div className="upload-progress">
                    <p>🧠 AI is analyzing your document and creating flashcards...</p>
                    <p className="progress-note">This may take 10-30 seconds depending on document length.</p>
                </div>
            )}
        </div>
    )
}

export default DocumentUpload
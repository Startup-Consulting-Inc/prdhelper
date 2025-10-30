/**
 * Document View Page
 * 
 * View, approve, or regenerate documents.
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, RotateCcw, Download, Copy, Check, X, History, FileDown, Edit, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { DocumentPreview } from '../components/common/DocumentPreview';
import { VersionHistory } from '../components/document/VersionHistory';
import { useDocument } from '../hooks/useDocuments';
import { useProject } from '../hooks/useProjects';
import { trpc } from '../lib/trpc';
import { exportToPDF, generatePDFFilename } from '../lib/utils/pdfExport';

export function DocumentViewPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { document: doc, isLoading } = useDocument(documentId!);
  const { project } = useProject(doc?.projectId || '');
  const utils = trpc.useUtils();

  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  const approveDocumentMutation = trpc.documents.approve.useMutation();
  const regenerateDocumentMutation = trpc.ai.regenerateDocument.useMutation();
  const updateDocumentMutation = trpc.documents.update.useMutation();

  const handleApprove = async () => {
    if (!doc) return;

    setIsApproving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await approveDocumentMutation.mutateAsync({
        id: doc.id,
      });

      // Invalidate queries to refresh data
      await utils.documents.getByProjectId.invalidate({ projectId: doc.projectId });
      await utils.projects.getById.invalidate({ id: doc.projectId });

      setSuccessMessage('Document approved successfully!');

      // Navigate back to project after a brief delay
      setTimeout(() => {
        navigate(`/projects/${doc.projectId}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve document');
    } finally {
      setIsApproving(false);
    }
  };

  const handleRegenerate = async () => {
    if (!doc) return;

    try {
      setError(null);
      setSuccessMessage(null);

      await regenerateDocumentMutation.mutateAsync({
        documentId: doc.id,
        feedback: feedback || undefined,
      });

      // Invalidate queries to refresh data
      await utils.documents.getById.invalidate({ id: doc.id });
      await utils.documents.getByProjectId.invalidate({ projectId: doc.projectId });
      await utils.projects.getById.invalidate({ id: doc.projectId });

      setSuccessMessage('Document regenerated successfully! Version has been incremented.');
      setShowFeedbackModal(false);
      setFeedback('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate document');
    }
  };

  const handleCopy = async () => {
    if (!doc) return;

    try {
      await navigator.clipboard.writeText(doc.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const handleDownload = () => {
    if (!doc) return;

    const blob = new Blob([doc.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${doc.type}-v${doc.version}.md`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    if (!doc || !project) return;

    try {
      setError(null);

      // Generate filename
      const filename = generatePDFFilename(doc.type, project.title);

      // Get document title based on type
      const documentTitle = doc.type === 'PROMPT_BUILD'
        ? `Vibe Coding Prompt: ${project.title}`
        : `${doc.type} Document: ${project.title}`;

      // Export to PDF
      await exportToPDF({
        filename,
        title: documentTitle,
        content: doc.content,
        metadata: {
          author: 'Clearly',
          subject: `${doc.type} - Version ${doc.version}`,
          keywords: `${doc.type}, ${project.title}, version ${doc.version}`,
        },
      });

      setSuccessMessage('PDF downloaded successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download PDF');
    }
  };

  const handleEdit = () => {
    if (!doc) return;
    setEditContent(doc.content);
    setIsEditing(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent('');
    setError(null);
  };

  const handleSaveEdit = async () => {
    if (!doc) return;

    try {
      setError(null);
      setSuccessMessage(null);

      await updateDocumentMutation.mutateAsync({
        id: doc.id,
        content: editContent,
      });

      // Invalidate queries to refresh data
      await utils.documents.getById.invalidate({ id: doc.id });
      await utils.documents.getByProjectId.invalidate({ projectId: doc.projectId });
      await utils.projects.getById.invalidate({ id: doc.projectId });

      setSuccessMessage('Document updated successfully! Version has been incremented.');
      setIsEditing(false);
      setEditContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update document');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Document not found</p>
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/projects/${doc.projectId}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Project
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {doc.type === 'PROMPT_BUILD' ? 'Vibe Coding Prompt' : `${doc.type} Document`}
                  </h1>
                  <Badge variant={doc.status === 'APPROVED' ? 'success' : 'default'}>
                    {doc.status}
                  </Badge>
                  <Badge variant="default">Version {doc.version}</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {doc.type === 'PROMPT_BUILD'
                    ? 'Copy this prompt to Loveable, V0, or Bolt to generate your web service'
                    : `Created ${new Date(doc.createdAt).toLocaleDateString()}`
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVersionHistory(true)}
              >
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Markdown
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownloadPDF}
                disabled={!project}
              >
                <FileDown className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>

          {/* Action buttons */}
          {!isEditing && doc.status === 'DRAFT' && (
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                onClick={handleApprove}
                isLoading={isApproving}
                disabled={isApproving || regenerateDocumentMutation.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Document
              </Button>
              <Button
                variant="outline"
                onClick={handleEdit}
                disabled={isApproving || regenerateDocumentMutation.isPending}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFeedbackModal(true)}
                isLoading={regenerateDocumentMutation.isPending}
                disabled={isApproving || regenerateDocumentMutation.isPending}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </div>
          )}

          {isEditing && (
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                onClick={handleSaveEdit}
                isLoading={updateDocumentMutation.isPending}
                disabled={updateDocumentMutation.isPending || !editContent.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={updateDocumentMutation.isPending}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}

          {!isEditing && doc.status === 'APPROVED' && (
            <>
              <Alert variant="success" className="mt-4">
                <CheckCircle className="h-4 w-4 mr-2" />
                This document was approved on{' '}
                {doc.approvedAt ? new Date(doc.approvedAt).toLocaleDateString() : 'N/A'}
              </Alert>
              <div className="mt-4 flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  disabled={regenerateDocumentMutation.isPending}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Document
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFeedbackModal(true)}
                  isLoading={regenerateDocumentMutation.isPending}
                  disabled={regenerateDocumentMutation.isPending}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Regenerate Document
                </Button>
              </div>
            </>
          )}

          {successMessage && (
            <Alert variant="success" className="mt-4">
              {successMessage}
            </Alert>
          )}

          {error && (
            <Alert variant="error" className="mt-4">
              {error}
            </Alert>
          )}
        </div>
      </header>

      {/* Document Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          {isEditing ? (
            <div className="p-4">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[600px] p-4 font-mono text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-vertical"
                placeholder="Edit document content..."
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                Editing in markdown format. Changes will create a new version and reset status to Draft.
              </p>
            </div>
          ) : (
            <DocumentPreview content={doc.content} />
          )}
        </Card>
      </main>

      {/* Version History Modal */}
      {showVersionHistory && (
        <VersionHistory
          documentId={doc.id}
          onClose={() => setShowVersionHistory(false)}
          onRestore={() => {
            setShowVersionHistory(false);
            setSuccessMessage('Version restored successfully! Document updated to new version.');
          }}
        />
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Regenerate Document
              </h2>
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setFeedback('');
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                The AI will regenerate this document based on the original requirements.
                You can optionally provide feedback to guide the regeneration.
              </p>

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Feedback (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="e.g., 'Make it more concise', 'Add more technical details', 'Focus on security aspects'..."
                className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none"
              />

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Note:</strong> Regenerating will create a new version (v{doc.version + 1}) and reset the status to Draft.
                  You'll need to review and approve it again.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowFeedbackModal(false);
                  setFeedback('');
                }}
                disabled={regenerateDocumentMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleRegenerate}
                isLoading={regenerateDocumentMutation.isPending}
                disabled={regenerateDocumentMutation.isPending}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Regenerate Document
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentViewPage;

/**
 * Version History Component
 *
 * Displays version history for a document with restore functionality.
 */

import { useState } from 'react';
import { History, RotateCcw, Eye, X, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { Alert } from '../ui/Alert';
import { DocumentPreview } from '../common/DocumentPreview';
import { trpc } from '../../lib/trpc';

interface VersionHistoryProps {
  documentId: string;
  projectId: string;
  onClose: () => void;
  onRestore: () => void;
}

export function VersionHistory({ documentId, projectId, onClose, onRestore }: VersionHistoryProps) {
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch version history
  const { data: versions, isLoading } = trpc.documents.getVersionHistory.useQuery({
    documentId,
    projectId,
  });

  // Fetch selected version content
  const { data: selectedVersion, isLoading: isLoadingVersion } = trpc.documents.getVersion.useQuery(
    { versionId: selectedVersionId!, documentId, projectId },
    { enabled: !!selectedVersionId }
  );

  // Restore version mutation
  const restoreVersionMutation = trpc.documents.restoreVersion.useMutation();
  const utils = trpc.useUtils();

  const handleRestore = async (versionId: string) => {
    if (!confirm('Are you sure you want to restore this version? The current version will be saved to history.')) {
      return;
    }

    try {
      setError(null);
      await restoreVersionMutation.mutateAsync({ versionId, documentId, projectId });

      // Invalidate queries to refresh data
      await utils.documents.getById.invalidate({ id: documentId });
      await utils.documents.getVersionHistory.invalidate({ documentId, projectId });

      onRestore();
      alert('Version restored successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore version');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-950 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <History className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Version History
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Version List */}
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
            <div className="p-4 space-y-3">
              {versions && versions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No version history available
                </p>
              ) : (
                versions?.map((version) => (
                  <Card
                    key={version.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedVersionId === version.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'hover:border-primary-300 dark:hover:border-primary-700'
                    }`}
                    onClick={() => setSelectedVersionId(version.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          Version {version.version}
                        </h3>
                        <Badge
                          variant={version.status === 'APPROVED' ? 'success' : 'default'}
                        >
                          {version.status === 'APPROVED' ? (
                            <><CheckCircle className="h-3 w-3 mr-1" /> Approved</>
                          ) : (
                            <><Clock className="h-3 w-3 mr-1" /> Draft</>
                          )}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <p>
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(version.createdAt).toLocaleString()}
                      </p>
                      <p>By: {version.user.name}</p>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVersionId(version.id);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestore(version.id);
                        }}
                        isLoading={restoreVersionMutation.isPending}
                        disabled={restoreVersionMutation.isPending}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Restore
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Version Content Preview */}
          <div className="flex-1 overflow-y-auto p-6">
            {!selectedVersionId ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Select a version to view its content</p>
                </div>
              </div>
            ) : isLoadingVersion ? (
              <div className="flex items-center justify-center h-full">
                <Spinner size="lg" />
              </div>
            ) : selectedVersion ? (
              <div>
                <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Version {selectedVersion.version}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Created {new Date(selectedVersion.createdAt).toLocaleString()} by{' '}
                        {selectedVersion.user.name}
                      </p>
                    </div>
                    <Badge
                      variant={selectedVersion.status === 'APPROVED' ? 'success' : 'default'}
                    >
                      {selectedVersion.status}
                    </Badge>
                  </div>
                </div>
                <Card>
                  <DocumentPreview content={selectedVersion.content} />
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-red-500">
                <p>Failed to load version content</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

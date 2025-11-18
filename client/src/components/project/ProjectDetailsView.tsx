/**
 * Project Details View
 *
 * Complete project detail page showing progress, documents, and wizard access.
 */

import { useState } from 'react';
import { ArrowLeft, FileText, Code, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { Spinner } from '../ui/Spinner';
import { CurrentPhaseCard } from './CurrentPhaseCard';
import ProjectCollaborators from './ProjectCollaborators';
import InviteCollaboratorModal from './InviteCollaboratorModal';
import { useProject } from '../../hooks/useProjects';
import { useDocuments } from '../../hooks/useDocuments';
import { trpc } from '../../lib/trpc';
import { calculateProjectProgress } from '../../lib/utils/projectProgress';

interface ProjectDetailsViewProps {
  projectId: string;
  onBack: () => void;
}

export function ProjectDetailsView({ projectId, onBack }: ProjectDetailsViewProps) {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const { project, isLoading: isLoadingProject } = useProject(projectId);
  const { documents, isLoading: isLoadingDocuments } = useDocuments(projectId);
  const generateTasksMutation = trpc.ai.generateDocument.useMutation();
  const generatePromptBuildMutation = trpc.ai.generateDocument.useMutation();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  if (isLoadingProject) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Project not found</p>
          <Button onClick={onBack}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Get document status
  const brdDoc = documents?.find((d) => d.type === 'BRD');
  const prdDoc = documents?.find((d) => d.type === 'PRD');
  const promptBuildDoc = documents?.find((d) => d.type === 'PROMPT_BUILD');
  const tasksDoc = documents?.find((d) => d.type === 'TASKS');

  // Calculate progress using shared utility
  const allDocs = [brdDoc, prdDoc, promptBuildDoc, tasksDoc]
    .filter((doc) => doc !== undefined)
    .map((doc) => ({
      type: doc.type,
      status: doc.status,
    }));
  const progressPercent = calculateProjectProgress({ mode: project.mode }, allDocs);

  // Calculate completed steps from documents
  const totalSteps = 3; // BRD, PRD, and final document
  const completedSteps = allDocs.filter((doc) => doc.status === 'APPROVED').length;

  // Handler for generating tasks
  const handleGenerateTasks = async () => {
    try {
      await generateTasksMutation.mutateAsync({
        projectId: projectId,
        documentType: 'TASKS',
      });

      // Invalidate queries to refresh data
      await utils.documents.getByProjectId.invalidate({ projectId: projectId });
      await utils.projects.getById.invalidate({ id: projectId });
    } catch (err) {
      console.error('Failed to generate tasks:', err);
      alert('Failed to generate tasks: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // Handler for generating Prompt Build
  const handleGeneratePromptBuild = async () => {
    try {
      await generatePromptBuildMutation.mutateAsync({
        projectId: projectId,
        documentType: 'PROMPT_BUILD',
      });

      // Invalidate queries to refresh data
      await utils.documents.getByProjectId.invalidate({ projectId: projectId });
      await utils.projects.getById.invalidate({ id: projectId });
    } catch (err) {
      console.error('Failed to generate Prompt Build:', err);
      alert('Failed to generate Prompt Build: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // Determine current phase and next action
  const getPhaseInfo = () => {
    if (!brdDoc) {
      return {
        phase: 'Start BRD',
        subtitle: 'BRD WIZARD',
        action: 'Start BRD Wizard',
        icon: FileText,
        handler: () => navigate(`/projects/${projectId}/wizard/brd?autoStart=true`)
      };
    }
    if (brdDoc.status === 'DRAFT') {
      return {
        phase: 'Review BRD',
        subtitle: 'BRD QUESTIONS',
        action: 'Review & Approve BRD',
        icon: FileText,
        handler: () => navigate(`/documents/${brdDoc.id}`)
      };
    }
    if (!prdDoc) {
      return {
        phase: 'Start PRD',
        subtitle: 'PRD WIZARD',
        action: 'Start PRD Wizard',
        icon: FileText,
        handler: () => navigate(`/projects/${projectId}/wizard/prd?autoStart=true`)
      };
    }
    if (prdDoc.status === 'DRAFT') {
      return {
        phase: 'Review PRD',
        subtitle: 'PRD QUESTIONS',
        action: 'Review & Approve PRD',
        icon: FileText,
        handler: () => navigate(`/documents/${prdDoc.id}`)
      };
    }
    if (project.mode === 'PLAIN' && !promptBuildDoc) {
      return {
        phase: 'Generate Prompt Build',
        subtitle: 'VIBE CODING PROMPT',
        action: 'Generate Prompt Build',
        icon: FileText,
        handler: handleGeneratePromptBuild
      };
    }
    if (project.mode === 'PLAIN' && promptBuildDoc && promptBuildDoc.status === 'DRAFT') {
      return {
        phase: 'Review Prompt Build',
        subtitle: 'VIBE CODING PROMPT',
        action: 'Review & Copy Prompt',
        icon: FileText,
        handler: () => navigate(`/documents/${promptBuildDoc.id}`)
      };
    }
    if (project.mode === 'TECHNICAL' && !tasksDoc) {
      return {
        phase: 'Generate Tasks',
        subtitle: 'TECHNICAL TASKS',
        action: 'Generate Task List',
        icon: Code,
        handler: handleGenerateTasks
      };
    }
    if (project.mode === 'TECHNICAL' && tasksDoc && tasksDoc.status === 'DRAFT') {
      return {
        phase: 'Review Tasks',
        subtitle: 'TECHNICAL TASKS',
        action: 'Review & Approve Tasks',
        icon: Code,
        handler: () => navigate(`/documents/${tasksDoc.id}`)
      };
    }
    return {
      phase: 'Completed',
      subtitle: 'PROJECT COMPLETE',
      action: 'View All Documents',
      icon: CheckCircle,
      handler: () => {}
    };
  };

  const phaseInfo = getPhaseInfo();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {project.title}
                </h1>
                <Badge variant={project.status === 'ACTIVE' ? 'primary' : 'default'}>
                  {project.status}
                </Badge>
                <Badge variant="default">{project.mode}</Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
                {project.description}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Progress Overview */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Project Progress
              </h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {completedSteps} of {totalSteps} completed
              </span>
            </div>
            <Progress value={progressPercent} size="lg" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {progressPercent}% Complete
            </p>
          </div>
        </Card>

        {/* Current Phase */}
        <Card>
          <div className="p-6">
            <CurrentPhaseCard
              title={phaseInfo.phase}
              subtitle={phaseInfo.subtitle}
              actionText={phaseInfo.action}
              icon={phaseInfo.icon}
              onAction={phaseInfo.handler}
              isLoading={generateTasksMutation.isPending}
            />
          </div>
        </Card>

        {/* Team Collaboration */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Team
          </h2>
          <ProjectCollaborators
            projectId={projectId}
            isOwner={project.isOwner || false}
            onInviteClick={() => setInviteModalOpen(true)}
          />
        </div>

        {/* Documents */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Documents
          </h2>
          
          {isLoadingDocuments ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* BRD Card */}
              <Card className={brdDoc ? 'border-primary-200 dark:border-primary-800' : ''}>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      Business Requirements
                    </h3>
                  </div>
                  
                  {brdDoc ? (
                    <>
                      <Badge
                        variant={brdDoc.status === 'APPROVED' ? 'success' : 'default'}
                        className="mb-3"
                      >
                        {brdDoc.status === 'APPROVED' ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approved
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Draft
                          </>
                        )}
                      </Badge>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Version {brdDoc.version}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate(`/documents/${brdDoc.id}`)}
                      >
                        View Document
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Not started yet
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate(`/projects/${projectId}/wizard/brd?autoStart=true`)}
                      >
                        Start BRD
                      </Button>
                    </>
                  )}
                </div>
              </Card>

              {/* PRD Card */}
              <Card
                className={
                  prdDoc
                    ? 'border-primary-200 dark:border-primary-800'
                    : brdDoc?.status !== 'APPROVED'
                    ? 'opacity-50'
                    : ''
                }
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      Product Requirements
                    </h3>
                  </div>
                  
                  {prdDoc ? (
                    <>
                      <Badge
                        variant={prdDoc.status === 'APPROVED' ? 'success' : 'default'}
                        className="mb-3"
                      >
                        {prdDoc.status === 'APPROVED' ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approved
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Draft
                          </>
                        )}
                      </Badge>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Version {prdDoc.version}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate(`/documents/${prdDoc.id}`)}
                      >
                        View Document
                      </Button>
                    </>
                  ) : brdDoc?.status === 'APPROVED' ? (
                    <>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Ready to start
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate(`/projects/${projectId}/wizard/prd?autoStart=true`)}
                      >
                        Start PRD
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-500 dark:text-gray-600 mb-4">
                        Requires BRD approval
                      </p>
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        Locked
                      </Button>
                    </>
                  )}
                </div>
              </Card>

              {/* Prompt Build Card (Plain Mode Only) */}
              {project.mode === 'PLAIN' && (
                <Card
                  className={
                    promptBuildDoc
                      ? 'border-primary-200 dark:border-primary-800'
                      : prdDoc?.status !== 'APPROVED'
                      ? 'opacity-50'
                      : ''
                  }
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Code className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Prompt Build
                      </h3>
                    </div>

                    {promptBuildDoc ? (
                      <>
                        <Badge
                          variant={promptBuildDoc.status === 'APPROVED' ? 'success' : 'default'}
                          className="mb-3"
                        >
                          {promptBuildDoc.status === 'APPROVED' ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Ready
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Draft
                            </>
                          )}
                        </Badge>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          For Loveable, V0, Bolt
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => navigate(`/documents/${promptBuildDoc.id}`)}
                        >
                          View & Copy
                        </Button>
                      </>
                    ) : prdDoc?.status === 'APPROVED' ? (
                      <>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Ready to generate
                        </p>
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          isLoading={generatePromptBuildMutation.isPending}
                          onClick={async () => {
                            try {
                              await generatePromptBuildMutation.mutateAsync({
                                projectId: projectId,
                                documentType: 'PROMPT_BUILD',
                              });
                              // Refresh page to show new prompt
                              window.location.reload();
                            } catch (error) {
                              alert('Failed to generate Prompt Build: ' + (error instanceof Error ? error.message : 'Unknown error'));
                            }
                          }}
                        >
                          Generate Prompt
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-500 dark:text-gray-600 mb-4">
                          Requires PRD approval
                        </p>
                        <Button variant="outline" size="sm" className="w-full" disabled>
                          Locked
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              )}

              {/* Tasks Card (Technical Mode Only) */}
              {project.mode === 'TECHNICAL' && (
                <Card
                  className={
                    tasksDoc
                      ? 'border-primary-200 dark:border-primary-800'
                      : prdDoc?.status !== 'APPROVED'
                      ? 'opacity-50'
                      : ''
                  }
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Code className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Technical Tasks
                      </h3>
                    </div>

                    {tasksDoc ? (
                      <>
                        <Badge
                          variant={tasksDoc.status === 'APPROVED' ? 'success' : 'default'}
                          className="mb-3"
                        >
                          {tasksDoc.status === 'APPROVED' ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approved
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Draft
                            </>
                          )}
                        </Badge>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Version {tasksDoc.version}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => navigate(`/documents/${tasksDoc.id}`)}
                        >
                          View Tasks
                        </Button>
                      </>
                    ) : prdDoc?.status === 'APPROVED' ? (
                      <>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Ready to generate
                        </p>
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          isLoading={generateTasksMutation.isPending}
                          onClick={async () => {
                            try {
                              await generateTasksMutation.mutateAsync({
                                projectId: projectId,
                                documentType: 'TASKS',
                              });
                              // Refresh page to show new tasks
                              window.location.reload();
                            } catch (error) {
                              alert('Failed to generate tasks: ' + (error instanceof Error ? error.message : 'Unknown error'));
                            }
                          }}
                        >
                          Generate Tasks
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-500 dark:text-gray-600 mb-4">
                          Requires PRD approval
                        </p>
                        <Button variant="outline" size="sm" className="w-full" disabled>
                          Locked
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Project Details */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Project Details
            </h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Created
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {new Date(project.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Last Updated
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Mode
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {project.mode === 'TECHNICAL' ? 'Technical Mode' : 'Plain Mode'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Documents
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {documents?.length || 0} generated
                </dd>
              </div>
            </dl>
          </div>
        </Card>
      </main>

      {/* Invite Collaborator Modal */}
      <InviteCollaboratorModal
        projectId={projectId}
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
      />
    </div>
  );
}

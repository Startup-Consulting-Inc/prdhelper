/**
 * Problem Definition Wizard Page
 *
 * AI-powered Q&A wizard for defining the right problem before BRD.
 * Guides users through root cause analysis using 5 Whys and JTBD frameworks.
 * Supports autoStart query param for seamless project creation flow.
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, Target, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { ConversationMessage } from '../components/wizard/ConversationMessage';
import { useProject } from '../hooks/useProjects';
import { useConversation, type Message } from '../hooks/useAI';
import { trpc } from '../lib/trpc';

const DOCUMENT_GENERATION_STEPS = [
  'Analyzing your responses...',
  'Identifying root causes...',
  'Building problem statement...',
  'Finalizing document...',
];

export function ProblemDefinitionWizardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasAutoStarted = useRef(false);
  const utils = trpc.useUtils();

  // Check if wizard should auto-start (skip welcome screen)
  const autoStart = new URLSearchParams(location.search).get('autoStart') === 'true';

  const { project, isLoading: isLoadingProject } = useProject(projectId!);
  const { messages, isLoading: isLoadingMessages } = useConversation(
    projectId!,
    'PROBLEM_DEFINITION'
  );

  // tRPC mutations
  const askQuestionMutation = trpc.ai.askQuestion.useMutation();
  const generateDocumentMutation = trpc.ai.generateDocument.useMutation();

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  // Advance generation step indicator during document generation
  useEffect(() => {
    if (!isGenerating) {
      setGenerationStep(0);
      return;
    }
    const interval = setInterval(() => {
      setGenerationStep((prev) => Math.min(prev + 1, DOCUMENT_GENERATION_STEPS.length - 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Count questions asked
  useEffect(() => {
    const assistantMessages = messages.filter((m: Message) => m.role === 'assistant');
    setQuestionCount(assistantMessages.length);
  }, [messages]);

  // Browser beforeunload event for tab close/refresh (warn on leaving page)
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (messages.length > 0 && !isGenerating) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [messages.length, isGenerating]);

  const handleBackClick = () => {
    const hasUnsavedProgress = messages.length > 0 && !isGenerating;
    if (hasUnsavedProgress && !window.confirm(
      'You have unsaved progress in this wizard. Leaving now will lose your conversation. Are you sure you want to leave?'
    )) {
      return;
    }
    navigate(`/projects/${projectId}`);
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() || isSubmitting) return;

    const answerText = currentAnswer.trim();
    const isExampleChoice = /^Example\s+\d+$/i.test(answerText);
    if (answerText.length < 10 && !isExampleChoice) {
      setError('Please provide a more detailed answer (at least 10 characters)');
      return;
    }
    if (answerText.length > 5000) {
      setError('Answer is too long. Please keep it under 5000 characters.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    setCurrentAnswer('');

    try {
      await askQuestionMutation.mutateAsync({
        projectId: projectId!,
        documentType: 'PROBLEM_DEFINITION',
        userAnswer: answerText,
      });

      await utils.conversations.getByProject.invalidate({
        projectId: projectId!,
        documentType: 'PROBLEM_DEFINITION',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateDocument = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      await generateDocumentMutation.mutateAsync({
        projectId: projectId!,
        documentType: 'PROBLEM_DEFINITION',
      });

      await utils.documents.getByProjectId.invalidate({ projectId: projectId! });
      await utils.projects.getById.invalidate({ id: projectId! });

      navigate(`/projects/${projectId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate document';
      setError(message.includes('timed out')
        ? 'Document generation timed out. The AI service may be busy — please try again.'
        : message
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmitAnswer();
    }
  };

  const handleStartWizard = async () => {
    if (messages.length > 0) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await askQuestionMutation.mutateAsync({
        projectId: projectId!,
        documentType: 'PROBLEM_DEFINITION',
        userAnswer: undefined,
      });

      await utils.conversations.getByProject.invalidate({
        projectId: projectId!,
        documentType: 'PROBLEM_DEFINITION',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start wizard');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-start wizard if autoStart query param is present (only once)
  useEffect(() => {
    if (autoStart && messages.length === 0 && !isLoadingMessages && !isSubmitting && !hasAutoStarted.current) {
      hasAutoStarted.current = true;
      handleStartWizard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, messages.length, isLoadingMessages, isSubmitting]);

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
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const progress = questionCount >= 5 ? 100 : (questionCount / 5) * 100;
  const canGenerate = questionCount >= 3;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackClick}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Problem Definition
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{project.title}</p>
              </div>
            </div>
            <Badge variant="default">
              <Target className="h-3 w-3 mr-1" />
              {project.mode}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">
                Questions answered: {questionCount}/5+
              </span>
              <span className="text-gray-600 dark:text-gray-400">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {isLoadingMessages ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : messages.length === 0 && !autoStart ? (
            // Welcome Screen
            <Card className="max-w-2xl mx-auto">
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
                  <Target className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Define the Right Problem
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Before building anything, let's make sure we're solving the right problem.
                  I'll guide you from surface-level symptoms to the root cause using proven frameworks.
                </p>
                <div className="bg-amber-50 dark:bg-amber-950/50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    What to expect:
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left">
                    <li>• 5-8 guided questions to uncover the real problem</li>
                    <li>• Root cause analysis using the 5 Whys technique</li>
                    <li>• Job-to-be-Done framework to focus on outcomes, not solutions</li>
                    <li>• A validated problem statement ready for BRD</li>
                  </ul>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleStartWizard}
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Start Problem Definition
                  </Button>
                  <a
                    href="/blog/defining-the-right-problem-ai-era"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Read: Why Problem Definition Matters
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </Card>
          ) : (
            // Conversation
            <div className="space-y-6">
              {messages.map((message: Message, index: number) => (
                <ConversationMessage
                  key={message.id || index}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}

              {isSubmitting && (
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Thinking...</span>
                </div>
              )}

              {isGenerating && (
                <Card className="bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800">
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-amber-600 dark:text-amber-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          Generating Problem Definition...
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {DOCUMENT_GENERATION_STEPS[generationStep]}
                        </p>
                        <div className="mt-4 flex gap-1.5">
                          {DOCUMENT_GENERATION_STEPS.map((_, i) => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                                i <= generationStep
                                  ? 'bg-amber-500'
                                  : 'bg-gray-200 dark:bg-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      {messages.length > 0 && !isGenerating && (
        <div className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {canGenerate && (
              <div className="mb-4 flex items-center justify-between bg-success-50 dark:bg-success-950/50 border border-success-200 dark:border-success-800 rounded-lg p-3">
                <div className="flex items-center gap-2 text-success-800 dark:text-success-200">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Ready to generate your Problem Definition!
                  </span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleGenerateDocument}
                  isLoading={isGenerating}
                >
                  Generate Problem Definition
                </Button>
              </div>
            )}

            <div className="flex gap-3">
              <Textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your answer here... (Cmd/Ctrl + Enter to send)"
                rows={3}
                disabled={isSubmitting || isGenerating}
                className="flex-1"
              />
              <Button
                variant="primary"
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim() || isSubmitting || isGenerating}
                isLoading={isSubmitting}
                className="self-end"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p
              className={`mt-2 text-xs ${
                currentAnswer.length > 5000
                  ? 'text-red-600 dark:text-red-400'
                  : currentAnswer.length > 0 && currentAnswer.length < 10 && !/^Example\s+\d+$/i.test(currentAnswer.trim())
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-gray-500 dark:text-gray-500'
              }`}
            >
              Press Cmd/Ctrl + Enter to send • {currentAnswer.length}/5000 characters
              {currentAnswer.length > 0 && currentAnswer.length < 10 && !/^Example\s+\d+$/i.test(currentAnswer.trim()) && ' (min 10)'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProblemDefinitionWizardPage;

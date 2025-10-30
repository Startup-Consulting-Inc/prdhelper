/**
 * BRD Wizard Page
 *
 * AI-powered Q&A wizard for generating Business Requirements Documents.
 * Supports autoStart query param for seamless project creation flow.
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, FileText, CheckCircle } from 'lucide-react';
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

export function BRDWizardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  const { project, isLoading: isLoadingProject } = useProject(projectId!);
  const { messages, isLoading: isLoadingMessages } = useConversation(
    projectId!,
    'BRD'
  );

  // tRPC mutations
  const askQuestionMutation = trpc.ai.askQuestion.useMutation();
  const generateDocumentMutation = trpc.ai.generateDocument.useMutation();
  
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

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

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() || isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const answerText = currentAnswer.trim();
      setCurrentAnswer('');

      // Backend handles adding both user answer and AI question to conversation
      await askQuestionMutation.mutateAsync({
        projectId: projectId!,
        documentType: 'BRD',
        userAnswer: answerText,
      });

      // Invalidate to refresh messages from backend
      await utils.conversations.getByProject.invalidate({
        projectId: projectId!,
        documentType: 'BRD',
      });

      // Note: User can manually generate when ready (after 3+ questions)
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
        documentType: 'BRD',
      });

      // Invalidate queries to refresh data
      await utils.documents.getByProjectId.invalidate({ projectId: projectId! });
      await utils.projects.getById.invalidate({ id: projectId! });

      // Navigate to project detail to see generated document
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate document');
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmitAnswer();
    }
  };

  const handleStartWizard = async () => {
    if (messages.length > 0) return; // Already started

    setIsSubmitting(true);
    setError(null);

    try {
      // Backend handles adding AI question to conversation
      await askQuestionMutation.mutateAsync({
        projectId: projectId!,
        documentType: 'BRD',
        userAnswer: undefined, // No answer yet, just starting
      });

      // Invalidate to refresh messages from backend
      await utils.conversations.getByProject.invalidate({
        projectId: projectId!,
        documentType: 'BRD',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start wizard');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-start wizard if autoStart query param is present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shouldAutoStart = params.get('autoStart') === 'true';

    if (shouldAutoStart && messages.length === 0 && !isLoadingMessages && !isSubmitting) {
      handleStartWizard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, messages.length, isLoadingMessages, isSubmitting]);

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
  const canGenerate = questionCount >= 3; // Minimum 3 questions answered

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
                onClick={() => navigate(`/projects/${projectId}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  BRD Wizard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{project.title}</p>
              </div>
            </div>
            <Badge variant="default">
              <FileText className="h-3 w-3 mr-1" />
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
          ) : messages.length === 0 ? (
            // Welcome Screen
            <Card className="max-w-2xl mx-auto">
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
                  <FileText className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Welcome to the BRD Wizard!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  I'll ask you a series of questions to understand your business requirements.
                  Answer thoughtfully - your responses will shape the final document.
                </p>
                <div className="bg-primary-50 dark:bg-primary-950/50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    What to expect:
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left">
                    <li>• 5-10 targeted questions about your project</li>
                    <li>• Questions adapt based on your answers</li>
                    <li>• Answer as clearly and completely as possible</li>
                    <li>• You can generate the BRD after 3+ questions</li>
                  </ul>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStartWizard}
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Start Wizard
                </Button>
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
                <Card className="bg-primary-50 dark:bg-primary-950/50 border-primary-200 dark:border-primary-800">
                  <div className="p-6 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Generating Your BRD...
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This may take a minute. Please wait...
                    </p>
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
                    You've answered enough questions to generate your BRD!
                  </span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleGenerateDocument}
                  isLoading={isGenerating}
                >
                  Generate BRD
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
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              Press Cmd/Ctrl + Enter to send • {currentAnswer.length} characters
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default BRDWizardPage;

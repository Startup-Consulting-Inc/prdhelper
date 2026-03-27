/**
 * Tool Output Page
 *
 * Displays generated tool output with copy and download functionality.
 * For vibe coding tools: structured sections with individual copy buttons and markdown rendering.
 * For AI coding tools: file tree with content rendering, setup instructions, and ZIP download.
 */

import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Download, FileText, FolderOpen, Info } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Footer } from '../components/layout/Footer';
import { Spinner } from '../components/ui/Spinner';
import { ToolContentRenderer } from '../components/tool-output/ToolContentRenderer';
import { parseVibeToolSections } from '../lib/utils/vibeToolParser';
import { trpc } from '../lib/trpc';
import { OUTPUT_TOOLS, type ToolOutputBundle, type ToolOutputDocumentData, type OutputToolType } from '@shared/types';

interface ToolSetupInfo {
  title: string;
  steps: string[];
  skills: { name: string; description: string }[];
  mcpServers: { name: string; description: string }[];
}

/**
 * Returns tool-specific setup instructions, recommended skills, and MCP servers.
 */
function getToolSetupInstructions(toolType: string): ToolSetupInfo | null {
  const instructions: Record<string, ToolSetupInfo> = {
    CLAUDE_CODE: {
      title: 'How to Set Up Claude Code',
      steps: [
        'Copy the CLAUDE.md file to the root of your project directory.',
        'Create a .claude/ directory in your project root if it does not exist.',
        'Copy the settings.json file into the .claude/ directory.',
        'Save the Reference Document for your own records — it contains the full project specification.',
        'Run "claude" in your project directory to start Claude Code with these configurations.',
      ],
      skills: [
        { name: '/implement', description: 'Feature implementation with intelligent persona activation' },
        { name: '/build', description: 'Project builder with framework detection and UI builds' },
        { name: '/test', description: 'Testing workflows — unit, integration, and E2E' },
        { name: '/analyze', description: 'Multi-dimensional code and system analysis' },
        { name: '/improve', description: 'Evidence-based code enhancement and optimization' },
        { name: '/git', description: 'Git workflow assistant for commits, PRs, and branching' },
      ],
      mcpServers: [
        { name: 'Context7', description: 'Official library documentation lookup — auto-activates on framework imports' },
        { name: 'Sequential Thinking', description: 'Complex multi-step analysis and systematic debugging' },
        { name: 'Playwright', description: 'Cross-browser E2E testing and visual regression testing' },
        { name: 'Supabase', description: 'Database management, auth setup, and real-time subscriptions (if using Supabase)' },
        { name: 'GitHub', description: 'Issue tracking, PR management, and repository automation' },
        { name: 'Filesystem', description: 'Advanced file operations and project scaffolding' },
      ],
    },
    CURSOR: {
      title: 'How to Set Up Cursor',
      steps: [
        'Create a .cursor/rules/ directory in your project root if it does not exist.',
        'Copy the .mdc rule files into .cursor/rules/.',
        'Copy AGENTS.md to the root of your project directory.',
        'Save the Reference Document for your own records.',
        'Open the project in Cursor to use the configured rules.',
      ],
      skills: [
        { name: '@Codebase', description: 'Reference your entire codebase for context-aware answers' },
        { name: '@Docs', description: 'Search official documentation for libraries and frameworks' },
        { name: '@Web', description: 'Search the web for up-to-date information and solutions' },
        { name: 'Cmd+K (Inline Edit)', description: 'Edit code inline with AI — select code and describe changes' },
        { name: 'Composer', description: 'Multi-file editing agent for larger refactoring tasks' },
      ],
      mcpServers: [
        { name: 'Context7', description: 'Official library documentation — install via Cursor MCP settings' },
        { name: 'Sequential Thinking', description: 'Complex analysis and architectural reasoning' },
        { name: 'Supabase', description: 'Database management and auth setup (if using Supabase)' },
        { name: 'GitHub', description: 'Issue and PR management directly from Cursor' },
        { name: 'Browserbase', description: 'Web scraping and browser automation for testing' },
      ],
    },
    OPENAI_CODEX: {
      title: 'How to Set Up OpenAI Codex',
      steps: [
        'Copy AGENTS.md to the root of your project directory.',
        'Create a .codex/ directory in your project root if it does not exist.',
        'Copy config.toml into the .codex/ directory.',
        'Save the Reference Document for your own records.',
        'Run "codex" in your project directory to start with these configurations.',
      ],
      skills: [
        { name: 'codex --model o4-mini', description: 'Fast iteration for smaller tasks and quick edits' },
        { name: 'codex --model o3', description: 'Deep reasoning for complex architecture and debugging' },
        { name: 'codex --approval auto', description: 'Auto-approve safe operations for faster workflow' },
        { name: 'Full Auto Mode', description: 'Let Codex handle file edits and shell commands autonomously' },
      ],
      mcpServers: [
        { name: 'Context7', description: 'Library documentation lookup for framework-specific patterns' },
        { name: 'GitHub', description: 'Repository management, issues, and pull requests' },
        { name: 'Supabase', description: 'Database and auth management (if using Supabase)' },
        { name: 'Filesystem', description: 'Advanced file operations and project scaffolding' },
      ],
    },
    GOOGLE_ANTIGRAVITY: {
      title: 'How to Set Up Google Antigravity',
      steps: [
        'Create a .agent/ directory in your project root if it does not exist.',
        'Copy rules.md, skills.md, and workflows.md into .agent/.',
        'Copy AGENTS.md to the root of your project directory.',
        'Save the Reference Document for your own records.',
      ],
      skills: [
        { name: 'Gemini Code Assist', description: 'AI pair programming with Gemini models in your IDE' },
        { name: 'Firebase Integration', description: 'Deploy, manage hosting, and configure Firebase services' },
        { name: 'Cloud Run', description: 'Containerized backend deployment and scaling' },
        { name: 'Vertex AI', description: 'ML model training and deployment for AI features' },
      ],
      mcpServers: [
        { name: 'Context7', description: 'Library documentation lookup for framework patterns' },
        { name: 'Firebase', description: 'Firestore, Auth, Storage, and Hosting management' },
        { name: 'Google Cloud', description: 'GCP resource management, Cloud Run, and Cloud SQL' },
        { name: 'Sequential Thinking', description: 'Complex analysis and multi-step reasoning' },
      ],
    },
  };
  return instructions[toolType] || null;
}

export function ToolOutputPage() {
  const { projectId, documentId } = useParams<{ projectId: string; documentId: string }>();
  const navigate = useNavigate();
  const [copiedIndex, setCopiedIndex] = useState<number | string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const { data: document, isLoading } = trpc.documents.getById.useQuery(
    { id: documentId!, projectId: projectId! },
    { enabled: !!documentId && !!projectId }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Document not found</p>
      </div>
    );
  }

  // Type-safe access to TOOL_OUTPUT document fields
  const toolDoc = document as unknown as ToolOutputDocumentData;
  const toolType = toolDoc.toolType;
  const content = toolDoc.content || '';
  const toolInfo = OUTPUT_TOOLS.find((t) => t.id === toolType);
  const isVibeCoding = toolType?.startsWith('VIBE_');
  const setupInstructions = !isVibeCoding ? getToolSetupInstructions(toolType) : null;

  // Parse the bundle from the document
  let bundle: ToolOutputBundle | null = null;
  try {
    const bundleStr = toolDoc.bundle;
    if (bundleStr) {
      bundle = typeof bundleStr === 'string' ? JSON.parse(bundleStr) : bundleStr;
    }
  } catch {
    if (!parseError) {
      // Use setTimeout to avoid setState during render
      setTimeout(() => setParseError('Could not parse the file structure. Showing raw content.'), 0);
    }
  }

  const handleCopy = async (text: string, index: number | string) => {
    setCopyError(null);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      setCopyError('Failed to copy to clipboard. Please select the text and copy manually.');
      setTimeout(() => setCopyError(null), 4000);
    }
  };

  const handleDownloadZip = async () => {
    if (!bundle || !bundle.files.length) return;

    setIsDownloading(true);
    setDownloadError(null);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Add all generated files in their correct paths
      for (const file of bundle.files) {
        zip.file(file.path, file.content);
      }

      // Add reference document if present
      if (bundle.referenceDoc) {
        zip.file('REFERENCE_DOCUMENT.md', bundle.referenceDoc);
      }

      // Add PRD document if present in the bundle
      if (bundle.prdContent) {
        zip.file('PRD.md', bundle.prdContent);
      }

      // Generate and download the ZIP
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${(toolInfo?.label || 'tool-output').replace(/\s+/g, '-').toLowerCase()}-project-files.zip`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setDownloadError('Failed to generate ZIP file. Please try copying files individually.');
      setTimeout(() => setDownloadError(null), 5000);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(`/projects/${projectId}`)}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Project
            </button>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/projects/${projectId}/tools`)}
              >
                Generate for Another Tool
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {toolInfo?.label || 'Tool'} Output
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {toolInfo?.outputDescription}
          </p>
        </div>

        {/* Error alerts */}
        {copyError && (
          <Alert variant="error" className="mb-4">
            {copyError}
          </Alert>
        )}
        {downloadError && (
          <Alert variant="error" className="mb-4">
            {downloadError}
          </Alert>
        )}
        {parseError && (
          <Alert variant="warning" className="mb-4">
            {parseError}
          </Alert>
        )}

        {isVibeCoding ? (
          <VibeToolOutput
            content={content}
            toolType={toolType}
            toolLabel={toolInfo?.label || 'Tool'}
            copiedIndex={copiedIndex}
            onCopy={handleCopy}
          />
        ) : (
          <AiToolOutput
            bundle={bundle}
            content={content}
            setupInstructions={setupInstructions}
            copiedIndex={copiedIndex}
            isDownloading={isDownloading}
            onCopy={handleCopy}
            onDownloadZip={handleDownloadZip}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

/* ---------- Vibe Coding Tool Output ---------- */

interface VibeToolOutputProps {
  content: string;
  toolType: OutputToolType;
  toolLabel: string;
  copiedIndex: number | string | null;
  onCopy: (text: string, index: number | string) => void;
}

function VibeToolOutput({ content, toolType, toolLabel, copiedIndex, onCopy }: VibeToolOutputProps) {
  const sections = useMemo(
    () => parseVibeToolSections(content, toolType),
    [content, toolType]
  );

  const hasMultipleSections = sections.length > 1;

  return (
    <div className="space-y-4">
      {/* Copy All button when multiple sections */}
      {hasMultipleSections && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {sections.length} sections for {toolLabel}
          </p>
          <button
            onClick={() => onCopy(content, 'all')}
            className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            {copiedIndex === 'all' ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                Copied All
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Entire Prompt
              </>
            )}
          </button>
        </div>
      )}

      {/* Sections */}
      {sections.map((section, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {section.title}
            </span>
            <button
              onClick={() => onCopy(section.content, `vibe-${index}`)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {copiedIndex === `vibe-${index}` ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="p-4 overflow-auto max-h-[600px]">
            <ToolContentRenderer content={section.content} isMarkdown={true} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- AI Coding Tool Output ---------- */

interface AiToolOutputProps {
  bundle: ToolOutputBundle | null;
  content: string;
  setupInstructions: ToolSetupInfo | null;
  copiedIndex: number | string | null;
  isDownloading: boolean;
  onCopy: (text: string, index: number | string) => void;
  onDownloadZip: () => void;
}

function AiToolOutput({
  bundle,
  content,
  setupInstructions,
  copiedIndex,
  isDownloading,
  onCopy,
  onDownloadZip,
}: AiToolOutputProps) {
  return (
    <div className="space-y-4">
      {/* Setup Instructions, Skills & MCP Servers */}
      {setupInstructions && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="w-full space-y-4">
              {/* Setup Steps */}
              <div>
                <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  {setupInstructions.title}
                </h3>
                <ol className="text-sm text-blue-700 dark:text-blue-300 list-decimal list-inside space-y-1">
                  {setupInstructions.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* Recommended Skills */}
              {setupInstructions.skills.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Recommended Skills & Commands
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {setupInstructions.skills.map((skill, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <code className="text-xs bg-blue-100 dark:bg-blue-800/40 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded font-mono whitespace-nowrap flex-shrink-0">
                          {skill.name}
                        </code>
                        <span className="text-blue-600 dark:text-blue-400 text-xs leading-5">
                          {skill.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended MCP Servers */}
              {setupInstructions.mcpServers.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Recommended MCP Servers
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {setupInstructions.mcpServers.map((server, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-xs bg-purple-100 dark:bg-purple-800/40 text-purple-800 dark:text-purple-200 px-1.5 py-0.5 rounded font-medium whitespace-nowrap flex-shrink-0">
                          {server.name}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 text-xs leading-5">
                          {server.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Download ZIP button */}
      {bundle && bundle.files.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadZip}
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? 'Generating ZIP...' : 'Download ZIP'}
          </Button>
        </div>
      )}

      {/* File list */}
      {bundle && bundle.files.length > 0 ? (
        bundle.files.map((file, index) => (
          <div
            key={file.path}
            className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 rounded-t-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                  {file.path}
                </span>
              </div>
              <button
                onClick={() => onCopy(file.content, index)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                {copiedIndex === index ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[600px]">
              <ToolContentRenderer content={file.content} filePath={file.path} />
            </div>
          </div>
        ))
      ) : (
        /* Fallback: show raw content if no files parsed */
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Generated Output
              </span>
            </div>
            <button
              onClick={() => onCopy(content, 'fallback')}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {copiedIndex === 'fallback' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="p-4 overflow-auto max-h-[600px]">
            <ToolContentRenderer content={content} isMarkdown={true} />
          </div>
        </div>
      )}

      {/* Reference Document */}
      {bundle?.referenceDoc && (
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-blue-50 dark:bg-blue-900/20 rounded-t-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Reference Document
              </span>
            </div>
            <button
              onClick={() => onCopy(bundle!.referenceDoc!, 'ref')}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {copiedIndex === 'ref' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="p-4 overflow-auto max-h-[600px]">
            <ToolContentRenderer content={bundle.referenceDoc} isMarkdown={true} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ToolOutputPage;

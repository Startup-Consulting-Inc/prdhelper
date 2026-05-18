/**
 * Blog post: Hermes Agent team gateway deployments — best practices
 * Source: docs/hermes-agents-best-practice.html
 */

import { Link } from 'react-router-dom';
import { BlogPostLayout, type FaqItem } from '../../../components/blog/BlogPostLayout';

function Code({ children }: { children: string }) {
  return (
    <pre className="not-prose overflow-x-auto rounded-xl bg-gray-900 text-gray-100 p-4 text-xs sm:text-sm font-mono my-6 border border-gray-700 whitespace-pre-wrap">
      <code>{children}</code>
    </pre>
  );
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="not-prose overflow-x-auto my-8 rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm border-collapse min-w-[520px]">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left p-3 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-100 dark:border-gray-700">
              {row.map((cell, j) => (
                <td key={j} className="p-3 text-gray-700 dark:text-gray-300 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What changes when Hermes moves from personal CLI to team gateway?',
    answer:
      'The gateway becomes a shared agent lifecycle manager: sessions are cached, prompt cache spans turns, voice and approvals route through adapters, and every authorized user can potentially trigger shell execution. Security, profiles, skills, memory scope, and observability must be designed—not defaulted.',
  },
  {
    question: 'Why avoid GATEWAY_ALLOW_ALL_USERS in production?',
    answer:
      'It turns your bot into an open shell trigger for anyone who discovers the handle. Pair with explicit allowlists or DM pairing so access is intentional and revocable.',
  },
  {
    question: 'Docker vs local terminal backend for gateways?',
    answer:
      'Never use local for production gateways—it runs commands as the gateway user on the host. Docker (cap-drop, no-new-privileges, resource limits, minimal env forwarding) is the recommended default; SSH separates messaging from execution when needed.',
  },
  {
    question: 'How do teams share skills without polluting personal memory?',
    answer:
      'Use external_dirs for read-only org skill trees (often git-managed), keep agent-created skills guardable via skills.guard_agent_created, and run the Curator on a schedule to prune stale or duplicate SKILL.md files.',
  },
  {
    question: 'Why Mem0 for multi-user gateways?',
    answer:
      'Built-in MEMORY.md / USER.md are small, frozen-at-session-start, and not user-scoped—facts collide across teammates on one gateway. Mem0 (or similar external provider) adds user-scoped semantic recall aligned to platform IDs.',
  },
];

export default function HermesTeamGatewayBestPracticesPost() {
  return (
    <BlogPostLayout
      title="Hermes Agent: Practical Best Practices for Team Gateway Deployments"
      author="Jaehee Song"
      date="2026-05-15"
      readTime="24 min read"
      category="AI & Development"
      excerpt="Production patterns for Hermes as a 24/7 team gateway: architecture and platforms, layered security (pairing, approvals, Docker), profiles and skill libraries, memory and compression, MCP governance, backends, cron, observability, and maintenance."
      slug="hermes-agent-team-gateway-best-practices"
      coverImage="HM"
      coverGradient="from-teal-600 to-emerald-900"
      faqItems={FAQ_ITEMS}
      relatedPosts={[
        {
          slug: 'openclaw-vs-hermes-agent',
          title: 'OpenClaw vs Hermes Agent: The 2026 Comparison',
          category: 'AI & Development',
          date: '2026-05-15',
        },
        {
          slug: 'hermes-agent-cost-saving',
          title: 'The $30 Bill That Should Have Been $7: Cost-Saving Moves for a Real AI Agent',
          category: 'AI & Development',
          date: '2026-04-22',
        },
        {
          slug: 'skills-vs-agents',
          title: 'Agents vs Skills: The Full Picture',
          category: 'AI & Development',
          date: '2026-04-23',
        },
      ]}
    >
      <div className="not-prose bg-teal-50 dark:bg-teal-950/25 border border-teal-200 dark:border-teal-800 rounded-xl p-6 my-8">
        <p className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-widest mb-2">
          TL;DR
        </p>
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
          Team gateways need deliberate choices across <strong>security isolation</strong>,{' '}
          <strong>authorization</strong>, <strong>profiles</strong>, <strong>skills</strong>,{' '}
          <strong>memory</strong>, <strong>MCP governance</strong>, <strong>terminal backends</strong>,{' '}
          <strong>cron</strong>, and <strong>observability</strong>. Layer controls—no single switch is
          enough—and keep updating: security fixes ship frequently.
        </p>
      </div>

      <h2>1. Gateway architecture for teams</h2>
      <p>
        The messaging gateway is not a thin proxy: it caches <code className="text-sm">AIAgent</code>{' '}
        instances per session, preserves Anthropic prompt cache across turns, routes approvals, and
        manages hygiene. Multi-platform mode shares memory and configuration unless you isolate with{' '}
        <strong>profiles</strong>.
      </p>

      <DataTable
        headers={['Platform', 'Setup', 'Voice', 'Groups', 'Best for']}
        rows={[
          ['Telegram', 'Low', 'Full', 'Yes', 'Fast 24/7 team rollout'],
          ['Discord', 'Medium', 'Full', 'Yes', 'Engineering teams, roles'],
          ['Slack', 'Medium', 'Limited', 'Yes', 'Corporate integrations'],
          ['WhatsApp', 'Medium', 'Full', 'No', 'Individual / mobile-first'],
          ['Signal', 'Low', 'Full', 'No', 'Privacy-focused individuals'],
        ]}
      />

      <p>
        Run <code className="text-sm">hermes gateway add &lt;platform&gt;</code> per surface, then{' '}
        <code className="text-sm">hermes gateway start</code>. Adapters reconnect independently—partial
        outage on one channel should not kill the others.
      </p>

      <h2>2. Security hardening</h2>
      <p>
        Treat production gateways like privileged automation:{' '}
        <strong>authorization</strong>, <strong>approvals</strong>, <strong>container isolation</strong>,{' '}
        <strong>secrets hygiene</strong>, and <strong>network policy</strong> stack together.
      </p>

      <h3>2.1 Never use GATEWAY_ALLOW_ALL_USERS</h3>
      <p>
        Prefer <strong>static allowlists</strong> for tiny stable teams, or{' '}
        <strong>DM pairing</strong> for growth: users request a code, admins run{' '}
        <code className="text-sm">hermes pairing approve …</code>. Codes expire (~1 hour), rate limits
        apply, and repeated failures can lock the platform temporarily.
      </p>
      <Code
        children={`hermes pairing list
hermes pairing revoke telegram 987654321
hermes pairing clear-pending`}
      />

      <h3>2.2 Approval modes</h3>
      <DataTable
        headers={['Mode', 'Behavior', 'Use case']}
        rows={[
          ['manual (default)', 'Prompt on risky commands', 'Maximum safety; can backlog under load'],
          ['smart', 'Risk-ranked auto approve/deny/prompt', 'Balanced production default'],
          ['off', 'No checks (YOLO)', 'CI/disposable sandboxes only'],
        ]}
      />

      <h3>2.3 Terminal backends</h3>
      <p>
        Do <strong>not</strong> run production gateways on <code className="text-sm">local</code>{' '}
        backend. Prefer Docker with hardened flags and empty{' '}
        <code className="text-sm">docker_forward_env</code> unless you explicitly scope secrets.
      </p>
      <Code
        children={`docker:
  backend: docker
  docker_image: "nikolaik/python-nodejs:python3.11-nodejs20"
  docker_forward_env: []
  container_cpu: 1
  container_memory: 5120
  container_disk: 51200
  container_persistent: true`}
      />

      <p>For execution on another host while the gateway stays DMZ-safe:</p>
      <Code
        children={`terminal:
  backend: ssh
  persistent_shell: true

# ~/.hermes/.env — never commit
TERMINAL_SSH_HOST=agent-worker.local
TERMINAL_SSH_USER=hermes
TERMINAL_SSH_KEY=~/.ssh/hermes_agent_key`}
      />

      <h3>2.4 Credentials and MCP env</h3>
      <p>
        Keep secrets in <code className="text-sm">~/.hermes/.env</code> at mode{' '}
        <code className="text-sm">0600</code>. MCP subprocesses receive filtered env—declare only what
        each server needs.
      </p>
      <Code
        children={`mcp_servers:
  github:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "ghp_..."`}
      />

      <h3>2.5 Website blocklist</h3>
      <Code
        children={`security:
  website_blocklist:
    enabled: true
    domains:
      - "*.internal.company.com"
      - "admin.example.com"`}
      />

      <h3>2.6 Production checklist (samples)</h3>
      <DataTable
        headers={['#', 'Check', 'Verify']}
        rows={[
          ['1', 'Explicit allowlists', 'hermes pairing list'],
          ['2', 'Docker backend', 'hermes config get terminal.backend → docker'],
          ['3', 'Resource limits', 'container_* defined'],
          ['4', 'Secrets chmod', '~/.hermes/.env is -rw-------'],
          ['5', 'No open gateway', 'No GATEWAY_ALLOW_ALL_USERS=true'],
          ['6', 'Non-root gateway', 'whoami ≠ root'],
          ['7', 'Logs', 'journalctl -u hermes-gateway'],
          ['8', 'Patches', 'hermes update within ~7 days'],
        ]}
      />

      <h2>3. Profiles and distributions</h2>
      <p>
        Profiles isolate config, env, memory, and skills. Clone a golden profile per role or user;
        ship standards via git-backed <strong>profile distributions</strong> (
        <code className="text-sm">hermes profile install …</code>).{' '}
        <code className="text-sm">auth.json</code> and <code className="text-sm">.env</code> stay local.
      </p>
      <Code
        children={`hermes profile list
hermes profile create NAME --clone
hermes profile use NAME
hermes profile export NAME
hermes profile install https://github.com/your-org/hermes-team.git`}
      />

      <DataTable
        headers={['Pattern', 'Structure', 'When']}
        rows={[
          ['Shared gateway', 'Single default profile', 'Small tight teams'],
          ['Role-based', 'devops / backend / frontend', 'Different toolsets'],
          ['Environment-based', 'prod / staging / dev', 'Different risk tiers'],
          ['User-isolated', 'Per-user profiles', 'Personal memory on shared host'],
          ['Hybrid', 'Base distribution + overlays', 'Org standards + personalization'],
        ]}
      />

      <h2>4. Skills at scale</h2>
      <p>
        Progressive disclosure keeps token cost manageable (~600 tokens for dozens of skills in the
        index). Share read-only trees via <code className="text-sm">external_dirs</code>; agent writes
        land under <code className="text-sm">~/.hermes/skills/</code> (local overrides win).
      </p>
      <Code
        children={`skills:
  external_dirs:
    - /opt/hermes-team-skills
    - /home/shared/project-skills
  guard_agent_created: true   # review before auto-saving workflows`}
      />

      <p>
        Run the <strong>Curator</strong> on a cadence: grade, prune low scores, consolidate duplicates (
        <code className="text-sm">hermes curator run --dry-run</code> first).
      </p>

      <h2>5. Memory and context</h2>
      <p>
        Built-in <code className="text-sm">MEMORY.md</code> (~2.2k chars) and{' '}
        <code className="text-sm">USER.md</code> (~1.375k chars) snapshot into the system prompt at
        session start—updates mid-session apply next boot. On shared gateways, facts blend across
        teammates unless you adopt profiles or external memory.
      </p>
      <p>
        <strong>Mem0</strong> is recommended for multi-user semantic recall with user scoping:
      </p>
      <Code
        children={`memory:
  provider: mem0
  mem0:
    api_key: "\${MEM0_API_KEY}"
    user_id_field: "platform_user_id"`}
      />

      <p>
        Compression pairs <strong>gateway session hygiene</strong> (~85% window) with{' '}
        <strong>ContextCompressor</strong> (~50% threshold): prune stale tool blobs, protect recent
        tail, summarize the middle with an auxiliary model.
      </p>
      <Code
        children={`compression:
  enabled: true
  threshold: 0.50
  target_ratio: 0.20
  protect_last_n: 20`}
      />

      <p>
        For Anthropic, keep the system prefix stable to preserve prompt cache; Hermes uses a{' '}
        <code className="text-sm">system_and_3</code> caching strategy—mutating the system block every
        turn defeats savings.
      </p>

      <h2>6. MCP governance</h2>
      <p>
        MCP servers run external code and may trigger nested LLM calls—cap sampling budgets and
        whitelist tools.
      </p>
      <Code
        children={`mcp_servers:
  github:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-github"]
    tools:
      include: [list_issues, create_issue, update_issue, search_code]
      exclude: [delete_repository]
      resources: false
      prompts: false`}
      />

      <p>
        Reload MCP without bouncing the gateway: <code className="text-sm">hermes mcp reload</code>.
      </p>

      <h2>7. Terminal backend matrix</h2>
      <DataTable
        headers={['Backend', 'Isolation', 'Best for']}
        rows={[
          ['local', 'None', 'Dev laptops only'],
          ['docker', 'Namespaces + caps', 'Default production gateway'],
          ['ssh', 'Network boundary', 'Gateway DMZ + internal workers'],
          ['modal', 'Cloud VM', 'Ephemeral compute'],
          ['daytona', 'Cloud container', 'Hibernating sandboxes'],
          ['vercel_sandbox', 'MicroVM', 'Vercel-centric workflows'],
          ['singularity', 'HPC-style', 'Shared clusters'],
        ]}
      />

      <h2>8. Cron and automation</h2>
      <p>
        Gateway cron checks every ~60 seconds; jobs spawn fresh agents, optionally attach skills, and
        deliver to a channel.
      </p>
      <Code
        children={`hermes cron add "every day at 9am" \\
  --task "Generate daily progress report from memory" \\
  --deliver telegram

hermes cron add "0 9 * * 1-5" \\
  --task "Weekly team summary" \\
  --deliver slack`}
      />

      <h2>9. Workspace directories</h2>
      <DataTable
        headers={['Context', 'Default CWD', 'Override']}
        rows={[
          ['CLI', 'Where you launched', 'cd first'],
          ['Messaging gateway', '~', 'MESSAGING_CWD in .env'],
          ['Docker / SSH', 'Home inside target', 'TERMINAL_CWD'],
        ]}
      />
      <Code children={`MESSAGING_CWD=/home/hermes/gateway-workspace`} />

      <h2>10. Observability</h2>
      <p>
        Structured logs live under <code className="text-sm">~/.hermes/logs/</code> with redaction.
        Enable Langfuse via the bundled observability plugin for trace-level cost and latency insight.
      </p>
      <Code
        children={`hermes plugins enable observability/langfuse

# ~/.hermes/.env
HERMES_LANGFUSE_PUBLIC_KEY=pk-lf-...
HERMES_LANGFUSE_SECRET_KEY=sk-lf-...
HERMES_LANGFUSE_BASE_URL=https://cloud.langfuse.com`}
      />

      <h2>11. 24/7 service management</h2>
      <Code
        children={`sudo hermes gateway install --system
sudo hermes gateway start --system

# Multiple installs via HERMES_HOME
export HERMES_HOME=/opt/hermes-prod`}
      />

      <h2>12. Context files</h2>
      <DataTable
        headers={['File', 'Role', 'Notes']}
        rows={[
          ['.hermes.md / HERMES.md', 'Project instructions (high priority)', 'Walk to git root'],
          ['AGENTS.md', 'Architecture / conventions', 'CWD + children'],
          ['CLAUDE.md', 'Claude Code parity', 'Discovery alongside AGENTS'],
          ['.cursorrules', 'Cursor parity', 'CWD only'],
          ['SOUL.md', 'Voice / tone', 'HERMES_HOME only'],
        ]}
      />

      <h2>13. Multi-agent patterns</h2>
      <p>
        Use <code className="text-sm">delegate_task</code> for parallel research branches or
        separate implement vs validate loops—each subagent gets its own thread and tooling context.
      </p>

      <h2>14. Maintenance discipline</h2>
      <Code
        children={`hermes --version
hermes update
hermes config check
hermes config migrate
sudo hermes gateway restart --system`}
      />
      <DataTable
        headers={['Cadence', 'Task']}
        rows={[
          ['Daily', 'Scan gateway logs'],
          ['Weekly', 'hermes curator run; review pairing queue'],
          ['Monthly', 'Update + migrate config'],
          ['Quarterly', 'Full security checklist replay'],
        ]}
      />

      <h2>15. Summary matrix</h2>
      <DataTable
        headers={['Dimension', 'Recommendation']}
        rows={[
          ['Platform', 'Telegram first; add Discord for engineering'],
          ['Authorization', 'DM pairing + admin approval'],
          ['Approvals', 'smart for production throughput'],
          ['Terminal', 'Docker + empty docker_forward_env'],
          ['Secrets', '.env 0600; never bulk-forward env'],
          ['Profiles', 'Base distribution + personal overlays'],
          ['Skills', 'external_dirs + Curator'],
          ['Memory', 'Mem0 when multi-user recall matters'],
          ['MCP', 'Tool filters + sampling caps'],
          ['Observability', 'Langfuse + log alerts'],
          ['Updates', 'Weekly hermes update habit'],
        ]}
      />

      <p className="mt-8 text-gray-700 dark:text-gray-300">
        Layered security only works with operational hygiene—review pairing lists, prune skills,
        patch promptly, and monitor logs. Compounding agent value (skills + memory + cron) depends on
        that foundation.
      </p>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-10">
        Condensed from <code className="text-xs">docs/hermes-agents-best-practice.html</code>. Verify
        commands against your Hermes version. For framework trade-offs see{' '}
        <Link to="/blog/openclaw-vs-hermes-agent" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
          OpenClaw vs Hermes Agent
        </Link>
        .
      </p>
    </BlogPostLayout>
  );
}

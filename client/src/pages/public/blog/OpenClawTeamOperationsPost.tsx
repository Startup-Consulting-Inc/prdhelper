/**
 * Blog post: OpenClaw team operations — security, memory, governance
 * Source: docs/openclaw-best-practice.html
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
      <table className="w-full text-sm border-collapse min-w-[480px]">
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
    question: 'Why does single-user OpenClaw setup break for a five-developer team?',
    answer:
      'Default assumptions collapse when multiple people share one gateway: conversations mix, shared API keys hide spend attribution, scheduled jobs conflict, and memory fills until compaction drops detail everyone relied on. Team ops require binding, permissions, session isolation, per-developer keys, and governance over skills.',
  },
  {
    question: 'What is the minimum OpenClaw security baseline?',
    answer:
      'Tier 1 (Foundation): bind the gateway to 127.0.0.1 (never 0.0.0.0), disable mDNS broadcasting, keep device auth enabled, tighten chmod on ~/.openclaw and credentials, and use DM allowlists for messaging platforms so random users cannot drive the agent.',
  },
  {
    question: 'How do I stop developers from sharing one chat session?',
    answer:
      'Set session.dmScope to per-channel-peer so each peer gets an isolated session thread. Combine with Telegram (or other channel) allowlists so only known IDs can talk to the bot.',
  },
  {
    question: 'How should teams handle ClawHub / plugin risk?',
    answer:
      'Treat skills as supply-chain code: require peer review before install, pin versions, and run openclaw security audit --deep on a schedule. The guide recommends never installing blindly.',
  },
  {
    question: 'What should we do first if we suspect a compromise?',
    answer:
      'Stop the gateway before deep investigation, snapshot ~/.openclaw for evidence, revoke API keys and OAuth at providers, rotate the gateway token from a clean machine, and prefer rebuilding the host rather than “cleaning” a compromised server.',
  },
];

export default function OpenClawTeamOperationsPost() {
  return (
    <BlogPostLayout
      title="OpenClaw Team Operations: Security, Memory, and Maintenance at Scale"
      author="Jaehee Song"
      date="2026-05-15"
      readTime="22 min read"
      category="AI & Development"
      excerpt="Self-hosted OpenClaw for a shared five-developer VM: three security tiers, memory and compaction tuning, session isolation, credential hygiene, skills auditing, backups, cron maintenance, a complete starter openclaw.json, and incident response."
      slug="openclaw-team-operations-guide"
      coverImage="OC"
      coverGradient="from-blue-600 to-indigo-800"
      faqItems={FAQ_ITEMS}
      relatedPosts={[
        {
          slug: 'openclaw-vs-hermes-agent',
          title: 'OpenClaw vs Hermes Agent: The 2026 Comparison',
          category: 'AI & Development',
          date: '2026-05-15',
        },
        {
          slug: 'clearly-openclaw-attendance-case-study',
          title: 'From Idea to a Live Web Service in Under an Hour: Clearly + OpenClaw',
          category: 'AI & Development',
          date: '2026-05-14',
        },
        {
          slug: 'ai-coding-tools-requirements',
          title: 'Why AI Coding Tools Need Better Requirements First',
          category: 'AI & Development',
          date: '2026-03-14',
        },
      ]}
    >
      <div className="not-prose bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 my-8">
        <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest mb-2">
          Audience
        </p>
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
          This guide targets a <strong>self-hosted, five-developer team</strong> on shared VMs where
          OpenClaw shifts from “personal assistant” to <strong>team productivity surface</strong>.
          It focuses on memory loss between sessions, unpredictable behavior, credential sprawl, and
          context bloat—with concrete config, scripts, and checklists.
        </p>
      </div>

      <h2>1. Security hardening: three progressive tiers</h2>
      <p>
        Shared gateways break the “one trusted operator” assumption: the gateway token is full
        access. Use a tiered plan—Foundation → Proactive Defense → Maximum Protection—matched to
        risk and time.
      </p>

      <DataTable
        headers={['Tier', 'Setup time', 'Monthly ops', 'Protection', 'Best for']}
        rows={[
          ['Tier 1: Foundation', '≈1 hour', '≈30 min', '~60%', 'Minimum bar — do not skip'],
          ['Tier 2: Proactive Defense', '+2 hours', '≈1 hour', '~85%', 'Most teams'],
          ['Tier 3: Maximum Protection', '+2–3 hours', '≈1.5 hours', '~95%', 'Sensitive data / prod touch'],
        ]}
      />

      <h3>1.1 Tier 1 — Foundation</h3>
      <p>
        Bind the gateway to <code className="text-sm">127.0.0.1</code> only;{' '}
        <code className="text-sm">0.0.0.0</code> exposes the agent on the network. Disable mDNS,
        keep device auth on, and list trusted proxy CIDRs if you terminate TLS in front.
      </p>
      <Code
        children={`gateway:
  host: "127.0.0.1"  # NEVER 0.0.0.0
  port: 18789
  trustedProxies:
    - "10.0.0.0/8"
    - "172.16.0.0/12"
    - "192.168.0.0/16"
    - "100.64.0.0/10"   # Tailscale — add if you use it
  controlUi:
    dangerouslyDisableDeviceAuth: false

mdns:
  enabled: false`}
      />

      <p>
        Lock filesystem permissions immediately after install so only the OpenClaw user reads
        secrets.
      </p>
      <Code
        children={`chmod 700 ~/.openclaw
chmod 600 ~/.openclaw/openclaw.json
chmod 600 ~/.openclaw/gateway.yaml
chmod -R 600 ~/.openclaw/credentials/

chmod 700 ~/clawd
chmod 600 ~/clawd/SOUL.md
chmod 600 ~/clawd/MEMORY.md`}
      />

      <p>
        For a five-person team on Telegram (or similar), use <strong>allowlist</strong> DM policy
        so only known numeric IDs can message the bot.
      </p>

      <h3>1.2 Tier 2 — Proactive defense</h3>
      <p>
        Restrict filesystem paths and shell commands so juniors (or the model) cannot pivot into
        ~/.ssh or wipe disks. Disable broad network tools unless you truly need them.
      </p>
      <Code
        children={`tools:
  filesystem:
    enabled: true
    allowedPaths:
      - /home/openclaw/workspace
      - /home/openclaw/projects
    deniedPaths:
      - /home/openclaw/.ssh
      - /home/openclaw/.openclaw/credentials
      - /etc
  shell:
    enabled: true
    allowlist:
      - git
      - npm
      - node
      - python3
      - pip
      - docker
    denylist:
      - rm -rf /
      - mkfs
      - dd
  network:
    enabled: false`}
      />

      <p>Weekly automation example: log listener port, non-loopback listeners, permissions, and gateway YAML snippets.</p>
      <Code
        children={`#!/bin/bash
REPORT=~/security-report-$(date +%Y%m%d).txt
echo "=== Gateway ===" >> "$REPORT"
ss -tlnp | grep 18789 >> "$REPORT"
echo "=== Non-loopback listeners ===" >> "$REPORT"
ss -tlnp | grep -v 127.0.0.1 >> "$REPORT"
echo "=== ~/.openclaw listing ===" >> "$REPORT"
ls -la ~/.openclaw/ >> "$REPORT"
grep -E "host:|dangerouslyDisableDeviceAuth|mDNS" ~/.openclaw/gateway.yaml >> "$REPORT"`}
      />

      <h3>1.3 Tier 3 — Maximum protection</h3>
      <p>
        For agents that could touch production data, isolate the runtime: dedicated Docker network,
        read-only root where possible, capability drops, and tightly scoped egress (e.g. LiteLLM on
        an internal-only network).
      </p>
      <Code
        children={`# docker-compose excerpt — illustrative pattern
services:
  openclaw:
    image: openclaw/openclaw:latest
    network_mode: none   # block raw internet if your topology allows
    read_only: true
    tmpfs:
      - /tmp:size=64M
    cap_drop: [ALL]
    security_opt:
      - no-new-privileges:true`}
      />

      <h2>2. Memory management</h2>
      <p>
        Sessions start cold unless you design persistence. When the context window fills,
        compaction summarizes and drops older turns—team members lose shared nuance unless you
        externalize it.
      </p>

      <h3>2.1 Compaction tuning</h3>
      <p>
        <code className="text-sm">reserveTokensFloor</code> around <strong>32,000</strong> is a
        balanced team default in the source guide—room before aggressive compaction.
      </p>
      <Code
        children={`{
  "agents": {
    "defaults": {
      "compaction": {
        "mode": "safeguard",
        "reserveTokensFloor": 32000
      }
    }
  }
}`}
      />

      <h3>2.2 Stable vs dynamic workspace files</h3>
      <p>
        Keep rarely changing instructions in stable files (better cache behavior); put churn in{' '}
        <code className="text-sm">MEMORY.md</code> and dated logs under{' '}
        <code className="text-sm">memory/</code>.
      </p>
      <Code
        children={`/workspace/
├── SOUL.md              # STABLE — persona
├── AGENTS.md            # STABLE — team rules
├── USER.md              # STABLE — goals
├── TOOLS.md             # STABLE — tool docs
├── MEMORY.md            # DYNAMIC — working memory
├── HEARTBEAT.md         # scheduled / recurring tasks
└── memory/
    ├── 2026-05-16.md
    └── project-alpha.md`}
      />

      <p>
        Before <code className="text-sm">/new</code>, save the tail of the conversation to{' '}
        <code className="text-sm">conversation-pre-compact.md</code> and instruct the agent in{' '}
        <code className="text-sm">AGENTS.md</code> to read it on boot.
      </p>

      <h3>2.3 Context pruning</h3>
      <Code
        children={`{
  "agents": {
    "defaults": {
      "contextPruning": {
        "mode": "cache-ttl",
        "ttl": "5m"
      }
    }
  }
}`}
      />

      <h2>3. Agent governance</h2>
      <p>
        Five developers share one powerful actor—scope tools and sessions instead of trusting
        discipline alone.
      </p>

      <h3>3.1 Session isolation</h3>
      <Code
        children={`{
  "session": { "dmScope": "per-channel-peer" },
  "channels": {
    "telegram": {
      "dmPolicy": "allowlist",
      "allowFrom": ["tg:12345", "tg:67890"]
    }
  }
}`}
      />

      <h3>3.2 Specialized agents</h3>
      <p>
        Split “coder” vs “writer” profiles with explicit allowed/forbidden tools in each workspace’s{' '}
        <code className="text-sm">SOUL.md</code> (and mirror restrictions in tools config).
      </p>

      <h3>3.3 Coordinator pattern</h3>
      <p>
        Designate one lightweight agent (or schedule) responsible for memory hygiene, inbox
        routing, and weekly checks driven from <code className="text-sm">HEARTBEAT.md</code>.
      </p>

      <h2>4. Workspace layout for collaboration</h2>
      <p>
        Separate shared rules from per-developer sandboxes so checkouts and memories do not
        overwrite each other.
      </p>
      <Code
        children={`~/.openclaw/
├── openclaw.json
├── workspace/
│   ├── CLAUDE.md
│   ├── projects/
│   │   └── project-alpha/
│   └── agents-workspaces/
│       ├── dev-alice/
│       └── dev-bob/`}
      />

      <p>
        Prefer <strong>inbox files</strong> over agents chatting directly—clear audit trail and fewer
        race conditions.
      </p>

      <h2>5. Credential management</h2>
      <p>
        Shared keys hide who burned budget and amplify blast radius on leak. Pattern recommended in
        the guide: per-developer credential files under{' '}
        <code className="text-sm">~/.openclaw/credentials/</code>.
      </p>
      <p>
        Rotate the gateway token monthly; store the canonical value in a password manager, never in
        Git.
      </p>

      <h2>6. Cache, models, and cost</h2>
      <p>
        Enable prompt caching; separate stable system content from volatile logs. Use primary +
        fallback models so simple turns do not always hit the most expensive tier.
      </p>
      <Code
        children={`{
  "agents": {
    "defaults": {
      "cache": { "enabled": true, "ttl": "5m", "priority": "high" },
      "model": {
        "primary": "anthropic/claude-sonnet-4-5",
        "fallbacks": ["anthropic/claude-haiku-4-5", "google/gemini-3-pro"]
      }
    }
  }
}`}
      />

      <p>
        Cap per-agent Docker resources on shared hosts (example: 512&nbsp;MiB / 1 CPU per agent
        container).
      </p>

      <h3>Session cleanup</h3>
      <Code
        children={`{
  "session": {
    "maintenance": {
      "mode": "enforce",
      "pruneAfter": "30d",
      "maxEntries": 500
    }
  }
}`}
      />

      <h2>7. Skills governance</h2>
      <p>
        Marketplace skills are executable supply chain. Require review, pin revisions, and audit
        regularly.
      </p>
      <Code children={`openclaw security audit --deep`} />

      <h2>8. Backup and recovery</h2>
      <p>
        Encrypt backups at rest; verify restores quarterly—an untested backup is a ritual, not a
        control.
      </p>
      <Code
        children={`#!/bin/bash
ARCHIVE_DIR="/backups/openclaw"
openclaw backup create --output "$ARCHIVE_DIR" --verify
# Then encrypt with age/gpg and delete plaintext archive per org policy`}
      />

      <h2>9. Monitoring and cron</h2>
      <Code
        children={`0 5 * * * openclaw sessions cleanup --enforce
0 9 * * 1 openclaw security audit --json > /var/log/openclaw-audit.json
0 2 1 * * /home/openclaw/openclaw-backup.sh`}
      />

      <h2>10. Quick-start <code className="text-base">openclaw.json</code> (five devs)</h2>
      <p>
        Combined baseline from the source doc—replace Telegram IDs and inject the real gateway
        token via environment.
      </p>
      <Code
        children={`{
  "gateway": {
    "host": "127.0.0.1",
    "port": 18789,
    "trustedProxies": ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16", "100.64.0.0/10"],
    "auth": {
      "mode": "token",
      "token": "\${OPENCLAW_GATEWAY_TOKEN}",
      "allowTailscale": true
    },
    "controlUi": { "dangerouslyDisableDeviceAuth": false }
  },
  "mdns": { "enabled": false },
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-4-5",
        "fallbacks": ["anthropic/claude-haiku-4-5", "google/gemini-3-pro"]
      },
      "compaction": {
        "mode": "safeguard",
        "reserveTokensFloor": 32000,
        "memoryFlush": { "softThresholdTokens": 31000 }
      },
      "contextPruning": { "mode": "cache-ttl", "ttl": "5m" },
      "cache": { "enabled": true, "ttl": "5m", "priority": "high" },
      "sandbox": { "mode": "non-main" },
      "tools": { "profile": "standard" }
    },
    "list": [
      {
        "id": "coordinator",
        "workspace": "~/.openclaw/workspace/agents-workspaces/coordinator",
        "description": "Team coordinator — memory consolidation, task tracking"
      },
      {
        "id": "dev-default",
        "workspace": "~/.openclaw/workspace/agents-workspaces/dev-default",
        "description": "Default development agent"
      }
    ]
  },
  "session": {
    "dmScope": "per-channel-peer",
    "maintenance": { "mode": "enforce", "pruneAfter": "30d", "maxEntries": 500 }
  },
  "channels": {
    "telegram": {
      "dmPolicy": "allowlist",
      "allowFrom": ["tg:DEV1_ID", "tg:DEV2_ID", "tg:DEV3_ID", "tg:DEV4_ID", "tg:DEV5_ID"],
      "groups": { "*": { "requireMention": true } }
    }
  },
  "logging": { "level": "info", "redact": true }
}`}
      />

      <h2>11. Incident response</h2>
      <p>
        <strong>Stop services first</strong>, then preserve evidence, then revoke secrets from a
        clean machine.
      </p>
      <Code
        children={`openclaw gateway stop
# Snapshot evidence
mkdir ~/openclaw-incident-$(date +%Y%m%d-%H%M%S)
cp -r ~/.openclaw ~/openclaw-incident-$(date +%Y%m%d-%H%M%S)/`}
      />
      <ol>
        <li>Revoke all LLM and SaaS API keys at providers.</li>
        <li>Disconnect compromised integrations (GitHub, Slack, Telegram).</li>
        <li>Rotate passwords and gateway tokens from uncompromised hardware.</li>
        <li>Rebuild the server rather than trusting an in-place wipe.</li>
      </ol>

      <h2>Summary checklist</h2>
      <DataTable
        headers={['Priority', 'Area', 'Key action']}
        rows={[
          ['P0', 'Security', '127.0.0.1 bind, chmod 600 secrets, Telegram allowlist'],
          ['P0', 'Passwords', 'Per-developer API keys; rotate gateway token monthly'],
          ['P1', 'Memory', 'reserveTokensFloor 32000; boot-read conversation snapshot'],
          ['P1', 'Cost', 'Enable caching; fallbacks; prune old sessions'],
          ['P1', 'Safety', 'Tool limits; per-channel-peer sessions'],
          ['P2', 'Workspaces', 'Separate dev folders; shared rules only where intentional'],
          ['P2', 'Plugins', 'Review + pin; scheduled security audit'],
          ['P2', 'Backups', 'Encrypted backups; tested restore'],
        ]}
      />

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-10">
        Derived from <code className="text-xs">docs/openclaw-best-practice.html</code>. Adapt paths,
        provider IDs, and compliance rules to your organization. Clearly can generate aligned agent
        instruction files—see the{' '}
        <Link to="/blog/clearly-openclaw-attendance-case-study" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
          Clearly + OpenClaw case study
        </Link>
        .
      </p>
    </BlogPostLayout>
  );
}

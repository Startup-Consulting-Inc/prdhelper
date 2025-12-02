/**
 * Tech Stack Guidance Data
 *
 * Comprehensive guidance content for tech preferences including:
 * - Category descriptions for tooltips
 * - Detailed overviews for dialogs
 * - Pros/cons analysis for each option
 * - Best use cases and recommendations
 * - Setup difficulty ratings
 * - External documentation links
 */

export interface TechOptionGuidance {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
  setupDifficulty: 'Easy' | 'Moderate' | 'Complex';
  documentation?: string;
  popularity?: 'High' | 'Medium' | 'Growing';
}

export interface CategoryGuidance {
  title: string;
  description: string; // Brief tooltip content
  overview: string; // Detailed dialog intro
  options: TechOptionGuidance[];
  recommendations: string[];
  learnMoreUrl?: string;
}

export const TECH_GUIDANCE: Record<string, CategoryGuidance> = {
  frontend: {
    title: 'Frontend Framework',
    description: 'JavaScript/TypeScript frameworks for building interactive user interfaces',
    overview:
      'Frontend frameworks provide structure and tools for building modern web applications. Your choice impacts developer experience, performance, ecosystem, and hiring. Consider team expertise, project requirements, and long-term maintainability.',
    options: [
      {
        name: 'React (Vite)',
        description:
          'Component-based library with fast Vite build tooling. Industry standard with massive ecosystem.',
        pros: [
          'Largest ecosystem and community',
          'Excellent job market and hiring pool',
          'Flexible and composable',
          'Vite provides blazing-fast dev server',
          'React Server Components in Next.js',
        ],
        cons: [
          'Requires additional libraries for routing/state',
          'JSX syntax learning curve',
          'Fast-paced breaking changes',
          'Choice paralysis with too many options',
        ],
        bestFor: [
          'Startups needing fast development',
          'Projects requiring extensive third-party integrations',
          'Teams with React experience',
          'Performance-critical applications',
        ],
        setupDifficulty: 'Easy',
        popularity: 'High',
        documentation: 'https://react.dev/',
      },
      {
        name: 'Vue.js',
        description:
          'Progressive framework with intuitive API and excellent documentation. Great balance of simplicity and power.',
        pros: [
          'Gentle learning curve',
          'Excellent official documentation',
          'Built-in routing and state management',
          'Single-file components (SFC)',
          'TypeScript support improving',
        ],
        cons: [
          'Smaller ecosystem than React',
          'Fewer enterprise adoptions',
          'Composition API vs Options API confusion',
          'Less corporate backing',
        ],
        bestFor: [
          'Small to medium projects',
          'Teams new to modern frameworks',
          'Projects valuing simplicity',
          'Rapid prototyping',
        ],
        setupDifficulty: 'Easy',
        popularity: 'High',
        documentation: 'https://vuejs.org/',
      },
      {
        name: 'Angular',
        description:
          'Full-featured framework by Google. Opinionated with built-in solutions for routing, forms, HTTP, and testing.',
        pros: [
          'Complete solution out of the box',
          'Strong TypeScript integration',
          'Excellent for large enterprise apps',
          'Powerful CLI and tooling',
          'Backed by Google',
        ],
        cons: [
          'Steeper learning curve',
          'Verbose code and boilerplate',
          'Heavyweight compared to alternatives',
          'Frequent breaking changes historically',
        ],
        bestFor: [
          'Large enterprise applications',
          'Teams familiar with TypeScript/OOP',
          'Projects requiring standardization',
          'Long-term maintained applications',
        ],
        setupDifficulty: 'Complex',
        popularity: 'Medium',
        documentation: 'https://angular.io/',
      },
      {
        name: 'Svelte',
        description:
          'Compiler-based framework that ships minimal runtime code. Reactive by default with simple syntax.',
        pros: [
          'Smallest bundle sizes',
          'True reactivity without virtual DOM',
          'Simple, intuitive syntax',
          'Excellent performance',
          'SvelteKit for full-stack',
        ],
        cons: [
          'Smaller ecosystem and community',
          'Fewer job opportunities',
          'Limited third-party component libraries',
          'Less enterprise adoption',
        ],
        bestFor: [
          'Performance-critical applications',
          'Projects with tight bundle size budgets',
          'Teams valuing developer experience',
          'Interactive visualizations',
        ],
        setupDifficulty: 'Easy',
        popularity: 'Growing',
        documentation: 'https://svelte.dev/',
      },
    ],
    recommendations: [
      'Choose React for maximum ecosystem, hiring pool, and flexibility',
      'Pick Vue.js for simplicity, quick learning, and balanced features',
      'Select Angular for enterprise apps requiring standardization and structure',
      'Use Svelte for performance-critical apps or when bundle size matters most',
    ],
    learnMoreUrl: 'https://2024.stateofjs.com/en-US/libraries/front-end-frameworks/',
  },

  backend: {
    title: 'Backend Framework',
    description: 'Server-side frameworks for building APIs, handling business logic, and data processing',
    overview:
      'Backend frameworks handle HTTP requests, business logic, database access, and API design. Your choice affects performance, scalability, developer productivity, and ecosystem. Consider team expertise, project scale, and deployment environment.',
    options: [
      {
        name: 'Node.js (Express)',
        description:
          'Minimalist, flexible web framework for Node.js. Industry standard with massive middleware ecosystem.',
        pros: [
          'Huge ecosystem and community',
          'Extremely flexible and unopinionated',
          'JavaScript/TypeScript on backend',
          'Easy to learn and start',
          'Great for microservices',
        ],
        cons: [
          'Too flexible leads to inconsistency',
          'Requires careful architecture',
          'No built-in structure',
          'Callback hell without async/await',
        ],
        bestFor: [
          'Startups and MVPs',
          'RESTful APIs',
          'Real-time applications',
          'Teams proficient in JavaScript',
        ],
        setupDifficulty: 'Easy',
        popularity: 'High',
        documentation: 'https://expressjs.com/',
      },
      {
        name: 'Node.js (Fastify)',
        description:
          'High-performance Node.js framework focused on speed and low overhead. Modern with excellent TypeScript support.',
        pros: [
          'Excellent performance',
          'Schema-based validation',
          'Plugin architecture',
          'TypeScript-first design',
          'Low overhead',
        ],
        cons: [
          'Smaller ecosystem than Express',
          'Less community resources',
          'Steeper learning curve',
          'Fewer middleware options',
        ],
        bestFor: [
          'Performance-critical APIs',
          'Microservices',
          'Teams prioritizing type safety',
          'High-throughput applications',
        ],
        setupDifficulty: 'Moderate',
        popularity: 'Growing',
        documentation: 'https://fastify.dev/',
      },
      {
        name: 'Python (FastAPI)',
        description:
          'Modern Python framework with automatic API documentation and type checking. Built on Pydantic and Starlette.',
        pros: [
          'Automatic OpenAPI/Swagger docs',
          'Type hints and validation',
          'Excellent performance',
          'Easy async support',
          'Great for ML/AI integration',
        ],
        cons: [
          'Python deployment complexity',
          'Less suited for CPU-intensive tasks',
          'Smaller ecosystem than Django',
          'Newer with evolving best practices',
        ],
        bestFor: [
          'API-first projects',
          'ML/AI applications',
          'Data processing services',
          'Teams proficient in Python',
        ],
        setupDifficulty: 'Easy',
        popularity: 'High',
        documentation: 'https://fastapi.tiangolo.com/',
      },
      {
        name: 'Python (Django)',
        description:
          'Batteries-included Python framework with ORM, admin panel, and authentication built-in. Mature and stable.',
        pros: [
          'Complete solution out of the box',
          'Excellent ORM and admin interface',
          'Strong security defaults',
          'Mature ecosystem',
          'Great documentation',
        ],
        cons: [
          'Monolithic and heavyweight',
          'Slower than newer frameworks',
          'Less flexible architecture',
          'Overkill for simple APIs',
        ],
        bestFor: [
          'Content-heavy applications',
          'Admin-heavy projects',
          'Monolithic architectures',
          'Teams valuing conventions',
        ],
        setupDifficulty: 'Moderate',
        popularity: 'High',
        documentation: 'https://www.djangoproject.com/',
      },
      {
        name: 'Go (Gin)',
        description:
          'High-performance Go web framework. Compiled language with excellent concurrency and deployment simplicity.',
        pros: [
          'Exceptional performance',
          'Simple deployment (single binary)',
          'Built-in concurrency',
          'Strong typing',
          'Low resource usage',
        ],
        cons: [
          'Less flexible than dynamic languages',
          'Smaller ecosystem',
          'Verbose error handling',
          'Steeper learning curve',
        ],
        bestFor: [
          'High-performance services',
          'Cloud-native applications',
          'Microservices',
          'Resource-constrained environments',
        ],
        setupDifficulty: 'Moderate',
        popularity: 'Growing',
        documentation: 'https://gin-gonic.com/',
      },
    ],
    recommendations: [
      'Use Node.js (Express/Fastify) for JavaScript teams and rapid development',
      'Choose Python (FastAPI) for ML/AI integration and modern API design',
      'Pick Python (Django) for admin-heavy or content-driven applications',
      'Select Go for maximum performance and efficient resource usage',
    ],
    learnMoreUrl: 'https://survey.stackoverflow.co/2024/technology#most-popular-technologies-webframe',
  },

  database: {
    title: 'Database',
    description: 'Data storage systems for persisting and querying application data',
    overview:
      'Databases are critical infrastructure decisions affecting scalability, performance, and development speed. Choose between SQL (relational) and NoSQL (document/key-value) based on data structure, query patterns, and scaling needs. Consider managed services vs self-hosted options.',
    options: [
      {
        name: 'Google Cloud Firestore',
        description:
          'NoSQL document database with real-time sync and offline support. Serverless and fully managed by Google.',
        pros: [
          'Real-time synchronization',
          'Automatic scaling',
          'Offline support built-in',
          'No server management',
          'Generous free tier',
        ],
        cons: [
          'Limited query capabilities',
          'Expensive at scale',
          'Vendor lock-in to Google',
          'No complex transactions',
        ],
        bestFor: [
          'Real-time applications',
          'Mobile apps',
          'Prototypes and MVPs',
          'Projects on Google Cloud',
        ],
        setupDifficulty: 'Easy',
        popularity: 'High',
        documentation: 'https://firebase.google.com/docs/firestore',
      },
      {
        name: 'PostgreSQL',
        description:
          'Advanced open-source relational database with strong ACID compliance. Industry standard for reliability.',
        pros: [
          'ACID compliance and reliability',
          'Advanced features (JSON, full-text search)',
          'Excellent performance',
          'Strong community',
          'Free and open source',
        ],
        cons: [
          'Requires server management',
          'Vertical scaling limitations',
          'Complex setup and maintenance',
          'More expensive on managed platforms',
        ],
        bestFor: [
          'Complex relational data',
          'Data integrity critical apps',
          'Analytical workloads',
          'Long-term production systems',
        ],
        setupDifficulty: 'Moderate',
        popularity: 'High',
        documentation: 'https://www.postgresql.org/',
      },
      {
        name: 'MongoDB',
        description:
          'Popular NoSQL document database with flexible schema and horizontal scaling. JSON-like documents.',
        pros: [
          'Flexible schema design',
          'Horizontal scaling',
          'Rich query language',
          'Good developer experience',
          'Cloud-native (MongoDB Atlas)',
        ],
        cons: [
          'No ACID transactions (historically)',
          'Memory hungry',
          'Can lead to data inconsistency',
          'Over-used when SQL is better',
        ],
        bestFor: [
          'Rapidly evolving schemas',
          'Content management systems',
          'Real-time analytics',
          'Flexible data models',
        ],
        setupDifficulty: 'Easy',
        popularity: 'High',
        documentation: 'https://www.mongodb.com/',
      },
      {
        name: 'Supabase',
        description:
          'Open-source Firebase alternative built on PostgreSQL. Instant APIs, auth, and real-time subscriptions.',
        pros: [
          'PostgreSQL reliability',
          'Automatic API generation',
          'Real-time capabilities',
          'Open source',
          'Generous free tier',
        ],
        cons: [
          'Newer platform, evolving',
          'Less mature than competitors',
          'Limited geographic regions',
          'Potential vendor lock-in',
        ],
        bestFor: [
          'Rapid development',
          'Real-time apps needing SQL',
          'Startups and MVPs',
          'Projects avoiding Firebase lock-in',
        ],
        setupDifficulty: 'Easy',
        popularity: 'Growing',
        documentation: 'https://supabase.com/docs',
      },
    ],
    recommendations: [
      'Choose PostgreSQL for complex relational data and data integrity requirements',
      'Use Firestore for real-time sync, offline support, and rapid prototyping',
      'Pick MongoDB for flexible schemas and horizontal scaling needs',
      'Select Supabase for PostgreSQL reliability with modern dev experience',
    ],
    learnMoreUrl: 'https://survey.stackoverflow.co/2024/technology#most-popular-technologies-database',
  },

  authentication: {
    title: 'Authentication',
    description: 'User identity management and access control systems',
    overview:
      'Authentication handles user login, session management, and security. Choosing between building custom auth vs managed services affects security, development time, and maintenance burden. Managed services offer security best practices, compliance, and reduced liability.',
    options: [
      {
        name: 'Firebase Authentication',
        description:
          'Google-managed authentication with email/password, OAuth providers, and phone auth. Seamless Firebase integration.',
        pros: [
          'Quick setup',
          'Multiple auth methods',
          'Managed security',
          'Generous free tier',
          'Mobile SDKs',
        ],
        cons: [
          'Vendor lock-in to Google',
          'Limited customization',
          'Pricing scales with users',
          'Requires Firebase ecosystem',
        ],
        bestFor: [
          'Firebase-based projects',
          'Mobile applications',
          'Rapid prototyping',
          'Teams wanting managed solution',
        ],
        setupDifficulty: 'Easy',
        popularity: 'High',
        documentation: 'https://firebase.google.com/docs/auth',
      },
      {
        name: 'Auth0',
        description:
          'Enterprise-grade identity platform with extensive features, compliance, and customization options.',
        pros: [
          'Comprehensive features',
          'Enterprise-ready',
          'Extensive customization',
          'Compliance certifications',
          'Multi-tenant support',
        ],
        cons: [
          'Expensive at scale',
          'Complex configuration',
          'Overkill for simple projects',
          'Vendor lock-in',
        ],
        bestFor: [
          'Enterprise applications',
          'Multi-tenant SaaS',
          'Compliance-critical projects',
          'Complex auth requirements',
        ],
        setupDifficulty: 'Moderate',
        popularity: 'High',
        documentation: 'https://auth0.com/docs',
      },
      {
        name: 'Clerk',
        description:
          'Modern authentication and user management focused on developer experience. Beautiful pre-built UI components.',
        pros: [
          'Excellent DX',
          'Beautiful pre-built UI',
          'Modern features',
          'Quick integration',
          'Active development',
        ],
        cons: [
          'Newer, less proven',
          'Smaller community',
          'Pricing can scale quickly',
          'Limited enterprise features',
        ],
        bestFor: [
          'Modern web apps',
          'Developer productivity focus',
          'Teams valuing UI/UX',
          'SaaS applications',
        ],
        setupDifficulty: 'Easy',
        popularity: 'Growing',
        documentation: 'https://clerk.com/docs',
      },
      {
        name: 'NextAuth.js',
        description:
          'Open-source authentication library for Next.js. Flexible and customizable with no vendor lock-in.',
        pros: [
          'Open source and free',
          'No vendor lock-in',
          'Flexible customization',
          'Active community',
          'Next.js optimized',
        ],
        cons: [
          'Requires Next.js',
          'Self-managed security',
          'More setup required',
          'Less features than paid services',
        ],
        bestFor: [
          'Next.js projects',
          'Teams wanting control',
          'Budget-conscious projects',
          'Custom auth requirements',
        ],
        setupDifficulty: 'Moderate',
        popularity: 'High',
        documentation: 'https://next-auth.js.org/',
      },
    ],
    recommendations: [
      'Use Firebase Auth for quick setup and Firebase ecosystem integration',
      'Choose Auth0 for enterprise features, compliance, and multi-tenancy',
      'Pick Clerk for best developer experience and modern UI components',
      'Select NextAuth.js for Next.js projects and avoiding vendor lock-in',
    ],
    learnMoreUrl: 'https://supabase.com/blog/choosing-auth-provider',
  },

  cloudPlatform: {
    title: 'Cloud Platform',
    description: 'Infrastructure providers for hosting and scaling applications',
    overview:
      'Cloud platforms provide compute, storage, networking, and managed services. Your choice affects costs, performance, vendor lock-in, and operational complexity. Consider geographic requirements, pricing models, and ecosystem maturity.',
    options: [
      {
        name: 'Google Cloud Platform (GCP)',
        description:
          'Google comprehensive cloud platform with strong data/ML capabilities. Excellent for containerized workloads.',
        pros: [
          'Best-in-class Kubernetes (GKE)',
          'Strong ML/AI services',
          'Competitive pricing',
          'Global network',
          'BigQuery for analytics',
        ],
        cons: [
          'Smaller market share',
          'Fewer service offerings than AWS',
          'Less enterprise support',
          'Complex pricing',
        ],
        bestFor: [
          'Data-intensive applications',
          'ML/AI workloads',
          'Kubernetes deployments',
          'Analytics-heavy projects',
        ],
        setupDifficulty: 'Moderate',
        popularity: 'High',
        documentation: 'https://cloud.google.com/docs',
      },
      {
        name: 'Amazon Web Services (AWS)',
        description:
          'Market leader in cloud computing. Most comprehensive service catalog with global presence.',
        pros: [
          'Most mature and comprehensive',
          'Largest ecosystem',
          'Widest service selection',
          'Global infrastructure',
          'Enterprise support',
        ],
        cons: [
          'Complex and overwhelming',
          'Expensive at scale',
          'Steep learning curve',
          'Legacy services clutter',
        ],
        bestFor: [
          'Enterprise applications',
          'Complex architectures',
          'Multi-region deployments',
          'Projects requiring specific services',
        ],
        setupDifficulty: 'Complex',
        popularity: 'High',
        documentation: 'https://docs.aws.amazon.com/',
      },
      {
        name: 'Vercel',
        description:
          'Platform optimized for frontend and serverless. Created by Next.js team with exceptional DX.',
        pros: [
          'Exceptional developer experience',
          'Automatic CI/CD',
          'Global edge network',
          'Zero configuration',
          'Preview deployments',
        ],
        cons: [
          'Expensive beyond free tier',
          'Limited backend capabilities',
          'Vendor lock-in',
          'Not for traditional apps',
        ],
        bestFor: [
          'Next.js applications',
          'Frontend projects',
          'Jamstack sites',
          'Developer productivity focus',
        ],
        setupDifficulty: 'Easy',
        popularity: 'Growing',
        documentation: 'https://vercel.com/docs',
      },
      {
        name: 'Fly.io',
        description:
          'Developer-focused platform for running full-stack apps globally. Competitive pricing and simplicity.',
        pros: [
          'Simple deployment',
          'Competitive pricing',
          'Global distribution',
          'Good for full-stack apps',
          'Excellent for side projects',
        ],
        cons: [
          'Smaller company',
          'Limited enterprise features',
          'Fewer managed services',
          'Less proven at scale',
        ],
        bestFor: [
          'Full-stack applications',
          'Side projects and startups',
          'Global low-latency apps',
          'Cost-conscious teams',
        ],
        setupDifficulty: 'Easy',
        popularity: 'Growing',
        documentation: 'https://fly.io/docs/',
      },
    ],
    recommendations: [
      'Choose AWS for enterprise scale, comprehensive services, and global reach',
      'Use GCP for Kubernetes, ML/AI, and data analytics workloads',
      'Pick Vercel for Next.js and frontend-focused applications',
      'Select Fly.io for full-stack apps with global distribution on a budget',
    ],
    learnMoreUrl: 'https://cloud.google.com/learn/choosing-a-cloud-provider',
  },

  infrastructureBuild: {
    title: 'Infrastructure as Code',
    description: 'Tools for defining and managing infrastructure through code',
    overview:
      'Infrastructure as Code (IaC) enables version control, automation, and consistency in infrastructure management. Choose between declarative (Terraform) and imperative (CDK) approaches based on team preferences and cloud provider.',
    options: [
      {
        name: 'Terraform',
        description:
          'Cloud-agnostic infrastructure as code tool using declarative HCL syntax. Industry standard for multi-cloud.',
        pros: [
          'Cloud-agnostic',
          'Large ecosystem',
          'State management',
          'Wide adoption',
          'Declarative syntax',
        ],
        cons: [
          'Learning curve',
          'State management complexity',
          'Limited programming logic',
          'Verbose configuration',
        ],
        bestFor: [
          'Multi-cloud environments',
          'Large infrastructures',
          'Teams preferring declarative',
          'Standardization across teams',
        ],
        setupDifficulty: 'Moderate',
        popularity: 'High',
        documentation: 'https://www.terraform.io/',
      },
      {
        name: 'AWS CDK',
        description:
          'AWS infrastructure defined using familiar programming languages (TypeScript, Python). Imperative approach.',
        pros: [
          'Use programming languages',
          'Type safety',
          'Easier logic/loops',
          'AWS best practices built-in',
          'Good IDE support',
        ],
        cons: [
          'AWS-only',
          'Steeper initial learning',
          'More complex than CloudFormation',
          'Generated templates large',
        ],
        bestFor: [
          'AWS-focused teams',
          'Developers preferring code',
          'Complex infrastructure logic',
          'TypeScript/Python projects',
        ],
        setupDifficulty: 'Moderate',
        popularity: 'Growing',
        documentation: 'https://aws.amazon.com/cdk/',
      },
      {
        name: 'Pulumi',
        description:
          'Modern IaC using real programming languages. Multi-cloud with excellent developer experience.',
        pros: [
          'Real programming languages',
          'Multi-cloud support',
          'Great testing',
          'Type safety',
          'Excellent DX',
        ],
        cons: [
          'Smaller community',
          'Paid features for teams',
          'Less mature ecosystem',
          'Vendor-specific tool',
        ],
        bestFor: [
          'Development-heavy teams',
          'Complex infrastructure logic',
          'Multi-cloud deployments',
          'Modern tech stacks',
        ],
        setupDifficulty: 'Easy',
        popularity: 'Growing',
        documentation: 'https://www.pulumi.com/docs/',
      },
    ],
    recommendations: [
      'Use Terraform for multi-cloud and standardization across teams',
      'Choose AWS CDK for AWS-focused projects and programmatic control',
      'Pick Pulumi for modern DX and complex infrastructure logic',
      'Start with cloud provider tools (CloudFormation, Deployment Manager) for simple needs',
    ],
    learnMoreUrl: 'https://www.terraform.io/intro',
  },

  deployment: {
    title: 'Deployment Platform',
    description: 'Platforms and services for deploying and running applications',
    overview:
      'Deployment platforms handle application hosting, scaling, and management. Choose between serverless (Cloud Run, Lambda), container orchestration (Kubernetes), or platform-as-a-service (Vercel, Heroku) based on application architecture and operational preferences.',
    options: [
      {
        name: 'Google Cloud Run',
        description:
          'Fully managed serverless platform for containerized applications. Auto-scaling with pay-per-use pricing.',
        pros: [
          'Serverless simplicity',
          'Container flexibility',
          'Auto-scaling',
          'Pay for actual usage',
          'Quick deployments',
        ],
        cons: [
          'Cold starts',
          'Limited customization',
          'GCP vendor lock-in',
          'Regional limitations',
        ],
        bestFor: [
          'Containerized applications',
          'Variable traffic patterns',
          'Cost optimization',
          'Quick deployments',
        ],
        setupDifficulty: 'Easy',
        popularity: 'Growing',
        documentation: 'https://cloud.google.com/run/docs',
      },
      {
        name: 'Kubernetes',
        description:
          'Container orchestration platform for automating deployment, scaling, and management. Industry standard.',
        pros: [
          'Cloud-agnostic',
          'Highly scalable',
          'Self-healing',
          'Industry standard',
          'Rich ecosystem',
        ],
        cons: [
          'Complex to learn and operate',
          'Operational overhead',
          'Overkill for simple apps',
          'Requires expertise',
        ],
        bestFor: [
          'Large-scale applications',
          'Multi-cloud deployments',
          'Complex microservices',
          'Teams with k8s expertise',
        ],
        setupDifficulty: 'Complex',
        popularity: 'High',
        documentation: 'https://kubernetes.io/docs/',
      },
      {
        name: 'Vercel',
        description:
          'Frontend-optimized platform with instant deployments, edge network, and preview environments.',
        pros: [
          'Instant deployments',
          'Preview environments',
          'Global CDN',
          'Zero configuration',
          'Excellent DX',
        ],
        cons: [
          'Expensive beyond free tier',
          'Limited backend support',
          'Vendor lock-in',
          'Function limitations',
        ],
        bestFor: [
          'Next.js applications',
          'Frontend projects',
          'Jamstack sites',
          'Teams prioritizing DX',
        ],
        setupDifficulty: 'Easy',
        popularity: 'High',
        documentation: 'https://vercel.com/docs',
      },
      {
        name: 'AWS Lambda',
        description:
          'Serverless compute service running code in response to events. Pay only for execution time.',
        pros: [
          'True serverless',
          'Automatic scaling',
          'Pay per invocation',
          'AWS ecosystem integration',
          'Wide language support',
        ],
        cons: [
          'Cold starts',
          'Complex debugging',
          'Vendor lock-in',
          'Stateless constraints',
        ],
        bestFor: [
          'Event-driven architectures',
          'Microservices',
          'Variable workloads',
          'Cost optimization',
        ],
        setupDifficulty: 'Moderate',
        popularity: 'High',
        documentation: 'https://docs.aws.amazon.com/lambda/',
      },
    ],
    recommendations: [
      'Use Cloud Run for containerized apps with serverless simplicity',
      'Choose Kubernetes for complex microservices and cloud portability',
      'Pick Vercel for Next.js and frontend applications',
      'Select AWS Lambda for event-driven and serverless architectures',
    ],
    learnMoreUrl: 'https://cloud.google.com/architecture/framework/system-design/deployment',
  },

  containerization: {
    title: 'Containerization',
    description: 'Tools for packaging applications with dependencies into portable containers',
    overview:
      'Containerization enables consistent environments across development, testing, and production. Docker is the industry standard, though alternatives exist. Essential for microservices, cloud-native apps, and consistent deployments.',
    options: [
      {
        name: 'Docker',
        description:
          'Industry-standard containerization platform. Package applications with dependencies for portable execution.',
        pros: [
          'Industry standard',
          'Huge ecosystem',
          'Excellent documentation',
          'Wide tool support',
          'Consistent environments',
        ],
        cons: [
          'Resource overhead',
          'Learning curve',
          'Licensing changes (Docker Desktop)',
          'Security concerns if misconfigured',
        ],
        bestFor: [
          'Most applications',
          'Microservices',
          'CI/CD pipelines',
          'Development environments',
        ],
        setupDifficulty: 'Easy',
        popularity: 'High',
        documentation: 'https://docs.docker.com/',
      },
      {
        name: 'Podman',
        description:
          'Docker alternative without daemon. Rootless containers and OCI-compliant. Open-source Red Hat project.',
        pros: [
          'Rootless by default',
          'No daemon required',
          'Docker-compatible CLI',
          'Better security model',
          'Free for all uses',
        ],
        cons: [
          'Smaller ecosystem',
          'Less tooling support',
          'Some compatibility issues',
          'Newer, less proven',
        ],
        bestFor: [
          'Security-focused environments',
          'Rootless deployments',
          'Docker Desktop alternatives',
          'Linux environments',
        ],
        setupDifficulty: 'Easy',
        popularity: 'Growing',
        documentation: 'https://podman.io/docs',
      },
    ],
    recommendations: [
      'Use Docker for standard containerization needs and maximum compatibility',
      'Choose Podman for enhanced security and rootless deployments',
      'Consider not using containers for simple applications or serverless deployments',
      'Learn Docker basics regardless of choice - it is the industry standard',
    ],
    learnMoreUrl: 'https://docs.docker.com/get-started/',
  },

  secretManagement: {
    title: 'Secret Management',
    description: 'Secure storage and access control for API keys, passwords, and sensitive configuration',
    overview:
      'Secret management protects sensitive data like API keys, database passwords, and certificates. Never store secrets in code or version control. Choose managed services for production, environment variables for development.',
    options: [
      {
        name: 'Google Secret Manager',
        description:
          'GCP-managed service for storing API keys, passwords, and certificates. Integrated with IAM.',
        pros: [
          'Fully managed',
          'IAM integration',
          'Versioning and rotation',
          'Audit logging',
          'Generous free tier',
        ],
        cons: [
          'GCP vendor lock-in',
          'Requires GCP setup',
          'Overkill for simple projects',
          'Learning curve',
        ],
        bestFor: [
          'GCP-based projects',
          'Production applications',
          'Compliance requirements',
          'Teams using GCP services',
        ],
        setupDifficulty: 'Easy',
        popularity: 'High',
        documentation: 'https://cloud.google.com/secret-manager/docs',
      },
      {
        name: 'HashiCorp Vault',
        description:
          'Enterprise-grade secret management with dynamic secrets, encryption, and access control.',
        pros: [
          'Cloud-agnostic',
          'Dynamic secrets',
          'Encryption as a service',
          'Advanced features',
          'Open source option',
        ],
        cons: [
          'Complex setup',
          'Operational overhead',
          'Expensive managed version',
          'Overkill for small teams',
        ],
        bestFor: [
          'Enterprise applications',
          'Multi-cloud environments',
          'Dynamic secret generation',
          'Compliance-heavy industries',
        ],
        setupDifficulty: 'Complex',
        popularity: 'Medium',
        documentation: 'https://www.vaultproject.io/docs',
      },
      {
        name: 'AWS Secrets Manager',
        description:
          'AWS-managed service for rotating, managing, and retrieving database credentials and API keys.',
        pros: [
          'Fully managed',
          'Automatic rotation',
          'AWS integration',
          'Fine-grained access',
          'Audit logging',
        ],
        cons: [
          'AWS vendor lock-in',
          'Costs per secret',
          'Limited to AWS',
          'Requires AWS setup',
        ],
        bestFor: [
          'AWS-based applications',
          'Database credential rotation',
          'Production environments',
          'AWS-heavy infrastructure',
        ],
        setupDifficulty: 'Easy',
        popularity: 'High',
        documentation: 'https://docs.aws.amazon.com/secretsmanager/',
      },
      {
        name: 'Environment Variables (.env)',
        description:
          'Simple approach using .env files for local development. Not recommended for production.',
        pros: [
          'Simple setup',
          'Good for development',
          'No external dependencies',
          'Easy to understand',
        ],
        cons: [
          'Not secure for production',
          'No rotation',
          'Risk of committing secrets',
          'Manual management',
        ],
        bestFor: [
          'Local development',
          'Simple projects',
          'Learning/prototyping',
          'Non-sensitive data',
        ],
        setupDifficulty: 'Easy',
        popularity: 'High',
        documentation: 'https://www.npmjs.com/package/dotenv',
      },
    ],
    recommendations: [
      'Use cloud-native secret managers (GCP/AWS/Azure) for production',
      'Environment variables are fine for local development only',
      'Never commit secrets to version control - use .gitignore',
      'Consider HashiCorp Vault for complex multi-cloud requirements',
    ],
    learnMoreUrl: 'https://cloud.google.com/secret-manager/docs/overview',
  },

  aiLlmModel: {
    title: 'AI/LLM Model Provider',
    description: 'Large Language Model APIs for AI-powered features and chatbots',
    overview:
      'LLM providers offer access to powerful language models via API. Consider model capabilities, pricing, rate limits, and data privacy. OpenRouter provides unified access to multiple providers.',
    options: [
      {
        name: 'OpenRouter',
        description:
          'Unified API for accessing multiple LLM providers. Single integration, multiple models.',
        pros: [
          'Access to many models',
          'Single API integration',
          'Competitive pricing',
          'Automatic fallbacks',
          'Usage analytics',
        ],
        cons: [
          'Additional layer/latency',
          'Vendor dependency',
          'Limited provider-specific features',
          'Newer platform',
        ],
        bestFor: [
          'Multi-model experimentation',
          'Avoiding vendor lock-in',
          'Cost optimization',
          'Production flexibility',
        ],
        setupDifficulty: 'Easy',
        popularity: 'Growing',
        documentation: 'https://openrouter.ai/docs',
      },
      {
        name: 'OpenAI (GPT-4, GPT-3.5)',
        description:
          'Leading LLM provider with GPT models. Most capable and widely adopted.',
        pros: [
          'Most capable models',
          'Excellent documentation',
          'Large ecosystem',
          'Function calling',
          'Vision capabilities',
        ],
        cons: [
          'Expensive',
          'Rate limits',
          'Data privacy concerns',
          'Vendor lock-in',
        ],
        bestFor: [
          'Production AI features',
          'Complex reasoning tasks',
          'Chatbots and assistants',
          'Vision applications',
        ],
        setupDifficulty: 'Easy',
        popularity: 'High',
        documentation: 'https://platform.openai.com/docs',
      },
      {
        name: 'Anthropic Claude',
        description:
          'Advanced LLM focusing on safety and longer context windows. Strong reasoning capabilities.',
        pros: [
          'Long context (200K tokens)',
          'Strong reasoning',
          'Safety-focused',
          'Good for coding',
          'Constitutional AI',
        ],
        cons: [
          'Limited availability',
          'Fewer integrations',
          'Higher cost',
          'Smaller ecosystem',
        ],
        bestFor: [
          'Long document processing',
          'Code generation',
          'Safety-critical applications',
          'Complex analysis tasks',
        ],
        setupDifficulty: 'Easy',
        popularity: 'Growing',
        documentation: 'https://docs.anthropic.com/',
      },
      {
        name: 'Google Gemini',
        description:
          'Google multimodal AI model with competitive performance. Deep Google ecosystem integration.',
        pros: [
          'Multimodal capabilities',
          'GCP integration',
          'Competitive pricing',
          'Long context',
          'Free tier',
        ],
        cons: [
          'Newer, evolving rapidly',
          'Less proven at scale',
          'Limited third-party tools',
          'Data in Google ecosystem',
        ],
        bestFor: [
          'GCP-based applications',
          'Multimodal tasks',
          'Cost-conscious projects',
          'Google Workspace integration',
        ],
        setupDifficulty: 'Easy',
        popularity: 'Growing',
        documentation: 'https://ai.google.dev/docs',
      },
    ],
    recommendations: [
      'Use OpenRouter for flexibility and avoiding vendor lock-in',
      'Choose OpenAI for production-grade capabilities and ecosystem',
      'Pick Claude for long context and code generation tasks',
      'Select Gemini for GCP integration and multimodal applications',
    ],
    learnMoreUrl: 'https://artificialanalysis.ai/',
  },

  aiAgenticFramework: {
    title: 'AI Agentic Framework',
    description: 'Frameworks for building AI agents, workflows, and multi-step reasoning systems',
    overview:
      'Agentic frameworks enable building AI systems that can reason, use tools, and execute multi-step tasks. Essential for complex AI applications beyond simple chat. Choose based on use case complexity and required flexibility.',
    options: [
      {
        name: 'LangChain',
        description:
          'Most popular framework for building LLM applications with chains, agents, and memory.',
        pros: [
          'Huge ecosystem',
          'Extensive integrations',
          'Active development',
          'Good documentation',
          'Community support',
        ],
        cons: [
          'Complex abstractions',
          'Can be overkill',
          'Frequent breaking changes',
          'Performance overhead',
        ],
        bestFor: [
          'Complex AI workflows',
          'Multi-step reasoning',
          'RAG applications',
          'Production AI systems',
        ],
        setupDifficulty: 'Moderate',
        popularity: 'High',
        documentation: 'https://python.langchain.com/',
      },
      {
        name: 'LlamaIndex',
        description:
          'Specialized framework for data-centric AI applications. Excellent for RAG and knowledge bases.',
        pros: [
          'Best for RAG',
          'Data connectors',
          'Indexing optimized',
          'Query engines',
          'Python and TypeScript',
        ],
        cons: [
          'Narrower scope',
          'Smaller community',
          'Less flexible',
          'Mainly for RAG use cases',
        ],
        bestFor: [
          'RAG applications',
          'Knowledge bases',
          'Document Q&A',
          'Search systems',
        ],
        setupDifficulty: 'Easy',
        popularity: 'Growing',
        documentation: 'https://docs.llamaindex.ai/',
      },
      {
        name: 'AutoGen',
        description:
          'Microsoft framework for multi-agent conversations and code execution. Strong for collaborative AI.',
        pros: [
          'Multi-agent systems',
          'Code execution',
          'Microsoft backing',
          'Research-backed',
          'Conversational AI',
        ],
        cons: [
          'Newer framework',
          'Smaller ecosystem',
          'Complex for simple tasks',
          'Rapid changes',
        ],
        bestFor: [
          'Multi-agent systems',
          'Code generation',
          'Collaborative AI',
          'Research projects',
        ],
        setupDifficulty: 'Moderate',
        popularity: 'Growing',
        documentation: 'https://microsoft.github.io/autogen/',
      },
      {
        name: 'Custom Framework',
        description:
          'Build your own using direct LLM APIs and custom logic. Maximum control and simplicity.',
        pros: [
          'Full control',
          'No dependencies',
          'Simple and lightweight',
          'No framework lock-in',
        ],
        cons: [
          'More development work',
          'Reinventing patterns',
          'No community support',
          'Maintenance burden',
        ],
        bestFor: [
          'Simple AI features',
          'Specific requirements',
          'Learning/prototyping',
          'Avoiding dependencies',
        ],
        setupDifficulty: 'Moderate',
        popularity: 'Medium',
        documentation: null,
      },
    ],
    recommendations: [
      'Use LangChain for complex AI workflows and extensive integrations',
      'Choose LlamaIndex for RAG applications and knowledge bases',
      'Pick AutoGen for multi-agent systems and collaborative AI',
      'Build custom for simple AI features or specific requirements',
    ],
    learnMoreUrl: 'https://python.langchain.com/docs/get_started/introduction',
  },
};

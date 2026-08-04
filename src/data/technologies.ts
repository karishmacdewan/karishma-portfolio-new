export type TechnologyCategory = 'ai' | 'front-end' | 'back-end' | 'infra';

export type ConceptIconName = 'agent' | 'braces' | 'brain' | 'gauge' | 'graph' | 'route' | 'tool' | 'waypoints' | 'workflow';

export type TechnologyIcon =
    | { kind: 'asset'; src: string; scale?: number; wide?: boolean }
    | { kind: 'concept'; name: ConceptIconName }
    | { kind: 'stack'; name: string };

export interface TechnologyDefinition {
    name: string;
    aliases?: readonly string[];
    category: TechnologyCategory;
    additionalCategories?: readonly TechnologyCategory[];
    tier?: 'secondary';
    icon: TechnologyIcon;
    description: string;
    link: string;
}

export const TECHNOLOGY_CATEGORIES: readonly {
    id: TechnologyCategory;
    label: string;
    description: string;
}[] = [
    {
        id: 'ai',
        label: 'ai',
        description: 'Models, agent systems, retrieval and evaluation'
    },
    {
        id: 'front-end',
        label: 'front-end',
        description: 'Interfaces and cross-platform experiences'
    },
    {
        id: 'back-end',
        label: 'back-end',
        description: 'APIs, services and application data'
    },
    {
        id: 'infra',
        label: 'infra',
        description: 'Cloud, deployment and compute'
    }
] as const;

export const TECHNOLOGY_CATALOG: readonly TechnologyDefinition[] = [
    {
        name: 'OpenAI',
        category: 'ai',
        icon: { kind: 'stack', name: 'openai' },
        description: 'Foundation models, multimodal APIs and agent tooling',
        link: 'https://platform.openai.com/docs/'
    },
    {
        name: 'Anthropic',
        category: 'ai',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/anthropic.svg' },
        description: 'Claude models and APIs for production AI systems',
        link: 'https://docs.anthropic.com/'
    },
    {
        name: 'LangChain',
        category: 'ai',
        icon: { kind: 'asset', src: '/tech_stack_icons/langchain.png' },
        description: 'Components and integrations for building LLM applications',
        link: 'https://docs.langchain.com/'
    },
    {
        name: 'LangGraph',
        category: 'ai',
        icon: {
            kind: 'asset',
            src: '/tech_stack_icons/langgraph.png',
            scale: 1.45
        },
        description: 'Durable orchestration for stateful, long-running agents',
        link: 'https://docs.langchain.com/oss/python/langgraph/overview'
    },
    {
        name: 'MCP',
        category: 'ai',
        icon: { kind: 'asset', src: '/tech_stack_icons/mcp.svg' },
        description: 'Model Context Protocol integrations for tools and data',
        link: 'https://modelcontextprotocol.io/docs/'
    },
    {
        name: 'Agentic Workflows',
        category: 'ai',
        icon: { kind: 'concept', name: 'agent' },
        description: 'Stateful AI systems that plan, act and recover',
        link: 'https://docs.langchain.com/oss/python/langgraph/workflows-agents'
    },
    {
        name: 'Tool Calling',
        category: 'ai',
        icon: { kind: 'concept', name: 'tool' },
        description: 'Schema-driven model access to functions and external systems',
        link: 'https://platform.openai.com/docs/guides/function-calling'
    },
    {
        name: 'Knowledge Graphs',
        aliases: ['KGs'],
        category: 'ai',
        icon: { kind: 'concept', name: 'graph' },
        description: 'Structured entities and relationships for grounded reasoning',
        link: 'https://neo4j.com/docs/getting-started/appendix/graphdb-concepts/'
    },
    {
        name: 'Neo4j',
        aliases: ['Neo4js'],
        category: 'ai',
        icon: { kind: 'asset', src: '/tech_stack_icons/neo4j.png' },
        description: 'Graph database for connected data and GraphRAG systems',
        link: 'https://neo4j.com/docs/'
    },
    {
        name: 'Cypher',
        category: 'ai',
        icon: { kind: 'concept', name: 'braces' },
        description: 'Declarative graph query language for Neo4j',
        link: 'https://neo4j.com/docs/cypher-manual/current/introduction/'
    },
    {
        name: 'GraphRAG',
        aliases: ['Graph RAG'],
        category: 'ai',
        icon: { kind: 'concept', name: 'waypoints' },
        description: 'Retrieval augmented with graph traversal and relationships',
        link: 'https://neo4j.com/docs/neo4j-graphrag-python/current/'
    },
    {
        name: 'LiteLLM',
        category: 'ai',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/litellm-official.png' },
        description: 'Model gateway for routing, fallbacks, budgets and observability',
        link: 'https://docs.litellm.ai/'
    },
    {
        name: 'vLLM',
        category: 'ai',
        icon: { kind: 'asset', src: '/tech_stack_icons/vllm.svg' },
        description: 'High-throughput, memory-efficient LLM inference and serving',
        link: 'https://docs.vllm.ai/'
    },
    {
        name: 'Model Quantisation',
        aliases: ['LLM Quantisation', 'Quantisation'],
        category: 'ai',
        icon: { kind: 'concept', name: 'gauge' },
        description: 'Lower-precision model optimisation for faster, leaner inference',
        link: 'https://huggingface.co/docs/transformers/quantization/overview'
    },
    {
        name: 'DeepEval',
        category: 'ai',
        icon: { kind: 'asset', src: '/tech_stack_icons/deepeval.png' },
        description: 'Evaluation and regression testing for LLM applications',
        link: 'https://deepeval.com/docs/getting-started'
    },
    {
        name: 'PyTorch',
        aliases: ['Pytorch'],
        category: 'ai',
        icon: { kind: 'stack', name: 'pytorch' },
        description: 'Deep learning framework for training and inference',
        link: 'https://pytorch.org/'
    },
    {
        name: 'pgvector',
        category: 'ai',
        icon: { kind: 'concept', name: 'brain' },
        description: 'Vector similarity search within PostgreSQL',
        link: 'https://github.com/pgvector/pgvector'
    },
    {
        name: 'Qdrant',
        category: 'ai',
        icon: { kind: 'asset', src: '/tech_stack_icons/qdrant.png' },
        description: 'Vector database for semantic retrieval and filtering',
        link: 'https://qdrant.tech/'
    },
    {
        name: 'CLIP',
        category: 'ai',
        icon: { kind: 'concept', name: 'brain' },
        description: 'Joint image and text representation model',
        link: 'https://github.com/openai/CLIP'
    },
    {
        name: 'DALL-E',
        category: 'ai',
        icon: { kind: 'stack', name: 'openai' },
        description: 'Generative image models from OpenAI',
        link: 'https://platform.openai.com/docs/guides/image-generation'
    },
    {
        name: 'LLMs',
        category: 'ai',
        icon: { kind: 'concept', name: 'brain' },
        description: 'Large language model application engineering',
        link: 'https://huggingface.co/docs/transformers/'
    },
    {
        name: 'React',
        category: 'front-end',
        icon: { kind: 'stack', name: 'reactjs' },
        description: 'Component-based user interface library',
        link: 'https://react.dev/'
    },
    {
        name: 'Next.js',
        aliases: ['NextJS'],
        category: 'front-end',
        icon: { kind: 'stack', name: 'nextjs2' },
        description: 'React framework for production web applications',
        link: 'https://nextjs.org/'
    },
    {
        name: 'TypeScript',
        category: 'front-end',
        icon: { kind: 'stack', name: 'typescript' },
        description: 'Typed JavaScript for reliable application development',
        link: 'https://www.typescriptlang.org/'
    },
    {
        name: 'React Native',
        category: 'front-end',
        icon: { kind: 'stack', name: 'reactjs' },
        description: 'Cross-platform native application framework',
        link: 'https://reactnative.dev/'
    },
    {
        name: 'Tailwind CSS',
        aliases: ['TailWind'],
        category: 'front-end',
        icon: { kind: 'stack', name: 'tailwindcss' },
        description: 'Utility-first CSS framework',
        link: 'https://tailwindcss.com/'
    },
    {
        name: 'Redux',
        category: 'front-end',
        icon: { kind: 'stack', name: 'redux' },
        description: 'Predictable state management for JavaScript applications',
        link: 'https://redux.js.org/'
    },
    {
        name: 'HTML',
        category: 'front-end',
        icon: { kind: 'stack', name: 'html5' },
        description: 'Semantic structure for accessible web interfaces',
        link: 'https://developer.mozilla.org/en-US/docs/Web/HTML'
    },
    {
        name: 'CSS',
        category: 'front-end',
        icon: { kind: 'stack', name: 'css3' },
        description: 'Responsive styling and interface animation',
        link: 'https://developer.mozilla.org/en-US/docs/Web/CSS'
    },
    {
        name: 'JavaScript',
        category: 'front-end',
        icon: { kind: 'stack', name: 'js' },
        description: 'Programming language of the web platform',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
    },
    {
        name: 'Framer Motion',
        category: 'front-end',
        tier: 'secondary',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/framer.svg' },
        description: 'Motion and gesture system for React interfaces',
        link: 'https://www.framer.com/motion/'
    },
    {
        name: 'GSAP',
        category: 'front-end',
        tier: 'secondary',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/gsap.svg' },
        description: 'High-performance sequencing and web animation toolkit',
        link: 'https://gsap.com/docs/v3/'
    },
    {
        name: 'Radix UI',
        category: 'front-end',
        tier: 'secondary',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/radix-ui.svg' },
        description: 'Accessible, unstyled primitives for component systems',
        link: 'https://www.radix-ui.com/primitives/docs/overview/introduction'
    },
    {
        name: 'React Hook Form',
        category: 'front-end',
        tier: 'secondary',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/react-hook-form.svg' },
        description: 'Performant form state and validation for React',
        link: 'https://react-hook-form.com/'
    },
    {
        name: 'Zod',
        category: 'front-end',
        tier: 'secondary',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/zod.svg' },
        description: 'TypeScript-first schema validation',
        link: 'https://zod.dev/'
    },
    {
        name: 'Storybook',
        category: 'front-end',
        tier: 'secondary',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/storybook.svg' },
        description: 'Isolated component development, documentation and testing',
        link: 'https://storybook.js.org/docs/'
    },
    {
        name: 'Python',
        category: 'back-end',
        icon: { kind: 'stack', name: 'python' },
        description: 'Primary language for AI services and data systems',
        link: 'https://www.python.org/'
    },
    {
        name: 'FastAPI',
        category: 'back-end',
        icon: { kind: 'asset', src: '/tech_stack_icons/fastapi.png' },
        description: 'Typed, high-performance Python API framework',
        link: 'https://fastapi.tiangolo.com/'
    },
    {
        name: 'Django',
        category: 'back-end',
        tier: 'secondary',
        icon: { kind: 'stack', name: 'django' },
        description: 'Full-featured Python web framework',
        link: 'https://www.djangoproject.com/'
    },
    {
        name: 'PostgreSQL',
        category: 'back-end',
        icon: { kind: 'stack', name: 'postgresql' },
        description: 'Relational database for transactional application data',
        link: 'https://www.postgresql.org/'
    },
    {
        name: 'MongoDB',
        category: 'back-end',
        icon: { kind: 'stack', name: 'mongodb' },
        description: 'Document database for flexible application data',
        link: 'https://www.mongodb.com/'
    },
    {
        name: 'pandas',
        category: 'back-end',
        icon: { kind: 'stack', name: 'python' },
        description: 'Python data analysis and transformation library',
        link: 'https://pandas.pydata.org/'
    },
    {
        name: 'Pydantic',
        category: 'back-end',
        tier: 'secondary',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/pydantic-official.svg' },
        description: 'Typed data validation and settings management for Python',
        link: 'https://docs.pydantic.dev/latest/'
    },
    {
        name: 'SQLAlchemy',
        category: 'back-end',
        tier: 'secondary',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/sqlalchemy-official.png', wide: true },
        description: 'Python SQL toolkit and object-relational mapper',
        link: 'https://docs.sqlalchemy.org/en/20/'
    },
    {
        name: 'Alembic',
        category: 'back-end',
        tier: 'secondary',
        icon: { kind: 'concept', name: 'waypoints' },
        description: 'Database migration tooling for SQLAlchemy',
        link: 'https://alembic.sqlalchemy.org/'
    },
    {
        name: 'Celery',
        category: 'back-end',
        tier: 'secondary',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/celery.svg' },
        description: 'Distributed task queues and background workers for Python',
        link: 'https://docs.celeryq.dev/'
    },
    {
        name: 'Kafka',
        category: 'back-end',
        tier: 'secondary',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/kafka.svg' },
        description: 'Distributed event streaming for data and service integration',
        link: 'https://kafka.apache.org/documentation/'
    },
    {
        name: 'Docker',
        category: 'infra',
        icon: { kind: 'stack', name: 'docker' },
        description: 'Containerised development and deployment',
        link: 'https://www.docker.com/'
    },
    {
        name: 'Azure',
        category: 'infra',
        icon: { kind: 'stack', name: 'azure' },
        description: 'Cloud platform for applications, data and AI',
        link: 'https://azure.microsoft.com/'
    },
    {
        name: 'GCP',
        category: 'infra',
        icon: { kind: 'stack', name: 'gcloud' },
        description: 'Google Cloud infrastructure and managed services',
        link: 'https://cloud.google.com/'
    },
    {
        name: 'AWS',
        category: 'infra',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/aws.svg', scale: 1.15 },
        description: 'Amazon cloud infrastructure and managed services',
        link: 'https://aws.amazon.com/'
    },
    {
        name: 'Kubernetes',
        category: 'infra',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/kubernetes-official.svg' },
        description: 'Container orchestration, scaling and resilient deployment',
        link: 'https://kubernetes.io/'
    },
    {
        name: 'Terraform',
        category: 'infra',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/terraform-official.svg', wide: true },
        description: 'Declarative infrastructure as code across cloud providers',
        link: 'https://developer.hashicorp.com/terraform'
    },
    {
        name: 'GitHub Actions',
        category: 'infra',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/github-actions.svg' },
        description: 'Automated CI/CD and repository workflows',
        link: 'https://docs.github.com/actions'
    },
    {
        name: 'Redis',
        category: 'infra',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/redis.svg' },
        description: 'In-memory caching, queues and low-latency application state',
        link: 'https://redis.io/docs/'
    },
    {
        name: 'OpenTelemetry',
        category: 'infra',
        tier: 'secondary',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/opentelemetry.svg' },
        description: 'Vendor-neutral traces, metrics and logs for distributed systems',
        link: 'https://opentelemetry.io/docs/'
    },
    {
        name: 'Helm',
        category: 'infra',
        tier: 'secondary',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/helm.svg' },
        description: 'Repeatable packaging and deployment for Kubernetes applications',
        link: 'https://helm.sh/docs/'
    },
    {
        name: 'Prometheus',
        category: 'infra',
        tier: 'secondary',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/prometheus.svg' },
        description: 'Time-series monitoring and alerting for services and infrastructure',
        link: 'https://prometheus.io/docs/'
    },
    {
        name: 'Grafana',
        category: 'infra',
        tier: 'secondary',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/grafana.svg' },
        description: 'Operational dashboards and observability visualisation',
        link: 'https://grafana.com/docs/'
    },
    {
        name: 'Sentry',
        category: 'infra',
        tier: 'secondary',
        icon: { kind: 'asset', src: '/tech_stack_icons/brands/sentry.svg' },
        description: 'Application error tracking and performance monitoring',
        link: 'https://docs.sentry.io/'
    },
    {
        name: 'Firebase',
        category: 'infra',
        icon: { kind: 'stack', name: 'firebase' },
        description: 'Managed hosting, authentication and application services',
        link: 'https://firebase.google.com/'
    },
    {
        name: 'NVIDIA GPUs',
        category: 'infra',
        additionalCategories: ['ai'],
        icon: { kind: 'asset', src: '/tech_stack_icons/nvidia.png' },
        description: 'Accelerated compute for model training and inference',
        link: 'https://www.nvidia.com/en-gb/data-center/'
    },
    {
        name: 'Git',
        category: 'infra',
        icon: { kind: 'stack', name: 'git' },
        description: 'Distributed version control',
        link: 'https://git-scm.com/'
    },
    {
        name: 'GitHub',
        category: 'infra',
        icon: { kind: 'stack', name: 'git' },
        description: 'Collaborative source control and delivery workflows',
        link: 'https://github.com/'
    }
];

export const FEATURED_TECHNOLOGIES = [
    'OpenAI',
    'Anthropic',
    'LangChain',
    'LangGraph',
    'MCP',
    'Agentic Workflows',
    'Tool Calling',
    'Knowledge Graphs',
    'Neo4j',
    'Cypher',
    'GraphRAG',
    'LiteLLM',
    'vLLM',
    'Model Quantisation',
    'DeepEval',
    'PyTorch',
    'pgvector',
    'Qdrant',
    'React',
    'Next.js',
    'TypeScript',
    'React Native',
    'Tailwind CSS',
    'Redux',
    'HTML',
    'Framer Motion',
    'GSAP',
    'Radix UI',
    'React Hook Form',
    'Zod',
    'Storybook',
    'Python',
    'FastAPI',
    'PostgreSQL',
    'MongoDB',
    'Django',
    'Pydantic',
    'SQLAlchemy',
    'Alembic',
    'Celery',
    'Kafka',
    'Docker',
    'AWS',
    'Kubernetes',
    'Terraform',
    'GitHub Actions',
    'Redis',
    'OpenTelemetry',
    'Helm',
    'Prometheus',
    'Grafana',
    'Sentry',
    'GCP',
    'Azure',
    'Firebase',
    'Git',
    'NVIDIA GPUs'
] as const;

export function getTechnology(name: string) {
    const normalisedName = name.trim().toLowerCase();

    return TECHNOLOGY_CATALOG.find(
        (technology) =>
            technology.name.toLowerCase() === normalisedName || technology.aliases?.some((alias) => alias.toLowerCase() === normalisedName)
    );
}

export function getTechnologyCategories(technologyNames: readonly string[]) {
    return Array.from(
        new Set(
            technologyNames.flatMap((name) => {
                const technology = getTechnology(name);
                return technology ? [technology.category, ...(technology.additionalCategories ?? [])] : [];
            })
        )
    );
}

import { SectionHeader } from "@/components/ui/SectionHeader/SectionHeader";

import { ExperienceItem } from "./ExperienceItem";

export const Experience = () => {
  return (
    <section className="spotlight-section" id="experience">
      <div className="section-wrapper">
        <SectionHeader title="experience" dir="l" />
        {experience.map((item) => (
          <ExperienceItem key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
};

const experience = [
  {
    title: "genAI-Powered chatbot [for Enterprise Use]",
    headline: "Engineered a sophisticated genAI-powered chatbot for enterprise use.",
    time: "12 months",
    location: "London, UK",
    description: [
      "Included RAG-based retrieval; document uploads & knowledge bases; multimodal support; agentic workflows including real-time API actions; guardrails & logging; model routing for cost optimisations; multi-model support (GPT-series, Claude & Gemini).",
      "Tech lead for 2 microservices, while also contributing to front-end implementation, genAI integrations & API/micro-services design.",
      "Delivered to 2 large Fortune 500 clients, one with 20,000+ DAUs."
    ],
    tech: ["NextJS", "OpenAI", "CLIP", "DALL-E", "Python", "FastAPI", "Qdrant", "Docker"],
  },
  {
    title: "Urban Planning Assistant | NEOM",
    headline: "Developed an urban planning dashboard which classifies & scores architectural submissions (renderings, plans & briefs), using a custom genAI model.",
    time: "12 months",
    location: "London, UK",
    description: [
      "Included a data dashboard to visualize and interact with the AI's urban planning insights.",
      "Powered by cutting-edge AI, including a quantised image generation model & self-supervised learning.",
      "In-use by NEOM [Saudi Arabia]."
    ],
    tech: ["DeepEval", "Python", "OpenAI", "Anthropic", "Python", "FastAPI", "NextJS", "Docker"],
  },
  {
    title: "Triaging Assistant | Healthcare Consultancy",
    headline: "Developed a multimodal genAI powered assistant that triages incoming healthcare requests & classifies their urgency.",
    time: "6 months",
    location: "Saudi Arabia",
    description: [
      "Includes a real-time visualisation dashboard for medical practitioners.",
      "Established strategic partnership with a private healthcare consultancy for PoC implementation.",
      "Collaborated on business strategy to align the solution with consultancy's long-term goals."
    ],
    tech: ["NextJS", "OpenAI", "CLIP", "DALL-E", "Python", "FastAPI", "Qdrant", "Docker"],
  },
  {
    title: "AI Institute | Monitor Deloitte",
    headline: "Selected to rotate into the AI Institute, a fast-paced incubator for AI PoCs and client projects.",
    time: "3 years",
    location: "London, UK",
    description: [
      "Onboarded as a full-stack & genAI developer across 8 projects spanning 12 clients.",
      "Selected as a founding member for the prestigious institute.",
      "Promoted to Consultant from Graduate Analyst in 1 year."
    ],
    tech: ["Pytorch", "Python", "Django", "Typescript"],
  },
  {
    title: "videoGPT | Side Project",
    headline: "Engineered an AI chatbot capable of answering Q&A about YouTube videos.",
    time: "3 months",
    location: "London, UK",
    description: [
      "Combining statistical & embedding-based key-frame analysis with multimodal capabilities of chatGPT, to create a knowledge base of ingested videos.",
      "RAG retrieval in the knowledge base allows Q&A about content of the video.",
      "Featured on Product Hunt as a Top 10 Product on launch day."
    ],
    tech: [
      "Python",
      "LangChain",
      "MongoDB",
      "FastAPI",
      "NextJS",
      "Azure",
      "OpenAI",
      "Anthropic",
      "DeepEval",
      "Qdrant",
      "pgvector",
      "Docker",
    ],
  },
];

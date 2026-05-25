export interface ArchitectureTemplate {
  id: string;
  title: string;
  description: string;
  category: "E-commerce" | "Streaming" | "SaaS" | "Gaming" | "IoT" | "AI/ML" | "Enterprise";
  icon: string;
  prompt: string;
  cloudProvider: "AWS" | "Azure" | "GCP";
  scale: "Startup" | "Enterprise" | "Hyperscale";
  tags: string[];
  complexity: "Simple" | "Moderate" | "Advanced";
}

export const architectureTemplates: ArchitectureTemplate[] = [
  {
    id: "ecommerce-basic",
    title: "E-commerce Platform",
    description: "Scalable online store with payment processing, inventory management, and CDN",
    category: "E-commerce",
    icon: "🛒",
    prompt: "Create a highly scalable e-commerce platform on AWS for 1 million users with payment processing, product catalog, order management, inventory tracking, CDN for images, and search functionality.",
    cloudProvider: "AWS",
    scale: "Enterprise",
    tags: ["retail", "payments", "cdn", "database"],
    complexity: "Moderate",
  },
  {
    id: "streaming-platform",
    title: "Video Streaming Service",
    description: "Netflix-like streaming platform with content delivery and adaptive bitrate",
    category: "Streaming",
    icon: "🎬",
    prompt: "Create a Netflix-like video streaming architecture on AWS for 5 million concurrent users with adaptive bitrate streaming, content transcoding, CDN, user profiles, recommendations, and global distribution.",
    cloudProvider: "AWS",
    scale: "Hyperscale",
    tags: ["video", "cdn", "media", "global"],
    complexity: "Advanced",
  },
  {
    id: "saas-multi-tenant",
    title: "Multi-tenant SaaS Application",
    description: "B2B SaaS platform with tenant isolation, billing, and API gateway",
    category: "SaaS",
    icon: "💼",
    prompt: "Create a multi-tenant B2B SaaS application on Azure with tenant isolation, API gateway, authentication, billing integration, analytics dashboard, and automated backups for 10,000 organizations.",
    cloudProvider: "Azure",
    scale: "Enterprise",
    tags: ["saas", "multi-tenant", "api", "billing"],
    complexity: "Advanced",
  },
  {
    id: "realtime-gaming",
    title: "Real-time Multiplayer Game",
    description: "Low-latency gaming backend with matchmaking and leaderboards",
    category: "Gaming",
    icon: "🎮",
    prompt: "Create a real-time multiplayer gaming backend on GCP with WebSocket support, matchmaking service, leaderboards, player authentication, game state management, and low-latency regional deployment for 100,000 concurrent players.",
    cloudProvider: "GCP",
    scale: "Enterprise",
    tags: ["gaming", "websocket", "realtime", "latency"],
    complexity: "Advanced",
  },
  {
    id: "iot-platform",
    title: "IoT Device Management",
    description: "IoT platform for device management, telemetry, and real-time analytics",
    category: "IoT",
    icon: "📡",
    prompt: "Create an IoT platform on AWS for managing 1 million connected devices with MQTT messaging, device telemetry ingestion, real-time analytics, device management, OTA updates, and time-series data storage.",
    cloudProvider: "AWS",
    scale: "Hyperscale",
    tags: ["iot", "mqtt", "telemetry", "analytics"],
    complexity: "Advanced",
  },
  {
    id: "ai-ml-platform",
    title: "AI/ML Training Platform",
    description: "Machine learning platform with model training, deployment, and inference",
    category: "AI/ML",
    icon: "🤖",
    prompt: "Create an AI/ML platform on GCP with model training pipelines, GPU clusters, model registry, inference APIs, A/B testing, model monitoring, and automated retraining for 1000 data scientists.",
    cloudProvider: "GCP",
    scale: "Enterprise",
    tags: ["ai", "ml", "gpu", "inference"],
    complexity: "Advanced",
  },
  {
    id: "mobile-backend",
    title: "Mobile App Backend",
    description: "Backend for mobile apps with push notifications, auth, and file storage",
    category: "SaaS",
    icon: "📱",
    prompt: "Create a mobile app backend on AWS with user authentication, REST API, push notifications, file storage, real-time sync, offline support, and analytics for 500,000 mobile users.",
    cloudProvider: "AWS",
    scale: "Enterprise",
    tags: ["mobile", "api", "push", "sync"],
    complexity: "Moderate",
  },
  {
    id: "social-media",
    title: "Social Media Platform",
    description: "Social network with feeds, messaging, and content moderation",
    category: "SaaS",
    icon: "👥",
    prompt: "Create a social media platform on Azure with user feeds, real-time messaging, content upload and storage, content moderation, friend graphs, notifications, and search for 2 million active users.",
    cloudProvider: "Azure",
    scale: "Hyperscale",
    tags: ["social", "messaging", "feeds", "moderation"],
    complexity: "Advanced",
  },
  {
    id: "fintech-banking",
    title: "Digital Banking Platform",
    description: "Secure banking system with transactions, fraud detection, and compliance",
    category: "Enterprise",
    icon: "🏦",
    prompt: "Create a digital banking platform on AWS with account management, transaction processing, fraud detection, compliance logging, encryption at rest and in transit, audit trails, and disaster recovery for 100,000 customers.",
    cloudProvider: "AWS",
    scale: "Enterprise",
    tags: ["fintech", "security", "compliance", "transactions"],
    complexity: "Advanced",
  },
  {
    id: "healthcare-system",
    title: "Healthcare Management System",
    description: "HIPAA-compliant healthcare system with EHR and telemedicine",
    category: "Enterprise",
    icon: "🏥",
    prompt: "Create a HIPAA-compliant healthcare system on Azure with electronic health records, telemedicine video calls, appointment scheduling, prescription management, encrypted data storage, and audit logging for 50,000 patients.",
    cloudProvider: "Azure",
    scale: "Enterprise",
    tags: ["healthcare", "hipaa", "security", "compliance"],
    complexity: "Advanced",
  },
  {
    id: "logistics-tracking",
    title: "Logistics & Fleet Tracking",
    description: "Real-time logistics platform with GPS tracking and route optimization",
    category: "Enterprise",
    icon: "🚚",
    prompt: "Create a logistics and fleet tracking system on GCP with real-time GPS tracking, route optimization, delivery management, warehouse integration, driver mobile apps, and analytics for 5,000 vehicles.",
    cloudProvider: "GCP",
    scale: "Enterprise",
    tags: ["logistics", "gps", "tracking", "optimization"],
    complexity: "Moderate",
  },
  {
    id: "simple-blog",
    title: "Blog Platform",
    description: "Simple blog platform with CMS, comments, and SEO optimization",
    category: "SaaS",
    icon: "📝",
    prompt: "Create a blog platform on AWS with content management, markdown editor, comments, image hosting, SEO optimization, RSS feeds, and user authentication for 50,000 readers.",
    cloudProvider: "AWS",
    scale: "Startup",
    tags: ["blog", "cms", "content", "seo"],
    complexity: "Simple",
  },
];

export function getTemplatesByCategory(category: ArchitectureTemplate["category"]) {
  return architectureTemplates.filter((t) => t.category === category);
}

export function getTemplateById(id: string) {
  return architectureTemplates.find((t) => t.id === id);
}

export function getPopularTemplates() {
  return architectureTemplates.slice(0, 6);
}

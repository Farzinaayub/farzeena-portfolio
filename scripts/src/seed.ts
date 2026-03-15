import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import crypto from "crypto";

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@farzeena.com";
const DB_NAME = "farzeena-portfolio";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is required");
}

await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
console.log("Connected to MongoDB");

// ─── Models ──────────────────────────────────────────────────────────────────

const CaseStudySchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    shortDescription: String,
    content: String,
    coverImageUrl: String,
    tools: [String],
    status: { type: String, default: "published" },
    featured: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const BlogSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    shortDescription: String,
    content: String,
    tags: [String],
    status: { type: String, default: "published" },
    featured: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    readingTime: Number,
  },
  { timestamps: true }
);

const HeroSchema = new mongoose.Schema({ heading: String, subtitle: String, cta1Text: String, cta1Link: String, cta2Text: String, cta2Link: String, pipelineSteps: Array, toolIcons: Array }, { timestamps: true });
const AboutSchema = new mongoose.Schema({ name: String, bio: String, profileImageUrl: String, focusAreas: Array, industryTags: Array }, { timestamps: true });
const SiteSettingsSchema = new mongoose.Schema({ siteTitle: String, ctaBannerText: String, footerText: String, linkedinUrl: String, githubUrl: String, twitterUrl: String, contactEmail: String, metaTitleTemplate: String, defaultMetaDescription: String }, { timestamps: true });

const CaseStudy = mongoose.models.CaseStudy || mongoose.model("CaseStudy", CaseStudySchema);
const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
const HeroSection = mongoose.models.HeroSection || mongoose.model("HeroSection", HeroSchema);
const AboutSection = mongoose.models.AboutSection || mongoose.model("AboutSection", AboutSchema);
const SiteSettings = mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);

// ─── Seed admin user (better-auth's user collection) ─────────────────────────

const mongoClient = new MongoClient(MONGODB_URI);
await mongoClient.connect();
const db = mongoClient.db(DB_NAME);
const usersCollection = db.collection("user");

const existingUser = await usersCollection.findOne({ email: ADMIN_EMAIL });
if (!existingUser) {
  await usersCollection.insertOne({
    email: ADMIN_EMAIL,
    name: "Farzeena Admin",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log(`✅ Admin user created: ${ADMIN_EMAIL}`);
} else {
  console.log(`ℹ️  Admin user already exists: ${ADMIN_EMAIL}`);
}

await mongoClient.close();

// ─── Seed Case Studies ───────────────────────────────────────────────────────

await CaseStudy.deleteMany({});

await CaseStudy.create([
  {
    title: "Real Estate Marketplace Analytics",
    slug: "real-estate-marketplace-analytics",
    shortDescription: "Understanding price trend listings, performances using data-based recommendations.",
    content: "## Overview\n\nThis project involved building a comprehensive analytics platform for a real estate marketplace...\n\n## Challenge\n\nThe client needed insights into listing performance across different markets and price segments.\n\n## Solution\n\nWe designed an end-to-end pipeline using SQL, Python, and Power BI to track KPIs and surface actionable insights.\n\n## Results\n\n- 35% improvement in listing visibility metrics\n- Real-time price trend dashboards\n- Automated reporting reducing manual analysis by 80%",
    coverImageUrl: "",
    tools: ["SQL", "Python", "Power BI"],
    status: "published",
    featured: true,
    sortOrder: 0,
  },
  {
    title: "Airline Revenue Intelligence",
    slug: "airline-revenue-intelligence",
    shortDescription: "Optimize route profitability and revenue forecasting using advanced analytics.",
    content: "## Overview\n\nRevenue intelligence platform for airline route optimization and demand forecasting.\n\n## Challenge\n\nIdentifying underperforming routes and optimizing pricing strategy across 200+ routes.\n\n## Solution\n\nBuilt a Python-based ETL pipeline with SQL data models and Power BI dashboards for revenue analysts.\n\n## Results\n\n- 12% increase in route profitability\n- Predictive pricing model with 89% accuracy\n- Reduced analysis time from days to hours",
    coverImageUrl: "",
    tools: ["SQL", "Python", "Power BI"],
    status: "published",
    featured: true,
    sortOrder: 1,
  },
  {
    title: "Ecommerce Funnel Analytics",
    slug: "ecommerce-funnel-analytics",
    shortDescription: "Understand drop-off points and optimize conversion through data-driven insights.",
    content: "## Overview\n\nEcommerce funnel analysis project to identify conversion bottlenecks and optimize the checkout experience.\n\n## Challenge\n\nHigh cart abandonment rates and unclear attribution for conversions across multiple marketing channels.\n\n## Solution\n\nBuilt a comprehensive funnel tracking system using SQL, Python, and Power BI with cohort analysis capabilities.\n\n## Results\n\n- 28% improvement in checkout conversion\n- Clear multi-touch attribution model\n- A/B testing framework for continuous improvement",
    coverImageUrl: "",
    tools: ["SQL", "Python", "Power BI", "Kaggle"],
    status: "published",
    featured: true,
    sortOrder: 2,
  },
]);
console.log("✅ Case studies seeded");

// ─── Seed Blogs ──────────────────────────────────────────────────────────────

await Blog.deleteMany({});

await Blog.create([
  {
    title: "SQL Techniques for Product Analytics",
    slug: "sql-techniques-product-analytics",
    shortDescription: "Advanced SQL queries for cohort analysis, funnel analysis, and A/B test metrics.",
    content: "## Introduction\n\nSQL remains the backbone of product analytics. In this article, we cover the most powerful techniques for extracting insights from product data.\n\n## Cohort Analysis\n\nCohort analysis helps you understand user behavior over time...\n\n## Funnel Analysis\n\nBuilding funnel queries with window functions...\n\n## A/B Test Metrics\n\nStatistically valid experiment analysis in SQL...",
    tags: ["SQL", "Analytics Engineering", "Data Pipelines"],
    status: "published",
    featured: true,
    sortOrder: 0,
    readingTime: 8,
  },
  {
    title: "Designing Data Warehouses for Analytics",
    slug: "designing-data-warehouses-analytics",
    shortDescription: "Essentials of dimensional modeling, creating star schemas, and optimized data warehouses.",
    content: "## Introduction\n\nA well-designed data warehouse is the foundation of effective analytics...\n\n## Dimensional Modeling\n\nThe Kimball approach to dimensional modeling...\n\n## Star Schema Design\n\nBuilding fact and dimension tables...\n\n## Performance Optimization\n\nPartitioning, clustering, and materialized views...",
    tags: ["Data Modeling", "PostgreSQL", "Business Intelligence"],
    status: "published",
    featured: true,
    sortOrder: 1,
    readingTime: 10,
  },
  {
    title: "Building Data Pipelines with Python",
    slug: "building-data-pipelines-python",
    shortDescription: "Automating data ingestion and ETL pipelines using Python and optimized libraries.",
    content: "## Introduction\n\nPython has become the standard for building scalable data pipelines...\n\n## Pipeline Architecture\n\nDesigning robust, fault-tolerant ETL systems...\n\n## Key Libraries\n\nPandas, SQLAlchemy, and Airflow for pipeline orchestration...\n\n## AWS Integration\n\nLeveraging S3, Lambda, and Glue for serverless pipelines...",
    tags: ["Python", "ETL Pipelines", "AWS"],
    status: "published",
    featured: true,
    sortOrder: 2,
    readingTime: 12,
  },
]);
console.log("✅ Blogs seeded");

// ─── Seed Hero Section ───────────────────────────────────────────────────────

await HeroSection.deleteMany({});
await HeroSection.create({
  heading: "Analytics Engineering for Data-Driven Decision Making",
  subtitle: "Designing data pipelines, analytics models, and dashboards to transform raw data into business insights.",
  cta1Text: "View Case Studies",
  cta1Link: "/case-studies",
  cta2Text: "Explore Solutions",
  cta2Link: "/about",
  pipelineSteps: [
    { label: "Data Sources", iconName: "Database", order: 0 },
    { label: "Python ETL", iconName: "Code", order: 1 },
    { label: "Data Warehouse", iconName: "Server", order: 2 },
    { label: "Dashboard", iconName: "BarChart2", order: 3 },
  ],
  toolIcons: [
    { name: "dbt", iconUrl: "", order: 0 },
    { name: "Python", iconUrl: "", order: 1 },
    { name: "Power BI", iconUrl: "", order: 2 },
    { name: "Google Cloud", iconUrl: "", order: 3 },
    { name: "AWS", iconUrl: "", order: 4 },
  ],
});
console.log("✅ Hero section seeded");

// ─── Seed About Section ──────────────────────────────────────────────────────

await AboutSection.deleteMany({});
await AboutSection.create({
  name: "Farzeena",
  bio: "Analytics Engineer with 2+ years of experience in SQL, Python, and business intelligence. I design and build scalable data pipelines, analytics models, and data-driven dashboards that transform raw data into actionable business insights across multiple industries.",
  profileImageUrl: "",
  focusAreas: [
    { icon: "BarChart2", text: "Analytics Engineering", order: 0 },
    { icon: "Code", text: "Advanced SQL", order: 1 },
    { icon: "Database", text: "Data Modeling", order: 2 },
  ],
  industryTags: [
    { label: "Airlines", order: 0 },
    { label: "Marketplaces", order: 1 },
    { label: "Ecommerce", order: 2 },
    { label: "Logistics", order: 3 },
    { label: "Supplier SQL", order: 4 },
    { label: "Real Estate", order: 5 },
  ],
});
console.log("✅ About section seeded");

// ─── Seed Site Settings ──────────────────────────────────────────────────────

await SiteSettings.deleteMany({});
await SiteSettings.create({
  siteTitle: "Farzeena — Analytics Engineer",
  ctaBannerText: "Testing Analytics Insights",
  footerText: "© 2025 Farzeena. All rights reserved.",
  linkedinUrl: "https://linkedin.com",
  githubUrl: "https://github.com",
  twitterUrl: "https://twitter.com",
  contactEmail: ADMIN_EMAIL,
  metaTitleTemplate: "%s | Farzeena",
  defaultMetaDescription: "Analytics Engineer specializing in data pipelines, analytics models, and dashboards that drive data-driven decisions.",
});
console.log("✅ Site settings seeded");

await mongoose.disconnect();
console.log("\n🎉 Database seeded successfully!");
console.log(`\nAdmin login email: ${ADMIN_EMAIL}`);
console.log("Visit /admin/login to sign in.");

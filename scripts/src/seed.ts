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
    documentUrl: String,
    dashboardUrl: String,
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
    content: "## Overview\n\nThis project involved building a comprehensive analytics platform for a real estate marketplace, enabling stakeholders to make data-driven decisions on listing strategy and pricing.\n\n## Challenge\n\nThe client needed insights into listing performance across different markets and price segments. Manual reporting was taking days and lacked real-time visibility.\n\n## Solution\n\nWe designed an end-to-end pipeline using SQL, Python, and Power BI:\n\n1. **Data Ingestion** — Python scripts pulling from the marketplace API into PostgreSQL\n2. **Data Modeling** — Star schema with `fact_listings`, `dim_property`, `dim_market`\n3. **Transformation** — dbt models for price trend calculations and agent performance KPIs\n4. **Visualization** — Power BI dashboard with drill-down by region, property type, and price band\n\n## Template\n\nThe [downloadable data model template](https://drive.google.com/drive/folders/sample_real_estate) includes the full dbt project structure, SQL models, and a blank Power BI `.pbix` file ready to connect to your warehouse.\n\n## Results\n\n- 35% improvement in listing visibility metrics\n- Real-time price trend dashboards updated every 4 hours\n- Automated reporting reducing manual analysis by 80%",
    coverImageUrl: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800&q=80",
    tools: ["SQL", "Python", "Power BI", "dbt", "PostgreSQL"],
    status: "published",
    featured: true,
    sortOrder: 0,
    documentUrl: "https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/view",
    dashboardUrl: "https://app.powerbi.com/view?r=sample_real_estate_dashboard",
  },
  {
    title: "Airline Revenue Intelligence",
    slug: "airline-revenue-intelligence",
    shortDescription: "Optimize route profitability and revenue forecasting using advanced analytics.",
    content: "## Overview\n\nRevenue intelligence platform for airline route optimization and demand forecasting across a regional carrier's network of 200+ routes.\n\n## Challenge\n\nIdentifying underperforming routes and optimizing pricing strategy while accounting for seasonal demand, competitor pricing, and fuel costs.\n\n## Solution\n\nBuilt a Python-based ETL pipeline with SQL data models and Power BI dashboards:\n\n1. **Data Sources** — Booking systems, GDS feeds, fuel cost APIs\n2. **ETL** — Python + Airflow DAGs loading into BigQuery\n3. **Revenue Models** — SQL window functions for route-level RASK/CASK analysis\n4. **Forecasting** — Prophet time-series model for 90-day demand forecasts\n5. **Dashboard** — Revenue analysts' Power BI report with route drilldowns\n\n## Template\n\nDownload the [Airline Revenue Analytics template](https://drive.google.com/drive/folders/sample_airline) — includes BigQuery schemas, Python ETL scripts, and the Power BI report template.\n\n## Results\n\n- 12% increase in route profitability over 6 months\n- Predictive pricing model with 89% accuracy\n- Reduced analysis time from days to hours",
    coverImageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
    tools: ["SQL", "Python", "BigQuery", "Power BI", "Airflow"],
    status: "published",
    featured: true,
    sortOrder: 1,
    documentUrl: "https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/view",
    dashboardUrl: "https://app.powerbi.com/view?r=sample_airline_dashboard",
  },
  {
    title: "Ecommerce Funnel Analytics",
    slug: "ecommerce-funnel-analytics",
    shortDescription: "Understand drop-off points and optimize conversion through data-driven insights.",
    content: "## Overview\n\nEcommerce funnel analysis project to identify conversion bottlenecks and optimize the checkout experience for a D2C brand with 500K+ monthly visitors.\n\n## Challenge\n\nHigh cart abandonment rates (72%) and unclear attribution for conversions across Google, Meta, and email marketing channels.\n\n## Solution\n\nBuilt a comprehensive funnel tracking system:\n\n1. **Event Tracking** — Snowplow analytics collecting 40+ user events\n2. **Warehouse** — Snowflake with raw → staged → mart layers\n3. **Attribution Model** — Data-driven multi-touch attribution in dbt\n4. **Funnel Models** — SQL cohort and funnel analysis with 30/60/90-day windows\n5. **Dashboard** — Power BI report with A/B test result cards and conversion funnel visualization\n\n## Template\n\nThe [Ecommerce Analytics template](https://drive.google.com/drive/folders/sample_ecommerce) includes Snowflake DDL scripts, dbt project, attribution SQL, and the full Power BI `.pbix`.\n\n## Results\n\n- 28% improvement in checkout conversion rate\n- Clear multi-touch attribution reducing wasted ad spend by 18%\n- A/B testing framework running 3 experiments simultaneously",
    coverImageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    tools: ["SQL", "Python", "Power BI", "Snowflake", "dbt"],
    status: "published",
    featured: true,
    sortOrder: 2,
    documentUrl: "https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/view",
    dashboardUrl: "https://app.powerbi.com/view?r=sample_ecommerce_dashboard",
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
  siteTitle: "Farzeena P A",
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

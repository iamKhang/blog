// src/app/page.tsx

import { BlogSection } from "@/components/blog_session";
import { HeroSection } from "@/components/hero/Hero";
import MarqueeCustom from "@/components/hero/MarqueeCustom";
import { ProjectShowcase } from "@/components/project_session";
import { MotivationalQuotes } from "@/components/quote";
import { SkillsSection } from "@/components/skill_section";

const languageIcons = [
  "/language/csharp.svg",
  "/language/css-3.svg",
  "/language/cucumber.svg",
  "/language/hibernate.svg",
  "/language/html-5.svg",
  "/language/java.svg",
  "/language/javascript.svg",
  "/language/mariadb.svg",
  "/language/microsoft-sql-server.svg",
  "/language/mongodb.svg",
  "/language/mysql.svg",
  "/language/neo4j.svg",
  "/language/nextjs.svg",
  "/language/nodejs.svg",
  "/language/pgsql.svg",
  "/language/python.svg",
  "/language/reactjs.svg",
  "/language/spring.svg",
  "/language/tailwind.svg",
  "/language/typescript.svg",
];

const toolIcons = [
  "/tools/android-studio.svg",
  "/tools/canva.svg",
  "/tools/docker.svg",
  "/tools/eclipse.svg",
  "/tools/figma.svg",
  "/tools/github.svg",
  "/tools/intellij-idea.svg",
  "/tools/microsoft.svg",
  "/tools/notion.svg",
  "/tools/photoshop.svg",
  "/tools/postman.svg",
  "/tools/supabase.svg",
  "/tools/trello.svg",
  "/tools/gradle.svg",
  "/tools/maven.svg",
  "/tools/ubuntu.svg",
  "/tools/vscode.svg",
  "/tools/selenium.svg",
  "/tools/jira.svg",
];

export default function HomePage() {
  return (
    <div className="p-4">
      <HeroSection />
      <MarqueeCustom icons={languageIcons} direction="left" />
      <SkillsSection />
      <MarqueeCustom icons={toolIcons} direction="right" />
      <ProjectShowcase />
      <MarqueeCustom icons={languageIcons} direction="left" />
      <BlogSection />
      <MarqueeCustom icons={toolIcons} direction="right" />
      <MotivationalQuotes />
    </div>
  );
}

"use client";
import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Github, LampDesk } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import { ReactTyped, Typed } from "react-typed";

const icons = [
  "/language-com/csharp-svgrepo-com.svg",
  "/language-com/css-3-svgrepo-com.svg",
  "/language-com/html-5-svgrepo-com.svg",
  "/language-com/java-svgrepo-com.svg",
  "/language-com/mariadb-icon-svgrepo-com.svg",
  "/language-com/microsoft-sql-server-logo-svgrepo-com.svg",
  "/language-com/mongodb-logo-svgrepo-com.svg",
  "/language-com/mysql-svgrepo-com.svg",
  "/language-com/nextjs-svgrepo-com.svg",
  "/language-com/nodejs-icon-logo-svgrepo-com.svg",
  "/language-com/pgsql-svgrepo-com.svg",
  "/language-com/python-svgrepo-com.svg",
  "/language-com/reactjs-svgrepo-com.svg",
  "/language-com/spring-icon-svgrepo-com.svg",
  "/language-com/tailwind-svgrepo-com.svg",
  "/language-com/Neo4j.svg",
];

export function HeroSection() {
  const [imagePosition, setImagePosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImagePosition((prev) => (prev === 0 ? 5 : 0));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="container mx-auto px-[5%] md:px-4 py-4 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="order-2 md:order-1">
          <div>
            <Image
              src="/dev.gif"
              alt="Developer illustration"
              width={600}
              height={600}
              className="max-w-full h-auto"
              priority
            />
          </div>
        </div>
        <div className="space-y-6 order-1 md:order-2 align-middle">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Chào bạn, mình là
            </h1>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <ReactTyped
                startWhenVisible
                strings={["Lê Hoàng Khang"]}
                typeSpeed={300}
                backSpeed={60}
                loop
                cursorChar={"_"}
              ></ReactTyped>
            </h1>
          </div>
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground flex items-center gap-2">
              <LampDesk />
              Mình đang là sinh viên chuyên ngành Kỹ thuật phần mềm tại Đại học
              Công nghiệp TP.HCM (IUH).
            </p>
            <p className="text-muted-foreground border-l-[3px] pl-[3%]">
              Tại đây lưu giữ những dự án của mình trong suốt quá trình học tập
              & nghiên cứu và tất nhiên source code của chúng nếu các bạn muốn
              tham khảo & nghiên cứu.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Button className="gap-2" asChild>
              <Link href="https://github.com/iamKhang">
                <Github className="w-4 h-4" />
                Github
              </Link>
            </Button>
            <Button variant="secondary">
              About me
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2 h-4 w-4"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full bg-white/5 py-10 backdrop-blur-sm">
        <Marquee gradient={false} speed={50} className="flex">
          <div className="flex items-center gap-16 px-8">
            {icons.map((icon, index) => (
              <div
                key={index}
                className="flex items-center justify-center w-[50px]"
              >
                <Image
                  src={icon}
                  alt={`Technology ${index + 1}`}
                  width={60}
                  height={60}
                  className="object-contain hover:scale-110 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-16 px-8 py-4">
            {icons.map((icon, index) => (
              <div
                key={`repeat-${index}`}
                className="flex items-center justify-center w-[50px]"
              >
                <Image
                  src={icon}
                  alt={`Technology ${index + 1}`}
                  width={60}
                  height={60}
                  className="object-contain hover:scale-110 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        </Marquee>
      </div>
    </main>
  );
}

import Marquee from "react-fast-marquee"
import { Search } from "lucide-react"

import heroIcon from "./imgs/hero-2a493943.svg"
import androidLogo from "./imgs/android-color-svgrepo-com.svg"
import bootstrapLogo from "./imgs/bootstrap-svgrepo-com.svg"
import cssLogo from "./imgs/css-3-svgrepo-com.svg"
import githubLogo from "./imgs/github-142-svgrepo-com.svg"
import htmlLogo from "./imgs/html-svgrepo-com.svg"
import javaLogo from "./imgs/java-svgrepo-com.svg"
import javascriptLogo from "./imgs/javascript-svgrepo-com.svg"
import pythonLogo from "./imgs/python-svgrepo-com.svg"
import reactLogo from "./imgs/react-svgrepo-com.svg"
import scssLogo from "./imgs/scss-svgrepo-com.svg"
import springLogo from "./imgs/spring-svgrepo-com.svg"
import sqlLogo from "./imgs/sql-database-sql-azure-svgrepo-com.svg"
import tailwindLogo from "./imgs/tailwindcss-icon-svgrepo-com.svg"
import phpLogo from "./imgs/php-svgrepo-com.svg"
import cLogo from "./imgs/c.svg"
import cppLogo from "./imgs/c--4.svg"
import postgreLogo from "./imgs/postgresql-icon.svg"

const techLogos = [
  androidLogo, bootstrapLogo, cssLogo, githubLogo, htmlLogo, javaLogo,
  javascriptLogo, pythonLogo, reactLogo, scssLogo, springLogo, sqlLogo,
  tailwindLogo, phpLogo, cLogo, cppLogo, postgreLogo
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full md:w-1/2">
            <img
              src={heroIcon}
              alt="Hero"
              className="w-full h-auto animate-float"
            />
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Welcome to Hoang Khang&#39;s Blog
            </h1>
            <p className="text-lg md:text-xl text-blue-700 mb-6">
              I&#39;m a software engineering student in Ho Chi Minh City. This website is my platform to share knowledge and experiences in programming. Let&#39;s learn and grow together!
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Explore Blog
            </button>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-center mb-8">Technologies I Work With</h2>
          <Marquee className="flex" gradient={false} speed={50}>
            <div className="flex space-x-7 justify-between mt-10 sm:space-x-4 md:space-x-6 lg:space-x-7">
              {techLogos.map((image, index) => (
                <div
                  className="text-6xl sm:text-4xl md:text-5xl lg:text-6xl"
                  key={index}
                >
                  <img
                    src={image}
                    alt=""
                    className="xs:w-9 xs:h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
                  />
                </div>
              ))}
            </div>
            <div className="flex space-x-7 justify-between mt-10 mx-7 sm:space-x-4 md:space-x-6 lg:space-x-7">
              {techLogos.map((image, index) => (
                <div
                  className="text-6xl sm:text-4xl md:text-5xl lg:text-6xl"
                  key={index + techLogos.length}
                >
                  <img
                    src={image}
                    alt=""
                    className="xs:w-9 xs:h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
                  />
                </div>
              ))}
            </div>
          </Marquee>
        </div>

        <div className="mt-16 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-4">Search Articles</h2>
          <div className="flex items-center">
            <input
              type="search"
              placeholder="Search..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from "@/components/ui/badge"

interface Skill {
  name: string
  level: number
  category: string
  icon: string
}

const skills: Skill[] = [
  { name: "JavaScript", level: 90, category: "Frontend", icon: "/language/javascript.svg" },
  { name: "React", level: 85, category: "Frontend", icon: "/language/reactjs.svg" },
  { name: "Node.js", level: 75, category: "Backend", icon: "/language/nodejs.svg" },
  { name: "Python", level: 65, category: "Backend", icon: "/language/python.svg" },
  { name: "MongoDB", level: 70, category: "Database", icon: "/language/mongodb.svg" },
  { name: "PostgreSQL", level: 80, category: "Database", icon: "/language/pgsql.svg" },
]

const categories = Array.from(new Set(skills.map(skill => skill.category)))

export function SkillsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const filteredSkills = selectedCategory
    ? skills.filter(skill => skill.category === selectedCategory)
    : skills

  return (
    <section className="py-16 bg-gradient-to-b from-blue-900/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Technical Skills</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Here are the technologies I work with and my expertise level in each one.
            Click on a category to filter or hover over a skill to see more details.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <Badge 
            variant={selectedCategory === null ? "default" : "secondary"}
            className="cursor-pointer bg-blue-900 hover:bg-blue-800"
            onClick={() => setSelectedCategory(null)}
          >
            All Skills
          </Badge>
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.name}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onHoverStart={() => setHoveredSkill(skill.name)}
              onHoverEnd={() => setHoveredSkill(null)}
            >
              <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={skill.icon}
                      alt={`${skill.name} icon`}
                      className="w-8 h-8 object-contain"
                    />
                    <h3 className="font-semibold text-lg">{skill.name}</h3>
                  </div>
                  <Badge>{skill.category}</Badge>
                </div>
                
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-[#EC8305]"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                
                {hoveredSkill === skill.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap"
                  >
                    Proficiency: {skill.level}%
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
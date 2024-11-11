'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"

interface Quote {
  id: number
  text: string
  author: string
  image: string
}

const quotes: Quote[] = [
  {
    id: 1,
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    image: "https://hips.hearstapps.com/hmg-prod/images/apple-ceo-steve-jobs-speaks-during-an-apple-special-event-news-photo-1683661736.jpg?crop=0.800xw:0.563xh;0.0657xw,0.0147xh&resize=1200:*"
  },
  {
    id: 2,
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    image: "https://hips.hearstapps.com/hmg-prod/images/apple-ceo-steve-jobs-speaks-during-an-apple-special-event-news-photo-1683661736.jpg?crop=0.800xw:0.563xh;0.0657xw,0.0147xh&resize=1200:*"
  },
  {
    id: 3,
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Eleanor_Roosevelt_portrait_1933.jpg/800px-Eleanor_Roosevelt_portrait_1933.jpg"
  },
  {
    id: 4,
    text: "Strive not to be a success, but rather to be of value.",
    author: "Albert Einstein",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/220px-Albert_Einstein_Head.jpg"
  },
  {
    id: 5,
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    image: "https://cdn.britannica.com/67/75567-050-4EBBE84D/Nelson-Mandela.jpg"
  }
]

export function MotivationalQuotes() {
  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 10000) // Change quote every 10 seconds

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-blue-900/5">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-blue-900 mb-8 text-center">Inspirational Quotes</h2>
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={quotes[currentQuote].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={quotes[currentQuote].image}
                      alt={quotes[currentQuote].author}
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-blue-900">{quotes[currentQuote].author}</h3>
                    </div>
                  </div>
                  <blockquote className="text-lg italic text-gray-700">
                    "{quotes[currentQuote].text}"
                  </blockquote>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
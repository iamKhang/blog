'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, ArrowRight } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export function Footer() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your backend
    console.log('Subscribed:', email)
    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    })
    setEmail('')
  }

  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">iamHoangKhang</h2>
            <p className="text-sm">Empowering developers through knowledge sharing and innovative solutions.</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-[#EC8305] transition-transform hover:scale-110">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-[#EC8305] transition-transform hover:scale-110">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#EC8305] transition-transform hover:scale-110">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[#EC8305] transition-transform hover:scale-110">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ArrowRight className="w-5 h-5 mr-2 text-[#EC8305]" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Blog Posts', 'Projects'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase().replace(' ', '-')}`} 
                    className="hover:text-[#EC8305] transition-colors group flex items-center"
                  >
                    <span className="w-0 group-hover:w-2 transition-all duration-300 h-[2px] bg-[#EC8305] mr-2"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ArrowRight className="w-5 h-5 mr-2 text-[#EC8305]" />
              Resources
            </h3>
            <ul className="space-y-2">
              {['Learning Materials', 'FAQ', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase().replace(' ', '-')}`} 
                    className="hover:text-[#EC8305] transition-colors group flex items-center"
                  >
                    <span className="w-0 group-hover:w-2 transition-all duration-300 h-[2px] bg-[#EC8305] mr-2"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ArrowRight className="w-5 h-5 mr-2 text-[#EC8305]" />
              Stay Updated
            </h3>
            <p className="text-sm mb-4">Subscribe to our newsletter for the latest updates and articles.</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-blue-800 border-blue-700 text-white placeholder-blue-300"
              />
              <Button type="submit" className="w-full bg-[#EC8305] hover:bg-[#D97704]">
                Subscribe
              </Button>
            </form>
            <div className="mt-4">
              <a href="mailto:contact@iamhoangkhang.com" className="flex items-center hover:text-[#EC8305] transition-colors">
                <Mail className="w-5 h-5 mr-2" />
                contact@iamhoangkhang.com
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-blue-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} iamHoangKhang. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
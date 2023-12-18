import React from 'react'
import Header from '../../components/Header/header'
import Footer from '../../components/Footer/footer'

export default function Home() {
  return (
    <div>
        <Header/>
        <div className="h-[1000px] bg-slate-200">
          <div className="px-36 flex justify-around pt-7">
            <div className="w-1/2"><img className='animate-float h-full' src="/public/img/hero-2a493943.svg" alt="" /></div>
            <div className="bg-red-700 w-1/2"></div>
          </div>
          <div className="h-8"></div></div>
        </div>
        <Footer/>
    </div>
  )
}

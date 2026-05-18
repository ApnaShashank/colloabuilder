import React from 'react'
import Hero from '../components/new-landing/Hero/Hero.jsx';
import Features from '../components/new-landing/Features/Features.jsx';
import Benefits from '../components/new-landing/Benefits/Benefits.jsx';
import Footer from '../components/new-landing/Footer/Footer.jsx';
import useLenis from '../hooks/useLenis';

const LandingPage = () => {
  useLenis(); // for smooth scrolling

  return (
    <main className="bg-[#111110] min-h-screen font-body overflow-x-hidden">
       <div>
            <Hero />
       </div>
       <div>
          <Features />
       </div>
       <div>
         <Benefits />
       </div>
       <Footer />
    </main>
  )
}

export default LandingPage;

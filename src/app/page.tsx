import { HomeHeader } from '@/components/home/home-header'
import { Hero } from '@/components/home/hero'
import { Courses } from '@/components/home/courses'
import { HowItWorks } from '@/components/home/how-it-works'
import { Instructor } from '@/components/home/instructor'
import { Results } from '@/components/home/results'
import { Testimonials } from '@/components/home/testimonials'
import { Faq } from '@/components/home/faq'
import { FinalCta } from '@/components/home/final-cta'
import { HomeFooter } from '@/components/home/home-footer'

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-ivory">
      <HomeHeader />
      <main>
        <Hero />
        <Courses />
        <HowItWorks />
        <Instructor />
        <Results />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <HomeFooter />
    </div>
  )
}

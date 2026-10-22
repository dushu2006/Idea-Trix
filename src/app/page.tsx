import { About } from '@/components/sections/About';
import { Certificates } from '@/components/sections/Certificates';
import { Details } from '@/components/sections/Details';
import { Faq } from '@/components/sections/Faq';
import { Guidelines } from '@/components/sections/Guidelines';
import { Hero } from '@/components/sections/Hero';
import { Journey } from '@/components/sections/Journey';
import { Register } from '@/components/sections/Register';
import { Schedule } from '@/components/sections/Schedule';

export default function HomePage() {
  return (
    <main id="main" className="relative">
      <Hero />
      <About />
      <Details />
      <Journey />
      <Schedule />
      <Guidelines />
      <Certificates />
      <Faq />
      <Register />
    </main>
  );
}

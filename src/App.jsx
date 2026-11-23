import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Pillars from './components/Pillars';
import Gatherings from './components/Gatherings';
import Reflections from './components/Reflections';
import Leadership from './components/Leadership';
import Faq from './components/Faq';
import Contact from './components/Contact';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Pillars />
        <Gatherings />
        <Reflections />
        <Leadership />
        <Faq />
        <Contact />
      </main>
    </>
  );
}

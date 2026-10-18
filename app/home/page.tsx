import Hero from "./Hero";
import Selling from "./Selling";
import Selected from "./Selected";
import Philosophy from "./Philosophy";
import BrandsMarquee from "./BrandsMarquee";
import Newsletter from "./Newsletter";

export default function Home() {
  return (
    <main className="min-h-svh bg-white">
      <Hero />
      <Selling />
      <Selected />
      <Philosophy />
      <BrandsMarquee />
      <Newsletter />
    </main>
  );
}

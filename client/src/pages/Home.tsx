import { useTeam } from "@/hooks/use-team";
import { useProducts } from "@/hooks/use-products";
import { useVirtualTryOn } from "@/hooks/use-virtual-try-on";
import { Navigation } from "@/components/Navigation";
import { SectionHeader } from "@/components/SectionHeader";
import { TeamCard } from "@/components/TeamCard";
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";
import { Upload, Shirt, User, Loader2, Sparkles } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: teamMembers, isLoading: loadingTeam } = useTeam();
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { tryOn, isProcessing, result } = useVirtualTryOn();

  const [personImage, setPersonImage] = useState<File | null>(null);
  const [garmentImage, setGarmentImage] = useState<File | null>(null);
  
  const personInputRef = useRef<HTMLInputElement>(null);
  const garmentInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'person' | 'garment') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'person') setPersonImage(e.target.files[0]);
      else setGarmentImage(e.target.files[0]);
    }
  };

  const handleTryOn = () => {
    if (personImage && garmentImage) {
      tryOn(personImage, garmentImage);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {/* Fashion runway abstract background */}
          <img 
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2574&auto=format&fit=crop" 
            alt="Fashion Runway" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 tracking-tight leading-none">
              Revolutionizing <br/>
              <span className="text-accent italic">Fashion</span> with AI
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto mb-10 text-gray-200">
              Where technology meets style. Experience the future of personalized fashion with our AI-driven sizing and styling solutions.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-accent hover:text-primary-foreground text-lg px-8 py-6 rounded-full font-semibold transition-all duration-300"
              onClick={() => document.querySelector("#try-on")?.scrollIntoView({ behavior: "smooth" })}
            >
              Try Virtual Fitting
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Business Description Section */}
      <section id="about" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <SectionHeader 
                title="Redefining the Fit Experience" 
                subtitle="We bridge the gap between digital browsing and physical reality."
              />
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  At Resviss, we are tackling the biggest challenge in e-commerce: sizing and styling. 
                  Online shopping is convenient, but the uncertainty of fit leads to frustration and returns.
                </p>
                <p>
                  Our proprietary AI technology analyzes body measurements and garment physics to provide 
                  hyper-realistic virtual try-on experiences.
                </p>
                <div className="pt-6">
                  <h4 className="font-display text-2xl text-primary mb-2">Who We Serve</h4>
                  <p>Fashion-forward individuals who demand confidence in their purchases, and e-commerce platforms seeking to reduce return rates and increase engagement.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Abstract fashion tech image */}
              <div className="aspect-square rounded-full overflow-hidden border-8 border-secondary shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop" 
                  alt="Fashion Model" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="The Minds Behind Resviss" 
            subtitle="A diverse team of engineers, designers, and fashion experts united by a single vision."
            centered
          />
          
          {loadingTeam ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-primary w-12 h-12" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers?.map((member, idx) => (
                <TeamCard key={member.id} member={member} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="Our Innovation Pipeline" 
            subtitle="Explore the technologies we are building to reshape the industry."
          />

          {loadingProducts ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-primary w-12 h-12" />
            </div>
          ) : (
            <div className="space-y-12">
              {products?.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Virtual Try-On Demo Section */}
      <section id="try-on" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/10 -skew-x-12 transform translate-x-20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-4">
                Experience the Magic
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                Try our alpha version of the Virtual Try-On engine. Upload a photo of yourself and a garment to see how it fits.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Column 1: Person */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col items-center">
              <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <User className="text-accent" /> 1. Upload Your Photo
              </h3>
              
              <div 
                className="w-full aspect-[3/4] border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors overflow-hidden relative"
                onClick={() => personInputRef.current?.click()}
              >
                {personImage ? (
                  <img 
                    src={URL.createObjectURL(personImage)} 
                    alt="Person" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="w-12 h-12 text-white/40 mx-auto mb-2" />
                    <p className="text-sm text-white/60">Click to upload full-body photo</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={personInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'person')}
                />
              </div>
            </div>

            {/* Input Column 2: Garment */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col items-center">
              <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <Shirt className="text-accent" /> 2. Upload Garment
              </h3>
              
              <div 
                className="w-full aspect-[3/4] border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors overflow-hidden relative"
                onClick={() => garmentInputRef.current?.click()}
              >
                {garmentImage ? (
                  <img 
                    src={URL.createObjectURL(garmentImage)} 
                    alt="Garment" 
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="w-12 h-12 text-white/40 mx-auto mb-2" />
                    <p className="text-sm text-white/60">Click to upload garment photo</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={garmentInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'garment')}
                />
              </div>
            </div>

            {/* Action & Result Column */}
            <div className="flex flex-col justify-center space-y-6">
              <Button
                size="lg"
                className="w-full h-16 text-xl bg-accent text-accent-foreground hover:bg-white hover:text-primary transition-all duration-300 font-bold shadow-lg shadow-accent/20"
                onClick={handleTryOn}
                disabled={!personImage || !garmentImage || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-6 w-6" /> Try On Now
                  </>
                )}
              </Button>

              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden relative min-h-[400px]">
                {result ? (
                  <img 
                    src={result.image} 
                    alt="Result" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 p-6 text-center">
                    {isProcessing ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="animate-pulse">Generating your look...</p>
                      </div>
                    ) : (
                      <p>Result will appear here</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12 text-center text-muted-foreground">
        <p className="font-display font-bold text-xl text-primary mb-4">RESVISS</p>
        <p className="text-sm">&copy; {new Date().getFullYear()} Resviss Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

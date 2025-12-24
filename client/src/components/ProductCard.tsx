import { Product } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const isAlpha = product.stage.toLowerCase() === "alpha";

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow duration-300"
    >
      <div className="md:w-1/2 relative h-64 md:h-auto">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge 
            className={isAlpha ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}
          >
            {product.stage}
          </Badge>
        </div>
      </div>
      
      <div className="p-8 md:w-1/2 flex flex-col justify-center">
        <h3 className="text-3xl font-display font-bold text-foreground mb-4">
          {product.name}
        </h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {product.description}
        </p>
        
        {product.features && (
          <ul className="space-y-3 mb-8">
            {product.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-foreground/80">
                <div className="mt-1 min-w-4 min-h-4 rounded-full bg-accent/20 flex items-center justify-center">
                  <Check size={10} className="text-accent-foreground" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        )}

        <button className="self-start inline-flex items-center gap-2 font-semibold text-primary hover:gap-3 transition-all duration-300 group">
          Learn more <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

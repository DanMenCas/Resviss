import { TeamMember } from "@shared/schema";
import { motion } from "framer-motion";

interface TeamCardProps {
  member: TeamMember;
  index: number;
}

export function TeamCard({ member, index }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50"
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={member.imageUrl}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-accent font-medium text-sm tracking-widest uppercase mb-1">
          {member.role}
        </p>
        <h3 className="text-2xl font-display font-bold mb-2">{member.name}</h3>
        <p className="text-sm text-gray-200 line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          {member.bio}
        </p>
      </div>
    </motion.div>
  );
}

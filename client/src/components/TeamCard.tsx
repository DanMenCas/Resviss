import { TeamMember } from "@shared/schema";
import { motion } from "framer-motion";
import { Mail, Linkedin } from "lucide-react";

interface TeamCardProps {
  member: TeamMember;
  index: number;
}

export function TeamCard({ member, index }: TeamCardProps) {
  // Extract LinkedIn and email from bio
  const bioLines = member.bio.split("\n");
  const mainBio = bioLines[0];
  
  let linkedinUrl = "";
  let email = "";
  
  bioLines.forEach((line) => {
    if (line.includes("LinkedIn:")) {
      const url = line.replace("LinkedIn:", "").trim();
      linkedinUrl = url.startsWith("http") ? url : `https://${url}`;
    }
    if (line.includes("Email:")) {
      email = line.replace("Email:", "").trim();
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative overflow-visible bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 flex flex-col"
    >
      <div className="aspect-[3/4] overflow-hidden rounded-t-xl">
        <img
          src={member.imageUrl}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      
      <div className="p-6 text-foreground flex-1 flex flex-col">
        <p className="text-accent font-medium text-sm tracking-widest uppercase mb-2">
          {member.role}
        </p>
        <h3 className="text-xl font-display font-bold mb-3">{member.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {mainBio}
        </p>
        
        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-border/30">
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-accent hover:text-primary transition-colors"
              data-testid={`link-linkedin-${member.name}`}
            >
              <Linkedin className="w-4 h-4" />
              <span className="truncate">{linkedinUrl.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-sm text-accent hover:text-primary transition-colors"
              data-testid={`link-email-${member.name}`}
            >
              <Mail className="w-4 h-4" />
              <span className="truncate">{email}</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

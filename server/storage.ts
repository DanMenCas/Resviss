import {
  type TeamMember,
  type InsertTeamMember,
  type Product,
  type InsertProduct,
} from "@shared/schema";

export interface IStorage {
  getTeamMembers(): Promise<TeamMember[]>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
}

export class MemStorage implements IStorage {
  private teamMembers: Map<number, TeamMember>;
  private teamIdCounter: number;

  constructor() {
    this.teamMembers = new Map();
    this.teamIdCounter = 1;
    this.seedData();
  }

  private seedData() {
    this.createTeamMember({
      name: "Daniel Mendoza",
      role: "CEO & Founder",
      bio: "AI Engineer with extensive expertise in machine learning solutions and computer vision. Brings 6+ years of experience applying ML technologies to solve real-world problems.\n\nLinkedIn: linkedin.com/in/daniel-mendoza-castrillón-175b0b17a\nEmail: daniel.mendoza@resviss.com",
      imageUrl: "/team_members_images/Daniel.jpg",
    });
    this.createTeamMember({
      name: "Diego Mendoza",
      role: "CTO",
      bio: "Full Stack Developer with proven expertise in building scalable applications and integrating complex systems. Specializes in creating robust technical infrastructure to support innovative AI-driven features at scale.\n\nLinkedIn: linkedin.com/in/diegomendoza-fullstackdeveloper\nEmail: diego.mendoza@resviss.com",
      imageUrl:
        "/team_members_images/Diego.jpg",
    });
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values());
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const id = this.teamIdCounter++;
    const newMember: TeamMember = { ...member, id };
    this.teamMembers.set(id, newMember);
    return newMember;
  }

}

export const storage = new MemStorage();

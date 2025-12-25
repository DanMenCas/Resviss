import {
  type TeamMember,
  type InsertTeamMember,
  type Product,
  type InsertProduct,
} from "@shared/schema";

export interface IStorage {
  getTeamMembers(): Promise<TeamMember[]>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  getProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
}

export class MemStorage implements IStorage {
  private teamMembers: Map<number, TeamMember>;
  private products: Map<number, Product>;
  private teamIdCounter: number;
  private productIdCounter: number;

  constructor() {
    this.teamMembers = new Map();
    this.products = new Map();
    this.teamIdCounter = 1;
    this.productIdCounter = 1;
    this.seedData();
  }

  private seedData() {
    this.createTeamMember({
      name: "Daniel Mendoza",
      role: "CEO & Founder",
      bio: "AI Engineer with extensive expertise in machine learning solutions and computer vision. Brings 6+ years of experience applying ML technologies to solve real-world problems.\n\nLinkedIn: linkedin.com/in/daniel-mendoza-castrillón-175b0b17a\nEmail: daniel.mendoza@resviss.com",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    });
    this.createTeamMember({
      name: "Diego Mendoza",
      role: "CTO",
      bio: "Full Stack Developer with proven expertise in building scalable applications and integrating complex systems. Specializes in creating robust technical infrastructure to support innovative AI-driven features at scale.\n\nLinkedIn: linkedin.com/in/diegomendoza-fullstackdeveloper\nEmail: diego.mendoza@resviss.com",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    });
    this.createTeamMember({
      name: "Elena Rodriguez",
      role: "Head of Design",
      bio: "Award-winning designer focused on digital fashion experiences.",
      imageUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    });

    this.createProduct({
      name: "Virtual Mirror",
      description:
        "Experience clothes on your digital twin in real-time with our flagship AR technology.",
      stage: "Live",
      imageUrl:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600",
      features: ["Real-time Rendering", "Size Prediction", "Fabric Physics"],
    });
    this.createProduct({
      name: "StyleMatch AI",
      description:
        "Get personalized outfit recommendations based on your wardrobe and style preferences.",
      stage: "Beta",
      imageUrl:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=600",
      features: ["Wardrobe Analysis", "Trend Forecasting", "Personal Styling"],
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

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }
}

export const storage = new MemStorage();

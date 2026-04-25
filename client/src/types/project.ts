export interface Project {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    taskCount: number;
  }
  
  export interface CreateProjectInput {
    name: string;
    description?: string | null;
  }
  
  export interface UpdateProjectInput {
    name: string;
    description?: string | null;
  }
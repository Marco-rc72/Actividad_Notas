
export interface Notas {
    id: string;
    title: string;
    description: string;
    status: string;
    tags: string[]; 
    dueDate: Date;
    completed: boolean;
    createdAt: Date;
  }
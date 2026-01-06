// types/server.type.ts
export interface IServer {
  _id: string;
  name: string;
  baseUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type ServerCreateDTO = Omit<
  IServer,
  "_id" | "createdAt" | "updatedAt" | "__v"
>;
export type ServerUpdateDTO = Partial<ServerCreateDTO> & { _id: string };

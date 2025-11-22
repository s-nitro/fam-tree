export type Person = {
  id: string;
  name?: string;
  image?: string; // URL or base64
  children: Person[];
};

export default interface Model<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T>;
  getCount(): Promise<number>;
  create(data: T): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<T>;
}

export interface IBaseRepository<T> {
    findById(id: string): Promise<T | null>;
    findByName(name: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(dto: any): Promise<T>;
    update(id: string, dto: any): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}

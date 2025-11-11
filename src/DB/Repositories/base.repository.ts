import { FilterQuery, Model, ProjectionType, QueryOptions, UpdateQuery } from "mongoose";

export abstract class BaseRepository<T> {
    constructor(private model: Model<T>) {}

    
    async createNewDocument(document:Partial<T>): Promise<T> {
        return await this.model.create(document);
    }

    
    async findOneDocument(
        filters: FilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>
    ): Promise<T | null> {
        return await this.model.findOne(filters, projection, options);
    }

    
    async findDocumentById(
        id: string,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>
    ): Promise<T | null> {
        return await this.model.findById(id, projection, options);
    }

    
    async findDocuments(
        filters: FilterQuery<T> = {},
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>
    ): Promise<T[]> {
        return await this.model.find(filters, projection, options);
    }

    
    async updateOneDocument(
        filters: FilterQuery<T>,
        updateData: UpdateQuery<T>,
        options?: QueryOptions<T>
    ): Promise<T | null> {
        return await this.model.findOneAndUpdate(filters, updateData, {
            new: true,
            ...options,
        });
    }

    
   /* async updateMultipleDocuments(
       filters: FilterQuery<T>,
        updateData: UpdateQuery<T>,
        options?: QueryOptions
    ): Promise<{ matchedCount: number; modifiedCount: number }> {
        const result = await this.model.updateMany(filters, updateData, options);
        return {
            matchedCount: result.matchedCount ?? 0,
            modifiedCount: result.modifiedCount ?? 0,
        };
    }*/

    
    async deleteOneDocument(filters: FilterQuery<T>): Promise<T | null> {
        return await this.model.findOneAndDelete(filters);
    }

    
    async deleteMultipleDocuments(filters: FilterQuery<T>): Promise<number> {
        const result = await this.model.deleteMany(filters);
        return result.deletedCount ?? 0;
    }

    
    async findAndUpdateDocument(
        filters: FilterQuery<T>,
        updateData: UpdateQuery<T>,
        options?: QueryOptions<T>
    ): Promise<T | null> {
        return await this.model.findOneAndUpdate(filters, updateData, {
            new: true,
            ...options,
        });
    }

    
    async findAndDeleteDocument(
        filters: FilterQuery<T>,
        options?: QueryOptions<T>
    ): Promise<T | null> {
        return await this.model.findOneAndDelete(filters, options);
    }
}

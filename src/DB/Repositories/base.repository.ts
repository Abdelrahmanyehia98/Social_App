import mongoose, { FilterQuery, Model, ProjectionType, QueryOptions, UpdateQuery } from "mongoose";

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

    
    async findDocumentById(id: mongoose.Types.ObjectId | string,  projection?: ProjectionType<T>, options?: QueryOptions<T>): Promise<T | null> {
        return await this.model.findById(id, projection, options)
    }
    
    async findDocuments(
        filters: FilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T> & { populate?: any }
    ): Promise<T[]> {
        let query = this.model.find(filters, projection, options);

        if (options?.populate) {
            if (Array.isArray(options.populate)) {
                options.populate.forEach((pop) => query.populate(pop));
            } else {
                query.populate(options.populate);
            }
        }

        return await query.exec();
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

    async updateMultipleDocuments() {}

    async deleteByIdDocument(id: mongoose.Types.ObjectId | string) {
        return await this.model.findByIdAndDelete(id)
    }

    
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

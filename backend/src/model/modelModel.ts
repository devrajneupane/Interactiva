import { UUID } from "crypto";

import { TABLE } from "../enums";
import { BaseModel } from "./Base";
import { IGetUserQuery, IModel } from "../interface";

/**
 * `ModelModel` class represents operations related to comment management
 * Extends BaseModel for common functionalities
 */
export class ModelModel extends BaseModel {
  /**
   * Retrieves a list of model available to everyone to use based on filter criteria
   *
   * @param {UUID} filter Filter criteria including page, and size
   * @returns  List of Models
   */
  static async getModels(filter: Omit<IGetUserQuery, "q">): Promise<IModel[]> {
    const model = await this.queryBuilder()
      .select<IModel[]>("*")
      .table(TABLE.MODEL)
      // .where({ chatId: modelId })
      .limit(filter.size || 10)
      .offset((filter.page || 1 - 1) * (filter.size || 10));

    return model;
  }

  /**
   * Creates a custom model with given parameters based on existing model
   *
   * @param {Omit<IModel, "updatedAt">} model Model Object
   * @returns Newly created model object or `undefined`
   */
  static async createModel(
    model: Omit<IModel, "updatedAt">,
  ): Promise<IModel[]> {
    return await this.queryBuilder().transaction(async (trx) => {
      return await trx(TABLE.MODEL).insert(model).returning<IModel[]>("*");
    });
  }

  /**
   * Updates an existing prompt
   *
   * @param {UUID} id Model Id which needs to be updated
   * @param {Partial<IModel>} modelData Model data to update
   * @returns Updated model object
   */
  static async updateModel(
    id: UUID,
    modelData: Partial<IModel>,
  ): Promise<IModel[]> {
    return await this.queryBuilder().transaction(async (trx) => {
      return await trx(TABLE.MODEL)
        .where({ id })
        .update(modelData)
        .returning<IModel[]>("*");
    });
  }

  /**
   * Retrieves model by id
   *
   * @param {UUID} id Model id
   * @returns Model object if found or undefined
   */
  static async getModelById(id: UUID): Promise<IModel | undefined> {
    const model = await this.queryBuilder()
      .select<IModel>("*")
      .table(TABLE.MODEL)
      .where({ id })
      .first();
    return model;
  }
}

import { EntityRepository, Repository } from 'typeorm'

import Category from '../models/Category'


@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findByTitle(category: String): Promise<Category> {
    const findCategory = await this.findOne({
      where: { title: category }
    })

    return findCategory || null
  }
}

export default CategoriesRepository

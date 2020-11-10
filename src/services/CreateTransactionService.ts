import { getCustomRepository, getRepository } from "typeorm"

import AppError from '../errors/AppError'

import Transaction from '../models/Transaction'
import Category from '../models/Category'

import TransactionsRepository from '../repositories/TransactionsRepository'
import CategoriesRepository from '../repositories/CategoriesRepository'

interface Request {
  title: string,
  value: number,
  type: string,
  category: string
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository)
    const categoriesRespository = getCustomRepository(CategoriesRepository)

    const findCategory = await categoriesRespository.findByTitle(category)

    let categoryObj = {}

    if (findCategory) {
      categoryObj = findCategory
    } else {
      categoryObj = categoriesRespository.create({
        title: category
      })
      await categoriesRespository.save(categoryObj)
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: categoryObj
    })

    await transactionsRepository.save(transaction)

    return transaction
  }
}

export default CreateTransactionService

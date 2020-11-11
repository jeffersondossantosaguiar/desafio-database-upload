import { getCustomRepository } from "typeorm"

import AppError from '../errors/AppError'

import Transaction from '../models/Transaction'

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

    const balance = await transactionsRepository.getBalance()

    if (type === 'outcome' && value > balance.total) {
      throw new AppError("Balance unavailable!", 400)
    }

    let categoryObj = {}

    const findCategory = await categoriesRespository.findByTitle(category)
    console.log(findCategory)


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

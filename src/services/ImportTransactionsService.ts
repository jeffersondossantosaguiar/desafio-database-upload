import csv from 'csvtojson'
import { getCustomRepository } from "typeorm"

import Transaction from '../models/Transaction'
import TransactionsRepository from '../repositories/TransactionsRepository'
import CategoriesRepository from '../repositories/CategoriesRepository'

class ImportTransactionsService {
  async execute(userAvatarFilePath: string): Promise<Transaction[]> {
    const transactionsArray = await csv().fromFile(userAvatarFilePath)

    const transactionsRepository = getCustomRepository(TransactionsRepository)
    const categoriesRespository = getCustomRepository(CategoriesRepository)

    const transactions: Transaction[] = []
    let categoryObj = {}

    await Promise.all(transactionsArray.map(async t => {

      const findCategory = await categoriesRespository.findByTitle(t.category)
      console.log(findCategory)

      if (findCategory) {
        categoryObj = findCategory
      } else {
        categoryObj = categoriesRespository.create({
          title: t.category
        })
        await categoriesRespository.save(categoryObj)
      }

      const transaction = transactionsRepository.create({
        title: t.title,
        value: t.value,
        type: t.type,
        category: categoryObj
      })
      transactions.push(transaction)
    }))

    await transactionsRepository.save(transactions)

    return transactions
  }
}

export default ImportTransactionsService

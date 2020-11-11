import csv from 'csvtojson'
import { getCustomRepository, getRepository } from "typeorm"

import Transaction from '../models/Transaction'
import TransactionsRepository from '../repositories/TransactionsRepository'
import CategoriesRepository from '../repositories/CategoriesRepository'
import Category from '../models/Category'

class ImportTransactionsService {
  async execute(userAvatarFilePath: string): Promise<Transaction[]> {
    const transactionsArray = await csv().fromFile(userAvatarFilePath)

    const transactionsRepository = getCustomRepository(TransactionsRepository)
    const categoriesRespository = getCustomRepository(CategoriesRepository)

    const transactions: Transaction[] = []
    let categoryObj: Category

    const categoriesMap = transactionsArray.map(transaction => transaction.category)
    const categoriesFiltred = categoriesMap.filter(function (item, pos) {
      return categoriesMap.indexOf(item) == pos
    })
    await Promise.all(categoriesFiltred.map(async category => {
      const findCategory = await categoriesRespository.findByTitle(category)

      if (findCategory) {
        categoryObj = findCategory
      } else {
        categoryObj = categoriesRespository.create({
          title: category
        })
        await categoriesRespository.save(categoryObj)
      }
    }))

    await Promise.all(transactionsArray.map(async t => {

      const category = await categoriesRespository.findByTitle(t.category)

      const transaction = transactionsRepository.create({
        title: t.title,
        value: t.value,
        type: t.type,
        category
      })
      transactions.push(transaction)
    }))

    await transactionsRepository.save(transactions)

    return transactions
  }
}

export default ImportTransactionsService

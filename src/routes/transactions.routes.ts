import { Router } from 'express'
import path from 'path'
import { getCustomRepository } from 'typeorm'
import multer from 'multer'
import uploadConfig from '../config/upload'

import TransactionsRepository from '../repositories/TransactionsRepository'
import CreateTransactionService from '../services/CreateTransactionService'
import DeleteTransactionService from '../services/DeleteTransactionService'
import ImportTransactionsService from '../services/ImportTransactionsService'

const transactionsRouter = Router()
const upload = multer(uploadConfig)

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository)
  const transactions = await transactionsRepository.find({ relations: ["category"] })
  const balance = await transactionsRepository.getBalance()

  const transactionsPlusBalance = {
    transactions: transactions,
    balance: balance
  }

  return response.json(transactionsPlusBalance)
})

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body

  const createTransation = new CreateTransactionService

  const transaction = await createTransation.execute({
    title,
    value,
    type,
    category
  })

  return response.json(transaction)
})

transactionsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const deleteTransaction = new DeleteTransactionService

  const deleteResult = await deleteTransaction.execute(id)

  if (deleteResult) {
    return response.json({ message: 'transaction deleted successfully' })
  }
})

transactionsRouter.post('/import', upload.single('transactions'), async (request, response) => {
  const userAvatarFilePath = path.join(uploadConfig.directory, request.file.filename)
  const importTransactions = new ImportTransactionsService

  const importTransactionsResult = await importTransactions.execute(userAvatarFilePath)

  return response.json(importTransactionsResult)
})

export default transactionsRouter

import { getRepository } from 'typeorm'
import AppError from '../errors/AppError'

import Transaction from '../models/Transaction'

class DeleteTransactionService {
  public async execute(id: string): Promise<any> {
    const transactionsRepository = getRepository(Transaction)
    const deleteResult = await transactionsRepository.delete(id)

    if (!deleteResult.affected) {
      throw new AppError('Id not exists', 400)
    }

    return deleteResult
  }
}

export default DeleteTransactionService

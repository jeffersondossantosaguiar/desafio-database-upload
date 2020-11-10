import { EntityRepository, Repository } from 'typeorm'

import Transaction from '../models/Transaction'

interface Balance {
  income: number
  outcome: number
  total: number
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const balance = {
      income: 0,
      outcome: 0,
      total: 0
    }

    const transactions = await this.find()

    transactions.map(function (obj) {
      if (obj.type === "income") {
        balance.income = balance.income + obj.value
      } else {
        balance.outcome = balance.outcome + obj.value
      }
    })

    balance.total = balance.income - balance.outcome

    return balance
  }
}

export default TransactionsRepository

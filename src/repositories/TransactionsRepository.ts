import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Register {
  type: string;
  sum: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const balances: Register[] = await this.query(
      'SELECT type,  SUM (value) FROM transactions GROUP BY type;',
    );
    const incomeRegister = balances.filter(b => b.type === 'income');
    const outcomeRegister = balances.filter(b => b.type === 'outcome');

    const income = incomeRegister.length === 0 ? 0 : incomeRegister[0].sum;
    const outcome = outcomeRegister.length === 0 ? 0 : outcomeRegister[0].sum;

    return { income, outcome, total: income - outcome };
  }
}

export default TransactionsRepository;

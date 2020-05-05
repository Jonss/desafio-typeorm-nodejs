import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const findTx = await transactionRepository.findOne(id);
    if (!findTx) {
      throw new AppError(
        'Transaction cannot be deleted if it does not exist.',
        404,
      );
    }

    await transactionRepository.remove(findTx);
  }
}

export default DeleteTransactionService;

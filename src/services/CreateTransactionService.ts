import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    if (
      type === 'outcome' &&
      value > (await (await transactionRepository.getBalance()).total)
    ) {
      throw new AppError('Outcome not permitted');
    }

    let categoryEntity = await categoryRepository.findOne({
      title: category,
    });

    if (!categoryEntity) {
      categoryEntity = categoryRepository.create({
        title: category,
      });
      categoryEntity = await categoryRepository.save(categoryEntity);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryEntity.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

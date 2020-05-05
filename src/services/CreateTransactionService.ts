// import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
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
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

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

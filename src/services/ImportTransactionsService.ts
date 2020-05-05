import csvParse from 'csv-parse';

import fs from 'fs';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Tx {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const contactReadStream = fs.createReadStream(filePath);

    const parsers = csvParse({
      from_line: 2,
    });

    const parseCSV = contactReadStream.pipe(parsers);

    const transactions: Tx[] = [];
    const categories = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);

      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const createTransactionService = new CreateTransactionService();

    const txs: Promise<Transaction>[] = transactions.map(tx =>
      createTransactionService.execute({
        title: tx.title,
        value: tx.value,
        category: tx.category,
        type: tx.type,
      }),
    );

    return Promise.all(txs);
  }
}

export default ImportTransactionsService;

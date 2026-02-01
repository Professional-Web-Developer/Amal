import { TransactionController } from '@/backend/controllers/transactionController';

export async function GET() {
    return TransactionController.getTransactions();
}

export async function POST(request: Request) {
    return TransactionController.createTransaction(request);
}

import { TransactionController } from '@/backend/controllers/transactionController';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return TransactionController.getTransactionById(id);
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return TransactionController.updateTransaction(id, request);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return TransactionController.deleteTransaction(id);
}

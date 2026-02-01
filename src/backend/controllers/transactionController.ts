import { NextResponse } from 'next/server';
import { TransactionService } from '../services/transactionService';

export class TransactionController {
    static async getTransactions() {
        try {
            const transactions = await TransactionService.getAllTransactions();
            return NextResponse.json({ success: true, data: transactions });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }

    static async createTransaction(req: Request) {
        try {
            const body = await req.json();
            const transaction = await TransactionService.createTransaction(body);
            return NextResponse.json({ success: true, data: transaction });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }
}

"use server";

import { TransactionService, CreateTransactionDTO } from '@/backend/services/transactionService';
import { revalidatePath } from 'next/cache';

export async function createTransaction(data: CreateTransactionDTO) {
    try {
        const transaction = await TransactionService.createTransaction(data);
        revalidatePath('/transactions');
        revalidatePath('/');
        return { success: true, data: transaction };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getTransactions() {
    try {
        return await TransactionService.getAllTransactions();
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
}

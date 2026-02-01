"use server";

import { AccountService, CreateAccountDTO } from '@/backend/services/accountService';
import { revalidatePath } from 'next/cache';

export async function createAccount(data: CreateAccountDTO) {
    try {
        const account = await AccountService.createAccount(data);
        revalidatePath('/accounts');
        return { success: true, data: account };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getAccounts() {
    try {
        return await AccountService.getAllAccounts();
    } catch (error) {
        console.error('Error fetching accounts:', error);
        return [];
    }
}

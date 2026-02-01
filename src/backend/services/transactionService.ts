import { createClient } from '@/utils/supabase/server';

export interface CreateTransactionDTO {
    name: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
    account_id?: string;
}

export class TransactionService {
    static async getAllTransactions() {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data || [];
    }

    static async createTransaction(dto: CreateTransactionDTO) {
        const supabase = await createClient();

        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { data, error } = await supabase
            .from('transactions')
            .insert([{ ...dto, user_id: user.id }])
            .select();

        if (error) throw new Error(error.message);
        return data ? data[0] : null;
    }
}

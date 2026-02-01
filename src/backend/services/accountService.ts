import { createClient } from '@/utils/supabase/server';

export interface CreateAccountDTO {
    name: string;
    type: string;
    balance: number;
    bank_name?: string;
}

export class AccountService {
    static async getAllAccounts() {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('accounts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data || [];
    }

    static async createAccount(dto: CreateAccountDTO) {
        const supabase = await createClient();
        
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { data, error } = await supabase
            .from('accounts')
            .insert([{ ...dto, user_id: user.id }])
            .select();

        if (error) throw new Error(error.message);
        return data ? data[0] : null;
    }
}

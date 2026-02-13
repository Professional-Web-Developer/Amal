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
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { data, error } = await supabase
            .from('accounts')
            .insert([{ ...dto, user_id: user.id }])
            .select();

        if (error) throw new Error(error.message);
        return data ? data[0] : null;
    }

    static async updateAccount(id: string, dto: Partial<CreateAccountDTO>) {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { data, error } = await supabase
            .from('accounts')
            .update(dto)
            .eq('id', id)
            .eq('user_id', user.id)
            .select();

        if (error) throw new Error(error.message);
        return data ? data[0] : null;
    }

    static async deleteAccount(id: string) {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { error } = await supabase
            .from('accounts')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw new Error(error.message);
        return true;
    }
}

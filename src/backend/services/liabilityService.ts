import { createClient } from '@/utils/supabase/server';
import { Liability, LiabilityType } from '@/types/finance';

export interface CreateLiabilityDTO {
    type: LiabilityType;
    name: string;
    outstanding_amount: number;
    original_amount: number;
    interest_rate: number;
    emi_amount: number;
    due_date: string;
    start_date: string;
    end_date?: string;
    linked_account_id?: string;
    is_recurring?: boolean;
    notes?: string;
}

export class LiabilityService {
    static async getAllLiabilities() {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { data, error } = await supabase
            .from('liabilities')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return (data || []) as Liability[];
    }

    static async createLiability(dto: CreateLiabilityDTO) {
        const supabase = await createClient();
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { data, error } = await supabase
            .from('liabilities')
            .insert([{ ...dto, user_id: user.id }])
            .select();

        if (error) throw new Error(error.message);
        return data ? data[0] as Liability : null;
    }

    static async updateLiability(id: string, dto: Partial<CreateLiabilityDTO>) {
        const supabase = await createClient();
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { data, error } = await supabase
            .from('liabilities')
            .update(dto)
            .eq('id', id)
            .eq('user_id', user.id)
            .select();

        if (error) throw new Error(error.message);
        return data ? data[0] as Liability : null;
    }

    static async deleteLiability(id: string) {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { error } = await supabase
            .from('liabilities')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw new Error(error.message);
        return true;
    }
}

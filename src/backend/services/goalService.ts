import { createClient } from '@/utils/supabase/server';
import { FinancialGoal, GoalCategory } from '@/types/finance';

export interface CreateGoalDTO {
    goal_name: string;
    target_amount: number;
    target_date: string;
    current_saved: number;
    linked_account_id?: string;
    goal_category: GoalCategory;
    is_recurring?: boolean;
    recurring_amount?: number;
    icon?: string;
    priority: number;
    notes?: string;
}

export class GoalService {
    static async getAllGoals() {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { data, error } = await supabase
            .from('financial_goals')
            .select('*')
            .eq('user_id', user.id)
            .order('priority', { ascending: true });

        if (error) throw new Error(error.message);
        return (data || []) as FinancialGoal[];
    }

    static async createGoal(dto: CreateGoalDTO) {
        const supabase = await createClient();
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { data, error } = await supabase
            .from('financial_goals')
            .insert([{ ...dto, user_id: user.id }])
            .select();

        if (error) throw new Error(error.message);
        return data ? data[0] as FinancialGoal : null;
    }

    static async updateGoal(id: string, dto: Partial<CreateGoalDTO>) {
        const supabase = await createClient();
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { data, error } = await supabase
            .from('financial_goals')
            .update(dto)
            .eq('id', id)
            .eq('user_id', user.id)
            .select();

        if (error) throw new Error(error.message);
        return data ? data[0] as FinancialGoal : null;
    }

    static async deleteGoal(id: string) {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { error } = await supabase
            .from('financial_goals')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw new Error(error.message);
        return true;
    }
}

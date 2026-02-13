import { createClient } from '@/utils/supabase/server';
import { Asset, AssetType } from '@/types/finance';

export interface CreateAssetDTO {
    asset_type: AssetType;
    asset_name: string;
    quantity?: number;
    current_value: number;
    purchase_value: number;
    purchase_date?: string;
    linked_account_id?: string;
    is_recurring?: boolean;
    recurring_amount?: number;
    notes?: string;
}

export class AssetService {
    static async getAllAssets() {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { data, error } = await supabase
            .from('assets')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return (data || []) as Asset[];
    }

    static async createAsset(dto: CreateAssetDTO) {
        const supabase = await createClient();
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { data, error } = await supabase
            .from('assets')
            .insert([{ ...dto, user_id: user.id }])
            .select();

        if (error) throw new Error(error.message);
        return data ? data[0] as Asset : null;
    }

    static async updateAsset(id: string, dto: Partial<CreateAssetDTO>) {
        const supabase = await createClient();
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { data, error } = await supabase
            .from('assets')
            .update(dto)
            .eq('id', id)
            .eq('user_id', user.id)
            .select();

        if (error) throw new Error(error.message);
        return data ? data[0] as Asset : null;
    }

    static async deleteAsset(id: string) {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { error } = await supabase
            .from('assets')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw new Error(error.message);
        return true;
    }
}

"use server";

import { LiabilityService, CreateLiabilityDTO } from '@/backend/services/liabilityService';
import { revalidatePath } from 'next/cache';

export async function createLiability(data: CreateLiabilityDTO) {
    try {
        const liability = await LiabilityService.createLiability(data);
        revalidatePath('/');
        revalidatePath('/liabilities');
        return { success: true, data: liability };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getLiabilities() {
    try {
        return await LiabilityService.getAllLiabilities();
    } catch (error) {
        console.error('Error fetching liabilities:', error);
        return [];
    }
}

export async function updateLiability(id: string, data: Partial<CreateLiabilityDTO>) {
    try {
        const liability = await LiabilityService.updateLiability(id, data);
        revalidatePath('/');
        revalidatePath('/liabilities');
        return { success: true, data: liability };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteLiability(id: string) {
    try {
        await LiabilityService.deleteLiability(id);
        revalidatePath('/');
        revalidatePath('/liabilities');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

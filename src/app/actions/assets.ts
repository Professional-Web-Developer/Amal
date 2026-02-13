"use server";

import { AssetService, CreateAssetDTO } from '@/backend/services/assetService';
import { revalidatePath } from 'next/cache';

export async function createAsset(data: CreateAssetDTO) {
    try {
        const asset = await AssetService.createAsset(data);
        revalidatePath('/');
        revalidatePath('/assets');
        return { success: true, data: asset };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getAssets() {
    try {
        return await AssetService.getAllAssets();
    } catch (error) {
        console.error('Error fetching assets:', error);
        return [];
    }
}

export async function updateAsset(id: string, data: Partial<CreateAssetDTO>) {
    try {
        const asset = await AssetService.updateAsset(id, data);
        revalidatePath('/');
        revalidatePath('/assets');
        return { success: true, data: asset };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteAsset(id: string) {
    try {
        await AssetService.deleteAsset(id);
        revalidatePath('/');
        revalidatePath('/assets');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

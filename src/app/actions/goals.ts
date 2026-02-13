"use server";

import { GoalService, CreateGoalDTO } from '@/backend/services/goalService';
import { revalidatePath } from 'next/cache';

export async function createGoal(data: CreateGoalDTO) {
    try {
        const goal = await GoalService.createGoal(data);
        revalidatePath('/');
        revalidatePath('/goals');
        return { success: true, data: goal };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getGoals() {
    try {
        return await GoalService.getAllGoals();
    } catch (error) {
        console.error('Error fetching goals:', error);
        return [];
    }
}

export async function updateGoal(id: string, data: Partial<CreateGoalDTO>) {
    try {
        const goal = await GoalService.updateGoal(id, data);
        revalidatePath('/');
        revalidatePath('/goals');
        return { success: true, data: goal };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteGoal(id: string) {
    try {
        await GoalService.deleteGoal(id);
        revalidatePath('/');
        revalidatePath('/goals');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

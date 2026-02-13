import { NextResponse } from 'next/server';
import { GoalService, CreateGoalDTO } from '../services/goalService';

export class GoalController {
    static async getGoals() {
        try {
            const goals = await GoalService.getAllGoals();
            return NextResponse.json({ success: true, data: goals });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }

    static async createGoal(req: Request) {
        try {
            const body = await req.json();
            const goal = await GoalService.createGoal(body);
            return NextResponse.json({ success: true, data: goal });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }

    static async updateGoal(id: string, req: Request) {
        try {
            const body = await req.json();
            const goal = await GoalService.updateGoal(id, body);
            return NextResponse.json({ success: true, data: goal });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }

    static async deleteGoal(id: string) {
        try {
            await GoalService.deleteGoal(id);
            return NextResponse.json({ success: true });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }
}

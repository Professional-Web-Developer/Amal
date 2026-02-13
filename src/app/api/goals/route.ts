import { GoalController } from '@/backend/controllers/goalController';

export async function GET() {
    return GoalController.getGoals();
}

export async function POST(request: Request) {
    return GoalController.createGoal(request);
}

import { GoalController } from '@/backend/controllers/goalController';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return GoalController.updateGoal(id, request);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return GoalController.deleteGoal(id);
}

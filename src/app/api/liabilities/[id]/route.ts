import { LiabilityController } from '@/backend/controllers/liabilityController';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return LiabilityController.updateLiability(id, request);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return LiabilityController.deleteLiability(id);
}

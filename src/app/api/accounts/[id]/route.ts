import { AccountController } from '@/backend/controllers/accountController';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return AccountController.updateAccount(id, request);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return AccountController.deleteAccount(id);
}

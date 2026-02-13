import { AssetController } from '@/backend/controllers/assetController';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    return AssetController.updateAsset(id, request);
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    return AssetController.deleteAsset(id);
}

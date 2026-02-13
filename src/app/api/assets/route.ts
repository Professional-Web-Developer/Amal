import { AssetController } from '@/backend/controllers/assetController';

export async function GET() {
    return AssetController.getAssets();
}

export async function POST(request: Request) {
    return AssetController.createAsset(request);
}

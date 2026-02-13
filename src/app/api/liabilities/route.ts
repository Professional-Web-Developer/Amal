import { LiabilityController } from '@/backend/controllers/liabilityController';

export async function GET() {
    return LiabilityController.getLiabilities();
}

export async function POST(request: Request) {
    return LiabilityController.createLiability(request);
}

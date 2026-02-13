import { AuthController } from '@/backend/controllers/authController';

export async function POST(request: Request) {
    return AuthController.login(request);
}

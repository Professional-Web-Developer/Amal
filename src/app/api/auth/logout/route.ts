import { AuthController } from '@/backend/controllers/authController';

export async function POST() {
    return AuthController.logout();
}

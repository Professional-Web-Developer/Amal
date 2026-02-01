import { AccountController } from '@/backend/controllers/accountController';

export async function GET() {
    return AccountController.getAccounts();
}

export async function POST(request: Request) {
    return AccountController.createAccount(request);
}

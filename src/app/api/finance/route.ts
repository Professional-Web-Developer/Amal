import { FinanceController } from '@/backend/controllers/financeController';

export async function GET() {
    return FinanceController.getComprehensiveData();
}

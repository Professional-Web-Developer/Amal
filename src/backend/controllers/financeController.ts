import { NextResponse } from 'next/server';
import { FinanceService } from '../services/financeService';

export class FinanceController {
    static async getComprehensiveData() {
        try {
            const data = await FinanceService.getComprehensiveFinanceData();
            return NextResponse.json({ success: true, data });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }
}

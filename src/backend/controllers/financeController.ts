import { NextResponse } from 'next/server';
import { getComprehensiveFinanceData } from '@/app/actions/finance';

export class FinanceController {
    static async getComprehensiveData() {
        try {
            const data = await getComprehensiveFinanceData();
            return NextResponse.json({ success: true, data });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }
}

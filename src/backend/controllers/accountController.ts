import { NextResponse } from 'next/server';
import { AccountService } from '../services/accountService';

export class AccountController {
    static async getAccounts() {
        try {
            const accounts = await AccountService.getAllAccounts();
            return NextResponse.json({ success: true, data: accounts });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }

    static async createAccount(req: Request) {
        try {
            const body = await req.json();
            const account = await AccountService.createAccount(body);
            return NextResponse.json({ success: true, data: account });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }
}

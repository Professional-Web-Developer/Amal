import { NextResponse } from 'next/server';
import { LiabilityService, CreateLiabilityDTO } from '../services/liabilityService';

export class LiabilityController {
    static async getLiabilities() {
        try {
            const liabilities = await LiabilityService.getAllLiabilities();
            return NextResponse.json({ success: true, data: liabilities });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }

    static async createLiability(req: Request) {
        try {
            const body = await req.json();
            const liability = await LiabilityService.createLiability(body);
            return NextResponse.json({ success: true, data: liability });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }

    static async updateLiability(id: string, req: Request) {
        try {
            const body = await req.json();
            const liability = await LiabilityService.updateLiability(id, body);
            return NextResponse.json({ success: true, data: liability });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }

    static async deleteLiability(id: string) {
        try {
            await LiabilityService.deleteLiability(id);
            return NextResponse.json({ success: true });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }
}

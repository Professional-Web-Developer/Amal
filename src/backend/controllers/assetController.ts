import { NextResponse } from 'next/server';
import { AssetService, CreateAssetDTO } from '../services/assetService';

export class AssetController {
    static async getAssets() {
        try {
            const assets = await AssetService.getAllAssets();
            return NextResponse.json({ success: true, data: assets });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }

    static async createAsset(req: Request) {
        try {
            const body = await req.json();
            const asset = await AssetService.createAsset(body);
            return NextResponse.json({ success: true, data: asset });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }

    static async updateAsset(id: string, req: Request) {
        try {
            const body = await req.json();
            const asset = await AssetService.updateAsset(id, body);
            return NextResponse.json({ success: true, data: asset });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }

    static async deleteAsset(id: string) {
        try {
            await AssetService.deleteAsset(id);
            return NextResponse.json({ success: true });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }
}

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export class AuthController {
    static async login(req: Request) {
        try {
            const body = await req.json();
            const { email, password } = body;
            const supabase = await createClient();

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return NextResponse.json({ success: false, error: error.message }, { status: 401 });
            }

            return NextResponse.json({ success: true });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }

    static async signup(req: Request) {
        try {
            const body = await req.json();
            const { email, password } = body;
            const supabase = await createClient();

            const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${origin}/auth/callback`,
                },
            });

            if (error) {
                return NextResponse.json({ success: false, error: error.message }, { status: 400 });
            }

            return NextResponse.json({ success: true });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }

    static async logout() {
        try {
            const supabase = await createClient();
            await supabase.auth.signOut();
            return NextResponse.json({ success: true });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }
}

import { NextResponse } from 'next/server'
// The client you created from the server-side auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  console.log('Auth Callback triggered:', { code: !!code, origin, next });

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      console.log('Auth exchange successful, redirecting to:', next);
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error('Auth exchange error:', error);
    }
  }

  // If we're here, something went wrong
  console.log('Redirecting to login due to missing code or error');
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}

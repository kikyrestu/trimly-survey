import { NextRequest, NextResponse } from 'next/server';

// Default admin credentials (in production, use database & proper encryption)
const ADMIN_USERS = [
  {
    username: 'admin',
    password: 'trimly2025', // For demo purposes only
  },
];

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    console.log('Login attempt:', { username, password }); // Debug log

    // Find user
    const user = ADMIN_USERS.find((u) => u.username === username);

    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { success: false, message: 'Username atau password salah' },
        { status: 401 }
      );
    }

    // Verify password (simple comparison for demo)
    const isValidPassword = password === user.password;

    if (!isValidPassword) {
      console.log('Invalid password');
      return NextResponse.json(
        { success: false, message: 'Username atau password salah' },
        { status: 401 }
      );
    }

    console.log('Login successful!');

    // Generate simple token (in production, use JWT)
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      success: true,
      token,
      message: 'Login berhasil',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

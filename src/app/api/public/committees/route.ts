import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Committee } from '@/lib/db';

function publicResponse<T>(data: T, message = 'Success') {
  return NextResponse.json({ success: true, message, data });
}

function publicError(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

// GET /api/public/committees - Get all committees for public display
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'current' or 'past'

    const query: Record<string, unknown> = { isActive: true };
    if (type) query.type = type;

    const committees = await Committee.find(query)
      .sort({ type: 1, createdAt: -1 });

    // Sort members by order within each committee
    const data = committees.map((c) => ({
      id: c._id,
      name: c.name,
      term: c.term,
      description: c.description,
      type: c.type,
      members: [...c.members].sort((a, b) => a.order - b.order).map((m) => ({
        id: m._id,
        name: m.name,
        designation: m.designation,
        designationLabel: m.designationLabel,
        photo: m.photo,
        phone: m.phone,
        email: m.email,
        bio: m.bio,
      })),
    }));

    return publicResponse(data, 'Committees retrieved successfully');
  } catch (error) {
    console.error('Get public committees error:', error);
    return publicError('Internal server error', 500);
  }
}

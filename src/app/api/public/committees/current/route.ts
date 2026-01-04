import { NextResponse } from 'next/server';
import { connectDB, Committee } from '@/lib/db';

function publicResponse<T>(data: T, message = 'Success') {
  return NextResponse.json({ success: true, message, data });
}

function publicError(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

// GET /api/public/committees/current - Get current committee
export async function GET() {
  try {
    await connectDB();

    const committee = await Committee.findOne({ type: 'current', isActive: true });

    if (!committee) {
      return publicResponse(null, 'No current committee found');
    }

    // Sort members by order
    const data = {
      id: committee._id,
      name: committee.name,
      term: committee.term,
      description: committee.description,
      members: [...committee.members].sort((a, b) => a.order - b.order).map((m) => ({
        id: m._id,
        name: m.name,
        designation: m.designation,
        designationLabel: m.designationLabel,
        photo: m.photo,
        phone: m.phone,
        email: m.email,
        bio: m.bio,
      })),
    };

    return publicResponse(data, 'Current committee retrieved successfully');
  } catch (error) {
    console.error('Get current committee error:', error);
    return publicError('Internal server error', 500);
  }
}

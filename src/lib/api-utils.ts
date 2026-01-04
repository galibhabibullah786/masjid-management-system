import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema, ZodError } from 'zod';
import { getAuthFromRequest, TokenPayload } from './auth';
import { hasPermission, Permission } from './permissions';
import { connectDB } from './db';

// ============================================
// API RESPONSE HELPERS
// ============================================
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?: Record<string, string[]>;
}

export function successResponse<T>(data: T, message = 'Success', meta?: ApiResponse['meta']): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  if (meta) response.meta = meta;
  return NextResponse.json(response);
}

export function errorResponse(message: string, status = 400, errors?: Record<string, string[]>): NextResponse {
  const response: ApiResponse = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;
  return NextResponse.json(response, { status });
}

export function notFoundResponse(resource = 'Resource'): NextResponse {
  return errorResponse(`${resource} not found`, 404);
}

export function unauthorizedResponse(message = 'Unauthorized'): NextResponse {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = 'Forbidden'): NextResponse {
  return errorResponse(message, 403);
}

export function validationErrorResponse(error: ZodError): NextResponse {
  const errors: Record<string, string[]> = {};
  error.issues.forEach((err) => {
    const path = err.path.join('.');
    if (!errors[path]) errors[path] = [];
    errors[path].push(err.message);
  });
  return errorResponse('Validation failed', 422, errors);
}

// ============================================
// REQUEST VALIDATION
// ============================================
export async function validateRequest<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { data, error: null };
  } catch (error) {
    if (error instanceof ZodError) {
      return { data: null, error: validationErrorResponse(error) };
    }
    return { data: null, error: errorResponse('Invalid request body') };
  }
}

// ============================================
// AUTH MIDDLEWARE
// ============================================
export interface AuthenticatedHandler {
  (request: NextRequest, auth: TokenPayload, params?: unknown): Promise<NextResponse>;
}

export function withAuth(handler: AuthenticatedHandler, requiredPermission?: Permission) {
  return async (request: NextRequest, context?: { params?: Promise<unknown> }): Promise<NextResponse> => {
    try {
      await connectDB();
      
      const auth = await getAuthFromRequest(request);
      if (!auth) {
        return unauthorizedResponse();
      }

      if (requiredPermission && !hasPermission(auth.role, requiredPermission)) {
        return forbiddenResponse('You do not have permission to perform this action');
      }

      const params = context?.params ? await context.params : undefined;
      return handler(request, auth, params);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return errorResponse('Internal server error', 500);
    }
  };
}

// ============================================
// PAGINATION HELPERS
// ============================================
export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  search?: string;
}

export function getPaginationParams(searchParams: URLSearchParams): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));
  const skip = (page - 1) * limit;
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
  const search = searchParams.get('search') || undefined;

  return { page, limit, skip, sortBy, sortOrder, search };
}

export function getPaginationMeta(total: number, page: number, limit: number): ApiResponse['meta'] {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

// ============================================
// RECEIPT NUMBER GENERATOR
// ============================================
export function generateReceiptNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RCP-${timestamp}-${random}`;
}

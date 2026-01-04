import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`;
}

export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleString('en-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRelativeTime(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateString);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length - 3) + '...' : str;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'verified':
    case 'active':
      return 'bg-emerald-100 text-emerald-700';
    case 'pending':
      return 'bg-amber-100 text-amber-700';
    case 'rejected':
    case 'inactive':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export function getTypeColor(type: string): string {
  switch (type) {
    case 'Cash':
      return 'bg-emerald-100 text-emerald-700';
    case 'Material':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
import { LAND_UNIT_TO_DECIMAL, STANDARD_LAND_UNIT } from './constants';

/**
 * Convert land amount from any unit to the standard unit (Decimal)
 */
export function convertToDecimal(amount: number, fromUnit: string): number {
  const conversionRate = LAND_UNIT_TO_DECIMAL[fromUnit] || 1;
  return amount * conversionRate;
}

/**
 * Format land amount with conversion to standard unit (Decimal)
 * Returns the amount in Decimal with proper formatting
 */
export function formatLandAmount(amount: number, unit: string): string {
  const decimalAmount = convertToDecimal(amount, unit);
  // Round to 2 decimal places
  const rounded = Math.round(decimalAmount * 100) / 100;
  return `${rounded.toLocaleString('en-BD')} শতাংশ`;
}

/**
 * Format land amount with original unit for admin display
 */
export function formatLandAmountWithUnit(amount: number, unit: string): string {
  const unitLabels: Record<string, string> = {
    decimal: 'শতাংশ',
    katha: 'কাঠা',
    bigha: 'বিঘা',
    acre: 'একর',
    sqft: 'বর্গফুট',
  };
  return `${amount.toLocaleString('en-BD')} ${unitLabels[unit] || unit}`;
}
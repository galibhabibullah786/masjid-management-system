'use client';

import { Menu, Bell, LogOut, Check, CheckCheck } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth, useSidebar } from '@/lib/context';
import { Avatar, Badge, Spinner } from '@/components/admin/ui';
import { activityApi } from '@/lib/api';
import type { ActivityLog } from '@/lib/types';

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

export function Header() {
  const { user, logout } = useAuth();
  const { toggle } = useSidebar();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Fetch notifications when panel opens
  useEffect(() => {
    if (showNotifications) {
      fetchNotifications();
    }
  }, [showNotifications]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await activityApi.getRecent(20);
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      await activityApi.markAsRead([id]);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await activityApi.markAsRead(undefined, true);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    // Router redirect is handled in the logout function in context
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contribution': return '💰';
      case 'committee': return '👥';
      case 'gallery': return '🖼️';
      case 'settings': return '⚙️';
      case 'user': return '👤';
      case 'delete': return '🗑️';
      default: return '📋';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifications(!showNotifications);
              }}
              className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                    >
                      <CheckCheck className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="py-8 flex justify-center">
                      <Spinner size="sm" />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-start gap-3 ${
                          !notification.read ? 'bg-primary-50/50' : ''
                        }`}
                        onClick={() => !notification.read && markAsRead(notification._id)}
                      >
                        <span className="text-lg">{getActivityIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notification.read ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                            {notification.action}
                          </p>
                          {notification.details && (
                            <p className="text-xs text-gray-500 truncate">{notification.details}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification._id);
                            }}
                            className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowUserMenu(!showUserMenu);
              }}
              className="flex justify-center items-center p-1.5 rounded-lg hover:bg-gray-100"
            >
              <Avatar name={user?.name || 'Admin'} size="sm" />
              <span className="hidden md:block text-sm font-medium text-gray-700 ml-2">{user?.name}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <div className="mt-1">
                    <Badge variant="info" size="sm">{user?.role?.replace('_', ' ')}</Badge>
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

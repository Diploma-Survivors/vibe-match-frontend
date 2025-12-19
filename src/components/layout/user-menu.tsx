'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserProfile } from '@/types/user';
import { History, LogIn, LogOut, User } from 'lucide-react';
import Link from 'next/link';

interface UserMenuProps {
  user: UserProfile | null;
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage src={user.avatarUrl} alt={user.firstName} />
            <AvatarFallback className="bg-green-600 text-white font-medium">
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link
              href={`/profile/${user.id}`}
              className="cursor-pointer w-full flex items-center"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Hồ sơ của tôi</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/profile/${user.id}/practice`}
              className="cursor-pointer w-full flex items-center"
            >
              <History className="mr-2 h-4 w-4" />
              <span>Lịch sử luyện tập</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onLogout}
            className="text-red-600 cursor-pointer w-full flex items-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link href="/login">
      <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
        <LogIn size={18} />
        Go to login
      </Button>
    </Link>
  );
}

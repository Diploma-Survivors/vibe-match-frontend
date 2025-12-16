'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserInfo } from '@/types/states';
import type { UserProfile } from '@/types/user';
import { ChevronDown, LogIn, LogOut, User } from 'lucide-react';
import Link from 'next/link';

interface UserMenuProps {
  user: UserInfo | null;
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white border-none shadow-none">
            <User size={18} />
            <span className="hidden md:inline">{`${user.firstName} ${user.lastName}`}</span>
            <ChevronDown size={16} className="ml-1 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Hồ sơ của tôi</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onLogout}
            className="text-red-600 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
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

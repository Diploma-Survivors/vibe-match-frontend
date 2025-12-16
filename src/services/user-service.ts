import type { UserProfile } from '@/types/user';

async function getUserProfile(): Promise<UserProfile> {
  // Mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        username: '@nguyenvana',
        firstName: 'Nguyen Van',
        lastName: 'A',
        email: 'nguyenvana@example.com',
        address: '123 Le Loi, District 1, Ho Chi Minh City',
        phone: '0901234567',
        rank: 80,
        avatarUrl: 'https://github.com/shadcn.png',
      });
    }, 500);
  });
}

export const UserService = {
  getUserProfile,
};

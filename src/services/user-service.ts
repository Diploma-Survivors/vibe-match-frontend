import type { UserProfile } from '@/types/user';

async function getUserProfile(userId: number): Promise<UserProfile> {
  // Mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
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

async function getMe(): Promise<any> {
  // Mock data for current user
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          data: {
            id: 101,
            username: '@currentuser',
            firstName: 'Current',
            lastName: 'User',
            email: 'current@example.com',
            address: '456 Tran Hung Dao',
            phone: '0909999999',
            rank: 100,
            avatarUrl: 'https://github.com/shadcn.png',
          },
        },
      } as any);
    }, 300);
  });
}

export const UserService = {
  getUserProfile,
  getMe,
};

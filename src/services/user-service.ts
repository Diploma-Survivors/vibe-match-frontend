import type { UserProfile } from '@/types/user';

async function getUserProfile(userId: number): Promise<UserProfile> {
  // Mock data
  if (userId === 3) {
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
          // give another image
          avatarUrl:
            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
        });
      }, 500);
    });
  }
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

async function getAllUsers(): Promise<UserProfile[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users: UserProfile[] = Array.from({ length: 50 }).map((_, i) => ({
        id: i + 1,
        username: `@user${i + 1}`,
        firstName: 'User',
        lastName: `${i + 1}`,
        email: `user${i + 1}@example.com`,
        address: '123 Street, City',
        phone: '0123456789',
        rank: Math.floor(Math.random() * 100) + 1,
        avatarUrl: `https://i.pravatar.cc/150?u=${i + 1}`,
      }));
      resolve(users);
    }, 500);
  });
}

async function getAllContestParticipants(
  contestId: string
): Promise<UserProfile[]> {
  // Mock data - same as getAllUsers for now, but conceptually filtered by contest
  return getAllUsers();
}

export const UserService = {
  getUserProfile,
  getMe,
  getAllUsers,
  getAllContestParticipants,
};

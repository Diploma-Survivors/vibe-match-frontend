import type { Contest, User } from '@/types/contest';

export const mockContests: Contest[] = [
  {
    id: '1',
    name: 'Weekly Contest 462',
    startTime: '2025-08-10T14:30:00Z',
    duration: '02:15',
    writers: ['-firefly-', 'Tobo', '-baozi_', 'eflshel'],
    status: 'upcoming',
    participantCount: 25851,
    isVirtual: true,
    registrationOpen: true,
    image: '/icons/contest-weekly.svg',
    description: 'Weekly contest with challenging algorithmic problems',
  },
  {
    id: '2',
    name: 'Codeforces Round (Div. 3)',
    startTime: '2025-08-21T14:35:00Z',
    duration: '02:15',
    writers: ['tourist', 'Um_nik'],
    status: 'upcoming',
    participantCount: 0,
    registrationOpen: false,
    image: '/icons/contest-codeforces.svg',
    description: 'Division 3 round suitable for beginners',
  },
  {
    id: '3',
    name: 'Atto Round 1 (Codeforces Round 1041, Div. 1 + Div. 2)',
    startTime: '2025-08-07T14:35:00Z',
    duration: '03:00',
    writers: [
      'Ali_BBN',
      'Bahemin',
      'Hamed_Ghaffari',
      'ROOT',
      'eren___',
      'sweetweasel',
    ],
    status: 'finished',
    participantCount: 30570,
    image: '/icons/contest-atto.svg',
    description: 'Combined division round with advanced problems',
  },
  {
    id: '4',
    name: 'Codeforces Round 1040 (Div. 1)',
    startTime: '2025-07-31T14:35:00Z',
    duration: '03:00',
    writers: ['wuhudsm'],
    status: 'finished',
    participantCount: 1309,
    image: '/icons/contest-div1.svg',
    description: 'Division 1 round for advanced participants',
  },
  {
    id: '5',
    name: 'Codeforces Round 1040 (Div. 2)',
    startTime: '2025-07-31T14:35:00Z',
    duration: '03:00',
    writers: ['wuhudsm'],
    status: 'finished',
    participantCount: 29575,
    image: '/icons/contest-div2.svg',
    description: 'Division 2 round for intermediate participants',
  },
  {
    id: '6',
    name: 'Educational Codeforces Round 181 (Rated for Div. 2)',
    startTime: '2025-07-22T14:35:00Z',
    duration: '02:00',
    writers: ['BledDest', 'FelixArg', 'Neon', 'adedalic', 'awoo', 'ffvv'],
    status: 'finished',
    participantCount: 31238,
    image: '/icons/contest-educational.svg',
    description: 'Educational round focusing on learning new concepts',
  },
  {
    id: '7',
    name: 'THI THỬ TIN HỌC CƠ SỞ 2 (LẬP TRÌNH C 2025) PTIT TEST 5',
    startTime: '2025-07-04T14:00:00Z',
    duration: '01:15',
    writers: ['PTIT'],
    status: 'finished',
    participantCount: 542,
    image: '/icons/contest-ptit.svg',
    description: 'Practice test for C programming fundamentals',
  },
  {
    id: '8',
    name: 'THI THỬ TIN HỌC CƠ SỞ 2 (LẬP TRÌNH C 2025) PTIT TEST 4',
    startTime: '2025-07-01T14:00:00Z',
    duration: '01:15',
    writers: ['PTIT'],
    status: 'finished',
    participantCount: 333,
    image: '/icons/contest-ptit.svg',
    description: 'Practice test for C programming fundamentals',
  },
];

export const mockGlobalRanking: User[] = [
  {
    id: '1',
    username: 'Miruu',
    avatar: '/avatars/rank1.svg',
    country: 'JP',
    rating: 3703,
    attendedContests: 26,
    rank: 1,
  },
  {
    id: '2',
    username: 'Neal Wu',
    avatar: '/avatars/rank2.svg',
    country: 'US',
    rating: 3686,
    attendedContests: 51,
    rank: 2,
  },
  {
    id: '3',
    username: 'Yawn_Sean',
    avatar: '/avatars/rank3.svg',
    country: 'CN',
    rating: 3645,
    attendedContests: 84,
    rank: 3,
  },
  {
    id: '4',
    username: '小羊肖恩',
    avatar: '/avatars/bear-avatar.svg',
    country: 'CN',
    rating: 3611,
    attendedContests: 107,
    rank: 4,
  },
  {
    id: '5',
    username: '何逊',
    avatar: '/avatars/cat-avatar.svg',
    country: 'CN',
    rating: 3599,
    attendedContests: 146,
    rank: 5,
  },
  {
    id: '6',
    username: 'tourist',
    avatar: '/avatars/robot-avatar.svg',
    country: 'BY',
    rating: 3583,
    attendedContests: 289,
    rank: 6,
  },
  {
    id: '7',
    username: 'jiangly',
    avatar: '/avatars/default-red.svg',
    country: 'CN',
    rating: 3568,
    attendedContests: 156,
    rank: 7,
  },
  {
    id: '8',
    username: 'Benq',
    avatar: '/avatars/default-orange.svg',
    country: 'US',
    rating: 3542,
    attendedContests: 198,
    rank: 8,
  },
];

export function getContestsByStatus() {
  const upcoming = mockContests.filter(
    (contest) => contest.status === 'upcoming'
  );
  const ongoing = mockContests.filter(
    (contest) => contest.status === 'ongoing'
  );
  const finished = mockContests.filter(
    (contest) => contest.status === 'finished'
  );

  return {
    upcoming,
    ongoing,
    finished,
  };
}

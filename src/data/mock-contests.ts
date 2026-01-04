import { Contest, ContestStatus } from '@/types/contests';

export const MOCK_CONTESTS: Contest[] = Array.from({ length: 50 }).map(
    (_, index) => {
        const id = (index + 1).toString();
        const now = new Date();

        // Generate random dates relative to now
        // Some in the past, some in the future, some ongoing
        const randomOffsetDays = Math.floor(Math.random() * 60) - 30; // +/- 30 days
        const startTime = new Date(now);
        startTime.setDate(now.getDate() + randomOffsetDays);

        const durationMinutes = [60, 90, 120, 180, 300][Math.floor(Math.random() * 5)];
        const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

        let status = ContestStatus.NOT_STARTED;
        if (now > endTime) {
            status = ContestStatus.FINISHED;
        } else if (now >= startTime && now <= endTime) {
            status = ContestStatus.ONGOING;
        } else {
            status = ContestStatus.NOT_STARTED;
        }

        return {
            id,
            title: `Weekly Contest ${300 + index}`,
            description: `This is a description for Weekly Contest ${300 + index}`,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            durationMinutes,
            status,
            participantCount: Math.floor(Math.random() * 1000),
            maxParticipant: 5000,
            contestProblems: [],
        };
    }
);

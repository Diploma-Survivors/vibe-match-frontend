export default function ContestInfo({ contestId }: { contestId: string }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Thông tin cuộc thi</h2>
            <p>Contest ID: {contestId}</p>
            {/* Thêm thông tin chi tiết về contest ở đây */}
        </div>
    );
}

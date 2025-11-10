import { format } from 'date-fns';
import React from 'react';

interface TimelineProps {
  timelineEvents: TimelineEvent[];
}

interface TimelineEvent {
  id: string;
  name: string;
  timestamp: string;
}

const Timeline = ({ timelineEvents }: TimelineProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy, hh:mm a');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    // <div className="min-h-screen bg-gray-50 py-12 px-4">
    <div className="max-w-6xl mx-auto">
      {timelineEvents.length > 0 && (
        <div className="relative flex items-center justify-between">
          {timelineEvents.map((item, index) => (
            <React.Fragment key={item.id}>
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-8 h-8 rounded-full bg-green-600 
                    flex items-center justify-center transition-transform duration-300 hover:scale-110`}
                >
                  <span className="text-white text-sm">{index + 1}</span>
                </div>
                <div className="mt-4 text-center w-32">
                  <div className="font-medium text-sm text-gray-900 mb-1">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(item.timestamp)}
                  </div>
                </div>
              </div>
              {index < timelineEvents.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-300 relative z-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
    // </div>
  );
};

export default Timeline;

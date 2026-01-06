
import React, { useState, useRef, useEffect } from 'react';
import { Shoutout, User } from '../types';
import { CORE_VALUE_COLORS } from '../constants';

interface FeedHistoryProps {
  shoutouts: Shoutout[];
  users: readonly User[];
}

const FeedHistory: React.FC<FeedHistoryProps> = ({ shoutouts, users }) => {
  const [displayCount, setDisplayCount] = useState(10);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayCount(prev => Math.min(prev + 5, shoutouts.length));
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [shoutouts.length]);

  const visibleShoutouts = shoutouts.slice(0, displayCount);

  // Helper date formatter
  const formatDate = (ts: number) => new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4 pb-10">
      
      {shoutouts.length === 0 && (
          <div className="text-center py-8 text-gray-400 font-bold italic">
              No history yet. Start announcing!
          </div>
      )}

      {visibleShoutouts.map(shout => {
        const from = users.find(u => u.id === shout.fromUserId);
        const recipients = shout.recipientIds.map(id => users.find(u => u.id === id)).filter(Boolean);
        
        if (!from || recipients.length === 0) return null;

        return (
            <div key={shout.id} className="bg-gray-50 rounded-2xl border-2 border-gray-200 p-4 opacity-75 hover:opacity-100 transition-opacity">
                 <div className="flex justify-between items-start mb-2">
                    <div className="text-xs font-bold text-gray-400">
                        {formatDate(shout.timestamp)}
                    </div>
                    <div className="flex gap-1">
                        {shout.coreValues.map(val => (
                            <div key={val} className={`w-2 h-2 rounded-full ${CORE_VALUE_COLORS[val].split(' ')[0]}`} />
                        ))}
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-sm text-gray-600">{from.name}</span>
                    <span className="text-gray-300 text-xs">➜</span>
                    <span className="font-bold text-sm text-eos-text">
                        {recipients.map(r => r?.name).join(', ')}
                    </span>
                 </div>

                 <p className="text-gray-500 text-sm italic">"{shout.message}"</p>
            </div>
        );
      })}
      
      {/* Invisible target for infinite scroll */}
      {displayCount < shoutouts.length && (
          <div ref={observerTarget} className="h-10 flex justify-center items-center">
              <span className="animate-spin text-gray-300">⏳</span>
          </div>
      )}
    </div>
  );
};

export default FeedHistory;

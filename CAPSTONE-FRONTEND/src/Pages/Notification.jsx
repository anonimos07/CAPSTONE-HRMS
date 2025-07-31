import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Bell, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Notification = ({ 
  id,
  title, 
  message, 
  timestamp, 
  isRead,
  onClose,
  onMarkAsRead,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localIsRead, setLocalIsRead] = useState(isRead);
  const notificationRef = useRef(null);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.classList.add('overflow-hidden');
      
      // Mark as read when expanded if not already read
      if (!localIsRead) {
        setLocalIsRead(true);
        onMarkAsRead?.(id);
      }
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('overflow-hidden');
    };
  }, [isExpanded, id, localIsRead, onMarkAsRead]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formatTime = (dateTime) => {
    return formatDistanceToNow(new Date(dateTime), { addSuffix: true });
  };

  const handleMarkAsRead = (e) => {
    e.stopPropagation();
    if (!localIsRead) {
      setLocalIsRead(true);
      onMarkAsRead?.(id);
    }
  };

  return (
    <>
      {/* Backdrop for expanded state */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
      )}

      <Card
        ref={notificationRef}
        className={`
          relative transition-all duration-300 cursor-pointer border-l-4
          ${!localIsRead ? 'border-primary' : 'border-transparent'}
          ${isExpanded ? 
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md' : 
            'w-full'}
          ${className}
        `}
        onClick={toggleExpand}
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4">
          <div className="space-y-1">
            <CardTitle className={`text-sm font-medium ${!localIsRead ? 'text-foreground' : 'text-muted-foreground'}`}>
              {title}
            </CardTitle>
            <CardDescription className="text-xs">
              {formatTime(timestamp)}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            {!localIsRead && !isExpanded && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 rounded-full"
                onClick={handleMarkAsRead}
              >
                <Check className="h-3 w-3" />
              </Button>
            )}
            
            {isExpanded && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose?.(id);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className={`${isExpanded ? 'p-4 pt-0' : 'px-4 pb-4'}`}>
          {isExpanded ? (
            <p className="text-sm text-muted-foreground">{message}</p>
          ) : (
            <p className={`text-sm ${!localIsRead ? 'text-foreground' : 'text-muted-foreground'} truncate`}>
              {message.length > 100 ? `${message.substring(0, 100)}...` : message}
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Notification;
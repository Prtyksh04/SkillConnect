import { useEffect, useState } from 'react';

const TimesAgo = (d, isShortText = false) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);    
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        if (isShortText) {
            return `${days}d`;
        }
        return `${days} days ago`;
    }
    if (hours > 0) {
        if (isShortText) {
            return `${hours}h`;
        }
        return `${hours} hours ago`;
    }
    if (minutes > 0) {
        if (isShortText) {
            return `${minutes}m`;
        }
        return `${minutes} minutes ago`;
    }
    if (seconds > 0) {
        if (isShortText) {
            return `${seconds}s`;
        }
        return `${seconds} seconds ago`;
    }
    return 'Just now';
}

const TimeStampToDate = (d) => {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${day}-${month}-${year}`;
}



const useCountdown = (targetDate) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval); // This clears the interval when the component unmounts.

  }, [countDownDate]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown) => {
  //1000 * 60 * 60 * 24 means 1 day
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  //1000 * 60 * 60 means 1 hour
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //1000 * 60 means 1 minute
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    //1000 means 1 second
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [days, hours, minutes, seconds];
};


export { TimesAgo, TimeStampToDate, useCountdown};
import React, { useEffect, useState } from 'react';
import { FiCalendar, FiChevronDown } from 'react-icons/fi';

const PhilippineHolidaysCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [holidaysByYear, setHolidaysByYear] = useState({});
  const [loadingYear, setLoadingYear] = useState(null);

  // Fallback fixed-date holidays used if network fetch fails
  const getFallbackFixedDateHolidays = (year) => ({
    '01-01': { name: "New Year's Day", type: 'Regular Holiday' },
    '02-25': { name: 'People Power Revolution Anniversary', type: 'Special Non-Working Holiday' },
    '04-09': { name: 'Day of Valor (Araw ng Kagitingan)', type: 'Regular Holiday' },
    '05-01': { name: 'Labor Day', type: 'Regular Holiday' },
    '06-12': { name: 'Independence Day', type: 'Regular Holiday' },
    '08-21': { name: 'Ninoy Aquino Day', type: 'Special Non-Working Holiday' },
    '11-01': { name: "All Saints' Day", type: 'Special Non-Working Holiday' },
    '11-02': { name: "All Souls' Day", type: 'Special Non-Working Holiday' },
    '11-30': { name: 'Bonifacio Day', type: 'Regular Holiday' },
    '12-08': { name: 'Feast of the Immaculate Conception', type: 'Special Non-Working Holiday' },
    '12-25': { name: 'Christmas Day', type: 'Regular Holiday' },
    '12-30': { name: 'Rizal Day', type: 'Regular Holiday' },
    '12-31': { name: "New Year's Eve", type: 'Special Non-Working Holiday' }
  });

  const ensureYearHolidaysLoaded = async (year) => {
    const yearKey = String(year);
    if (holidaysByYear[yearKey] || loadingYear === year) return;
    try {
      setLoadingYear(year);
      const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/PH`);
      if (!response.ok) throw new Error('Failed to fetch holidays');
      const data = await response.json();
      const mapped = {};
      data.forEach((h) => {
        const holidayName = h.name || h.localName;
        const dateObj = new Date(h.date);
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
 
        let isRegular = Array.isArray(h.types) ? h.types.includes('Public') : (h.type === 'Public');
        if (/eid/i.test(holidayName)) {

          isRegular = true;
        }
        mapped[`${mm}-${dd}`] = {
          name: holidayName,
          type: isRegular ? 'Regular Holiday' : 'Special Non-Working Holiday'
        };
      });

      Object.keys(mapped).forEach((key) => {
        const n = mapped[key]?.name || '';
        if (/maundy\s+thursday/i.test(n) || /good\s+friday/i.test(n) || /black\s+saturday|holy\s+saturday/i.test(n)) {
          delete mapped[key];
        }
      });

      const easterSunday = (() => {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        return new Date(year, month - 1, day);
      })();
      const addOrOverride = (dateObj, name, type) => {
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        mapped[`${mm}-${dd}`] = { name, type };
      };
      const maundyThursday = new Date(easterSunday); maundyThursday.setDate(easterSunday.getDate() - 3);
      const goodFriday = new Date(easterSunday); goodFriday.setDate(easterSunday.getDate() - 2);
      const holySaturday = new Date(easterSunday); holySaturday.setDate(easterSunday.getDate() - 1);
      addOrOverride(maundyThursday, 'Maundy Thursday', 'Regular Holiday');
      addOrOverride(goodFriday, 'Good Friday', 'Regular Holiday');
      addOrOverride(holySaturday, 'Black Saturday (Holy Saturday)', 'Special Non-Working Holiday');
      setHolidaysByYear((prev) => ({ ...prev, [yearKey]: mapped }));
    } catch (e) {
      // Fallback to fixed-date holidays for the year
      const fallback = { ...getFallbackFixedDateHolidays(year) };
      const easterSunday = (() => {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        return new Date(year, month - 1, day);
      })();
      const toKey = (d) => `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const maundyThursday = new Date(easterSunday); maundyThursday.setDate(easterSunday.getDate() - 3);
      const goodFriday = new Date(easterSunday); goodFriday.setDate(easterSunday.getDate() - 2);
      const holySaturday = new Date(easterSunday); holySaturday.setDate(easterSunday.getDate() - 1);
      fallback[toKey(maundyThursday)] = { name: 'Maundy Thursday', type: 'Regular Holiday' };
      fallback[toKey(goodFriday)] = { name: 'Good Friday', type: 'Regular Holiday' };
      fallback[toKey(holySaturday)] = { name: 'Black Saturday (Holy Saturday)', type: 'Special Non-Working Holiday' };
      setHolidaysByYear((prev) => ({ ...prev, [String(year)]: fallback }));
    } finally {
      setLoadingYear(null);
    }
  };


  useEffect(() => {
    const y = currentDate.getFullYear();
    ensureYearHolidaysLoaded(y);
  }, [currentDate]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const isHoliday = (date) => {
    const year = date.getFullYear().toString();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${month}-${day}`;
    return holidaysByYear[year]?.[dateKey];
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const getHolidayTypeColor = (type) => {
    if (type === 'Regular Holiday') return 'bg-red-500 text-white';
    if (type === 'Special Non-Working Holiday') return 'bg-orange-500 text-white';
    return 'bg-blue-500 text-white';
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const renderCalendarDays = () => {
    const days = [];
    
 
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const holiday = isHoliday(date);
      
      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`
            h-10 flex items-center justify-center text-sm cursor-pointer transition-colors relative
            ${isToday(date) ? 'bg-[#8b1e3f] text-white rounded-full font-semibold' : ''}
            ${isSelected(date) ? 'ring-2 ring-[#8b1e3f] ring-offset-2' : ''}
            ${holiday ? 'font-semibold' : ''}
            hover:bg-gray-100
          `}
        >
          {day}
          {holiday && (
            <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${getHolidayTypeColor(holiday.type)}`}></div>
          )}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-[#8b1e3f]/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#8b1e3f] flex items-center gap-2">
          <FiCalendar className="w-5 h-5" />
           Calendar
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiChevronDown className="w-4 h-4 transform rotate-90" />
          </button>
          <span className="font-semibold text-gray-700 min-w-[120px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiChevronDown className="w-4 h-4 transform -rotate-90" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="h-10 flex items-center justify-center text-xs font-semibold text-gray-500">
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>

      {/* Holiday Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Regular Holiday</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span>Special Non-Working Holiday</span>
        </div>
      </div>

      {/* Selected Date Holiday Info */}
      {selectedDate && isHoliday(selectedDate) && (
        <div className="mt-4 p-3 bg-[#8b1e3f]/10 rounded-lg border border-[#8b1e3f]/20">
          <div className="font-semibold text-[#8b1e3f]">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="text-gray-700 mt-1">
            {isHoliday(selectedDate).name}
          </div>
          <div className={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${getHolidayTypeColor(isHoliday(selectedDate).type)}`}>
            {isHoliday(selectedDate).type}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhilippineHolidaysCalendar;

import { useState, Fragment, useEffect } from 'react';
import { Popover, Transition, Portal } from '@headlessui/react';

interface ModernDatePickerProps {
    value: string;
    onChange: (date: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    required?: boolean;
    id?: string;
}

export default function ModernDatePicker({
    value,
    onChange,
    label,
    placeholder = 'Pilih tanggal...',
    className = '',
    required = false,
    id
}: ModernDatePickerProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
    const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');
    const [viewDate, setViewDate] = useState(new Date());

    useEffect(() => {
        if (value) {
            const date = new Date(value);
            setSelectedDate(date);
            setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
        } else {
            setSelectedDate(null);
        }
    }, [value]);

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
    };

    const formatDate = (date: Date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    const formatDisplayDate = (date: Date | null) => {
        if (!date) return '';
        const d = date.getDate();
        const m = months[date.getMonth()];
        const y = date.getFullYear();
        return `${d} ${m} ${y}`;
    };

    const handleDateSelect = (day: number, close: () => void) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        setSelectedDate(newDate);
        onChange(formatDate(newDate));
        close();
    };

    const handleMonthSelect = (month: number) => {
        setViewDate(new Date(viewDate.getFullYear(), month, 1));
        setViewMode('days');
    };

    const handleYearSelect = (year: number) => {
        setViewDate(new Date(year, viewDate.getMonth(), 1));
        setViewMode('days');
    };

    const prevMonth = () => {
        if (viewMode === 'days') {
            setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
        } else if (viewMode === 'years') {
            setViewDate(new Date(viewDate.getFullYear() - 12, viewDate.getMonth(), 1));
        } else if (viewMode === 'months') {
            setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1));
        }
    };

    const nextMonth = () => {
        if (viewMode === 'days') {
            setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
        } else if (viewMode === 'years') {
            setViewDate(new Date(viewDate.getFullYear() + 12, viewDate.getMonth(), 1));
        } else if (viewMode === 'months') {
            setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1));
        }
    };

    const renderCalendar = (close: () => void) => {
        const daysInMonth = getDaysInMonth(viewDate.getMonth(), viewDate.getFullYear());
        const firstDay = getFirstDayOfMonth(viewDate.getMonth(), viewDate.getFullYear());
        const daysArr = [];

        // Padding for first day
        for (let i = 0; i < firstDay; i++) {
            daysArr.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dateObj = new Date(viewDate.getFullYear(), viewDate.getMonth(), i);
            const isToday = new Date().toDateString() === dateObj.toDateString();
            const isSelected = selectedDate?.toDateString() === dateObj.toDateString();

            daysArr.push(
                <button
                    key={i}
                    type="button"
                    onClick={() => handleDateSelect(i, close)}
                    className={`h-10 w-10 rounded-xl text-sm font-semibold transition-all flex items-center justify-center
                        ${isSelected ? 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-lg shadow-indigo-200' : 
                          isToday ? 'text-indigo-600 bg-indigo-50 border border-indigo-100' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    {i}
                </button>
            );
        }

        return daysArr;
    };

    const renderMonths = () => {
        return months.map((month, index) => {
            const isSelected = viewDate.getMonth() === index;
            return (
                <button
                    key={month}
                    type="button"
                    onClick={() => handleMonthSelect(index)}
                    className={`h-12 rounded-xl text-xs font-bold transition-all
                        ${isSelected ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    {month}
                </button>
            );
        });
    };

    const renderYears = () => {
        const currentYear = viewDate.getFullYear();
        const years = [];
        for (let i = currentYear - 5; i <= currentYear + 6; i++) {
            years.push(i);
        }
        return years.map((year) => {
            const isSelected = currentYear === year;
            return (
                <button
                    key={year}
                    type="button"
                    onClick={() => handleYearSelect(year)}
                    className={`h-12 rounded-xl text-xs font-bold transition-all
                        ${isSelected ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    {year}
                </button>
            );
        });
    };

    return (
        <div className={`relative ${className}`}>
            <Popover className="relative">
                {({ open, close }) => (
                    <>
                        <Popover.Button
                            id={id}
                            className={`w-full flex items-center justify-between border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md py-2 px-3 bg-white shadow-sm transition-all text-left
                                ${open ? 'ring-1 ring-indigo-500 border-transparent shadow-md' : 'border'}`}
                        >
                            <span className={`text-sm ${selectedDate ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                                {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${open ? 'text-indigo-600' : 'text-gray-400'}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                            </svg>
                        </Popover.Button>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1 scale-95"
                            enterTo="opacity-100 translate-y-0 scale-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0 scale-100"
                            leaveTo="opacity-0 translate-y-1 scale-95"
                        >
                            <Portal>
                                <Popover.Panel 
                                    anchor="bottom start"
                                    className="z-[9999] mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-xl [--anchor-gap:8px]"
                                >
                                    <div className="p-5">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex gap-1">
                                            <button 
                                                type="button"
                                                onClick={() => setViewMode(viewMode === 'months' ? 'days' : 'months')}
                                                className={`px-2 py-1 rounded-lg transition-colors font-black tracking-tight
                                                    ${viewMode === 'months' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-900'}`}
                                            >
                                                {months[viewDate.getMonth()]}
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setViewMode(viewMode === 'years' ? 'days' : 'years')}
                                                className={`px-2 py-1 rounded-lg transition-colors font-medium
                                                    ${viewMode === 'years' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-400'}`}
                                            >
                                                {viewDate.getFullYear()}
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                type="button"
                                                onClick={prevMonth}
                                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                                </svg>
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={nextMonth}
                                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {viewMode === 'days' ? (
                                        <>
                                            {/* Days Label */}
                                            <div className="grid grid-cols-7 mb-2">
                                                {days.map(day => (
                                                    <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Calendar Grid */}
                                            <div className="grid grid-cols-7 gap-1">
                                                {renderCalendar(close)}
                                            </div>
                                        </>
                                    ) : viewMode === 'months' ? (
                                        <div className="grid grid-cols-3 gap-2">
                                            {renderMonths()}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-3 gap-2">
                                            {renderYears()}
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                const today = new Date();
                                                setSelectedDate(today);
                                                setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
                                                setViewMode('days');
                                                onChange(formatDate(today));
                                                close();
                                            }}
                                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                                        >
                                            Hari Ini
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                setSelectedDate(null);
                                                onChange('');
                                                setViewMode('days');
                                                close();
                                            }}
                                            className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                                </Popover.Panel>
                            </Portal>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    );
}

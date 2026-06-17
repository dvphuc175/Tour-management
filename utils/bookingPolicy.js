const MIN_BOOKING_LEAD_DAYS = 3;
const BOOKING_TIME_ZONE = 'Asia/Ho_Chi_Minh';
const BOOKING_LEAD_TIME_MESSAGE = 'Vui lòng chọn lịch trình cách ngày hiện tại ít nhất 3 ngày.';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: BOOKING_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

function getDateKeyInBookingTimezone(date = new Date()) {
  const parts = dateFormatter.formatToParts(date).reduce((acc, part) => {
    if (part.type !== 'literal') acc[part.type] = part.value;
    return acc;
  }, {});

  return `${parts.year}-${parts.month}-${parts.day}`;
}

function toDateKey(value) {
  if (!value) return '';
  if (value instanceof Date) return getDateKeyInBookingTimezone(value);
  return String(value).slice(0, 10);
}

function addDaysToDateKey(dateKey, days) {
  const [year, month, day] = dateKey.split('-').map(Number);
  if (!year || !month || !day) return '';

  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

function getMinBookableDateKey(baseDate = new Date()) {
  return addDaysToDateKey(
    getDateKeyInBookingTimezone(baseDate),
    MIN_BOOKING_LEAD_DAYS
  );
}

function isBookableStartDate(startDate, baseDate = new Date()) {
  const startDateKey = toDateKey(startDate);
  return Boolean(startDateKey) && startDateKey >= getMinBookableDateKey(baseDate);
}

module.exports = {
  BOOKING_LEAD_TIME_MESSAGE,
  MIN_BOOKING_LEAD_DAYS,
  getMinBookableDateKey,
  isBookableStartDate,
  toDateKey
};

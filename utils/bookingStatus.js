const BOOKING_STATUS = Object.freeze({
  pending: {
    label: 'Chờ xác nhận',
    badge: 'pending'
  },
  confirmed: {
    label: 'Đã xác nhận',
    badge: 'confirmed'
  },
  cancelled: {
    label: 'Đã hủy',
    badge: 'cancelled'
  },
  completed: {
    label: 'Hoàn thành',
    badge: 'completed'
  }
});

const PAYMENT_STATUS = Object.freeze({
  pending: {
    label: 'Chưa thanh toán',
    badge: 'pending'
  },
  success: {
    label: 'Đã thanh toán',
    badge: 'success'
  },
  failed: {
    label: 'Thất bại',
    badge: 'failed'
  },
  refunded: {
    label: 'Đã hoàn tiền',
    badge: 'refunded'
  }
});

const PAYMENT_METHOD = Object.freeze({
  vnpay: 'VNPay',
  cash: 'Tiền mặt'
});

const bookingStatusKeys = Object.freeze(Object.keys(BOOKING_STATUS));
const paymentStatusKeys = Object.freeze(Object.keys(PAYMENT_STATUS));

function getMeta(map, value) {
  return map[value] || {
    label: value || 'Không rõ',
    badge: 'unknown'
  };
}

function classNames(...values) {
  return values.filter(Boolean).join(' ');
}

function getBookingStatus(status) {
  return getMeta(BOOKING_STATUS, status);
}

function getPaymentStatus(status) {
  return getMeta(PAYMENT_STATUS, status);
}

function bookingStatusLabel(status) {
  return getBookingStatus(status).label;
}

function paymentStatusLabel(status) {
  return getPaymentStatus(status).label;
}

function bookingBadgeClass(status, extraClass = '') {
  return classNames('badge', `badge--${getBookingStatus(status).badge}`, extraClass);
}

function paymentBadgeClass(status, extraClass = '') {
  return classNames('badge', `badge--${getPaymentStatus(status).badge}`, extraClass);
}

function paymentMethodLabel(method) {
  return PAYMENT_METHOD[method] || method || 'Không rõ';
}

function canUserCancelBooking(booking) {
  return booking?.status === 'pending';
}

function canRetryVnpayPayment(booking) {
  return (
    booking?.status === 'pending' &&
    booking.payment_method === 'vnpay' &&
    ['pending', 'failed'].includes(booking.payment_status)
  );
}

function canShowCancelSupport(booking) {
  return booking?.status === 'confirmed';
}

function canAdminConfirmCashBooking(booking) {
  return booking?.status === 'pending' && booking.payment_method === 'cash';
}

function isAdminAwaitingVnpayPayment(booking) {
  return booking?.status === 'pending' && booking.payment_method === 'vnpay';
}

function canAdminCompleteBooking(booking) {
  return booking?.status === 'confirmed';
}

function canAdminCancelBooking(booking) {
  return booking && !['cancelled', 'completed'].includes(booking.status);
}

function isCashPendingBooking(booking) {
  return booking?.status === 'pending' && booking.payment_method === 'cash';
}

function isPaymentSuccess(booking) {
  return booking?.payment_status === 'success';
}

function clientBookingNotice(booking) {
  if (isCashPendingBooking(booking)) {
    return 'Chờ admin xác nhận sau khi nhận tiền mặt. Đơn sẽ tự hủy nếu quá hạn thanh toán.';
  }

  if (canRetryVnpayPayment(booking)) {
    return booking.payment_status === 'failed'
      ? 'Giao dịch VNPay chưa thành công. Bạn có thể thanh toán lại khi đơn còn hiệu lực.'
      : 'Đơn sẽ tự hủy nếu chưa thanh toán VNPay trong 15 phút.';
  }

  if (booking?.payment_status === 'refunded') {
    return 'Đơn đã được đánh dấu hoàn tiền. Vui lòng kiểm tra xử lý hoàn tiền thực tế.';
  }

  return '';
}

function decorateBooking(booking) {
  if (!booking) return booking;

  const bookingMeta = getBookingStatus(booking.status);
  const paymentMeta = getPaymentStatus(booking.payment_status);

  return {
    ...booking,
    ui: {
      bookingStatusLabel: bookingMeta.label,
      bookingStatusBadge: bookingMeta.badge,
      paymentStatusLabel: paymentMeta.label,
      paymentStatusBadge: paymentMeta.badge,
      paymentMethodLabel: paymentMethodLabel(booking.payment_method),
      canUserCancel: canUserCancelBooking(booking),
      canRetryVnpay: canRetryVnpayPayment(booking),
      canShowCancelSupport: canShowCancelSupport(booking),
      canAdminConfirmCash: canAdminConfirmCashBooking(booking),
      isAdminAwaitingVnpayPayment: isAdminAwaitingVnpayPayment(booking),
      canAdminComplete: canAdminCompleteBooking(booking),
      canAdminCancel: canAdminCancelBooking(booking),
      notice: clientBookingNotice(booking)
    }
  };
}

module.exports = {
  bookingStatusKeys,
  paymentStatusKeys,
  getBookingStatus,
  getPaymentStatus,
  bookingStatusLabel,
  paymentStatusLabel,
  bookingBadgeClass,
  paymentBadgeClass,
  paymentMethodLabel,
  canUserCancelBooking,
  canRetryVnpayPayment,
  canShowCancelSupport,
  canAdminConfirmCashBooking,
  isAdminAwaitingVnpayPayment,
  canAdminCompleteBooking,
  canAdminCancelBooking,
  isCashPendingBooking,
  isPaymentSuccess,
  clientBookingNotice,
  decorateBooking
};

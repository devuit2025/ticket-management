export default {
    common: {
        welcome: 'Chào mừng',
        logout: 'Đăng xuất',
        language: 'Ngôn ngữ',
        backTo: 'Quay lại trang',

        required: 'là bắt buộc', // e.g., "Họ và tên là bắt buộc"
        min: 'phải có ít nhất {count} ký tự', // e.g., "Mật khẩu phải có ít nhất 6 ký tự"
        invalid: 'không hợp lệ', // e.g., "Email không hợp lệ"
        phoneDigits: 'phải có 10–15 chữ số', // phone validation
        passwordMismatch: 'không khớp với mật khẩu', // confirm password mismatch
    },
    login: {
        title: 'Đăng nhập', // Main screen title
        subtitle: 'Đăng nhập để tiếp tục', // Short description under the title
        email: 'Email', // Label for email input
        emailPlaceholder: 'Nhập email của bạn', // Placeholder inside email input
        password: 'Mật khẩu', // Label for password input
        passwordPlaceholder: 'Nhập mật khẩu của bạn', // Placeholder for password input
        signIn: 'Đăng nhập', // Submit button text
        noAccount: 'Chưa có tài khoản?', // Footer text
        signUp: 'Đăng ký', // Link to sign-up page
        forgotPassword: 'Quên mật khẩu?', // Optional link for password reset

        // Phone login
        phoneTitle: 'Đăng nhập bằng số điện thoại',
        phone: 'Số điện thoại',
        phonePlaceholder: 'Nhập số điện thoại của bạn',
        sendOtp: 'Gửi mã OTP',

        // OTP verification
        verifyOtp: 'Xác thực OTP',
        otp: 'Mã OTP',
        otpPlaceholder: 'Nhập mã gồm 6 chữ số',
        verify: 'Xác nhận',
        otpSent: 'Chúng tôi đã gửi mã OTP đến số điện thoại của bạn',
        resendOtp: 'Gửi lại mã OTP',
        changePhone: 'Đổi số điện thoại',
    },
    register: {
        title: 'Đăng ký', // Screen title
        subtitle: 'Tạo tài khoản để bắt đầu', // Subtitle under title
        fullName: 'Họ và tên', // Label for full name input
        fullNamePlaceholder: 'Nhập họ và tên của bạn', // Placeholder inside full name input
        email: 'Email', // Label for email input
        emailPlaceholder: 'Nhập email của bạn', // Placeholder inside email input
        phone: 'Số điện thoại', // Label for phone input
        phonePlaceholder: 'Nhập số điện thoại của bạn', // Placeholder inside phone input
        password: 'Mật khẩu', // Label for password input
        passwordPlaceholder: 'Nhập mật khẩu của bạn', // Placeholder inside password input
        confirmPassword: 'Xác nhận mật khẩu', // Label for confirm password input
        confirmPasswordPlaceholder: 'Nhập lại mật khẩu', // Placeholder for confirm password
        button: 'Đăng ký', // Submit button text
        haveAccount: 'Bạn đã có tài khoản?', // Footer text
        login: 'Đăng nhập', // Link to login page
        socialLogin: 'Đăng ký bằng mạng xã hội', // Optional: social login text
    },
    forgotPassword: {
        title: 'Quên mật khẩu', // Screen title
        subtitle: 'Nhập email hoặc số điện thoại để đặt lại mật khẩu', // Instruction text
        emailOrPhone: 'Email hoặc Số điện thoại', // Label for input
        emailOrPhonePlaceholder: 'Nhập email hoặc số điện thoại của bạn', // Placeholder
        button: 'Gửi OTP', // Submit button
        rememberPassword: 'Bạn đã nhớ mật khẩu?', // Footer text
        login: 'Đăng nhập', // Link to login screen
    },

    booking: {
        title: 'Đặt vé',
        ticket: 'Vé',
        recentSearch: 'Tìm kiếm gần đây',
        description: 'Vui lòng điền thông tin đặt vé của bạn bên dưới.',
        passengerInfo: 'Thông tin hành khách',
        paymentMethod: 'Phương thức thanh toán',
        confirmButton: 'Xác nhận đặt vé',
        successMessage: 'Đặt vé thành công! Cảm ơn bạn đã sử dụng dịch vụ.',

        // Booking form fields
        searchBus: 'Tìm kiếm tuyến',
        numberOfTickets: 'Số vé',
        numberOfTicketsPlaceholder: 'Chọn số vé',
        fullName: 'Họ và tên',
        fullNamePlaceholder: 'Nhập họ và tên',
        phoneNumber: 'Số điện thoại',
        phoneNumberPlaceholder: 'Nhập số điện thoại',
        email: 'Email',
        emailPlaceholder: 'Nhập email',
        pickupLocation: 'Điểm đón',
        pickupLocationPlaceholder: 'Chọn điểm đón',
        dropoffLocation: 'Điểm đến',
        dropoffLocationPlaceholder: 'Chọn điểm đến',
        travelDate: 'Ngày đi',
        travelDatePlaceholder: 'Chọn ngày đi',
        seatPreference: 'Chọn ghế',
        seatPreferencePlaceholder: 'Chọn loại ghế',

        // Trip type
        tripType: 'Loại chuyến đi',
        oneWay: 'Một chiều',
        roundTrip: 'Khứ hồi',

        // Review booking screen
        reviewBooking: 'Xem lại đặt vé',
        customerInformation: 'Thông tin khách hàng',
        destinationInformation: 'Thông tin điểm đến',
        seatInformation: 'Thông tin ghế',
        pickupDropoffInformation: 'Điểm đón và điểm đến',
        paymentButton: 'Thanh toán',
        bookingSuccess: 'Đặt vé thành công',
        downloadTicket: 'Tải vé về',
        backToHome: 'Quay về trang chủ',
        bookingSuccessMessage: 'Cảm ơn bạn đã sử dụng dịch vụ. Vé của bạn đã được đặt thành công!',
    },
};

import { index, layout, route } from '@react-router/dev/routes'
var stdin_default = [
  // Public marketing site
  layout('layouts/main-layout.jsx', [
    index('routes/home.jsx'),
    route('discover', 'routes/discover.jsx'),
    route('become-mentor', 'routes/become-mentor.jsx'),
    route('mentor-profile/:id', 'routes/mentor-profile.jsx'),
    route('payment/success', 'routes/payment/success.jsx'),
    route('payment/cancel', 'routes/payment/cancel.jsx'),
    route('notifications', 'routes/notifications.jsx')
  ]),
  // User dashboard — /user/*
  route('user', 'routes/user-role-layout.jsx', [
    layout('layouts/user-layout.jsx', [
      index('routes/user/dashboard.jsx'),
      route('bookings', 'routes/user/bookings.jsx'),
      route('payments', 'routes/user/payments.jsx'),
      route('profile', 'routes/user/profile.jsx')
    ])
  ]),
  // Mentor dashboard — /mentor/*
  route('mentor', 'routes/mentor-role-layout.jsx', [
    layout('layouts/mentor-layout.jsx', [
      index('routes/mentor/dashboard.jsx'),
      route('schedule', 'routes/mentor/schedule.jsx'),
      route('students', 'routes/mentor/students.jsx'),
      route('earnings', 'routes/mentor/earnings.jsx'),
      route('profile', 'routes/mentor/profile.jsx'),
      route('verification', 'routes/mentor/verification.jsx')
    ])
  ]),
  // Admin dashboard — /admin/*
  route('admin', 'routes/admin-role-layout.jsx', [
    layout('layouts/admin-layout.jsx', [
      index('routes/admin/dashboard.jsx'),
      route('users', 'routes/admin/users.jsx'),
      route('mentors', 'routes/admin/mentors.jsx'),
      route('bookings', 'routes/admin/bookings.jsx'),
      route('catalog', 'routes/admin/catalog.jsx'),
      route('reports', 'routes/admin/reports.jsx'),
      route('settings', 'routes/admin/settings.jsx')
    ])
  ]),
  // Auth & template routes
  layout('routes/guest-layout.jsx', [route('login', 'routes/login.jsx')]),
  route('forbidden', 'routes/forbidden.jsx')
]
export { stdin_default as default }

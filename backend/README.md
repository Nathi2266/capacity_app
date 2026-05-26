# Backend Structure

This app is designed for Base44 BaaS with no custom server.

## Entities

- `Employee` - `full_name`, `email`, `department`, `role`, `seniority`, `skills[]`, `availability_pct`, `status`
- `Project` - `name`, `client_name`, `status`, `priority`, `required_skills[]`, `delivery_phase`, `budget`, `capacity_demand_pct`
- `Allocation` - `employee_id`, `project_id`, `allocation_pct`, `role_on_project`, `status`
- `Notification` - `title`, `message`, `type`, `severity`, `read`
- `User` - built-in auth profile with `email`, `full_name`, `role`

## Access pattern

Use the Base44 SDK directly from the frontend:

- `base44.entities.Employee.list()`
- `base44.entities.Allocation.filter({ status: 'Active' })`
- `base44.entities.Notification.update(id, { read: true })`

## Auth

Auth is handled by Base44 using JWT sessions, Google OAuth, email/password, and OTP verification.

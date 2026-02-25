# Supabase Email Templates

Paste these into **Supabase Dashboard > Authentication > Email Templates**.

## Subject Lines

| Template | Subject Line |
|----------|-------------|
| Confirm Signup | War of 1812 — Confirm Your Teacher Account |
| Magic Link | War of 1812 — Sign In to Teacher Dashboard |
| Reset Password | War of 1812 — Reset Your Password |
| Change Email | War of 1812 — Confirm Email Change |

## Setup

1. Go to Supabase Dashboard > Authentication > Email Templates
2. For each template type, replace the **Subject** with the subject line above
3. Replace the **Body** with the contents of the corresponding `.html` file
4. Click Save

## Rate Limits

Also update **Authentication > Rate Limits**:
- Increase "Rate limit for sending emails" to at least 10/hour for classroom use

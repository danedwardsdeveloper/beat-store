# /auth

- [x] `/sign-in`
- [x] `/create-account`
- [x] `/validate-token`
- [x] `/delete-account`
- [ ] `/confirm-email`
- [ ] `/reset-password`
- [ ] `/sign-out`

# /admin

## Upload a beat

- [ ] Create SafePublicBeat interface

- [x] `/admin/beats` POST (Creates a new Beat document, returns the beat id)
- [x] `/admin/beats` GET Published, scheduled and draft beats
- [ ] `/admin/beats/{beatId}` PATCH (Update metadata, price etc.)
- [ ] `/admin/beats/{beatId}` DELETE
- [ ] `/admin/beats/{beatId}/artwork` POST
- [ ] `/admin/beats/{beatId}/tagged-mp3` POST
- [ ] `/admin/beats/{beatId}/untagged-mp3` POST
- [ ] `/admin/beats/{beatId}/wav` POST
- [ ] `/admin/beats/{beatId}/stems` POST

## Retrieve beats

- [ ] `/beats` GET all published beats
- [ ] `/beats/{beatId}` GET - Public beat details for individual beat

## Update site settings

- [ ] `/update-settings` PATCH
- [ ] `/beats` PATCH (Update global pricing)
- [x] `/regenerate`

# E-Commerce routes

- [ ] create new order
- [ ] add beat to order
- [ ] `/orders/[userId]` get user's orders
- [ ] `/checkout` start Stripe checkout session
- [ ] `/webhook` add access to purchased items after checkout success
- [ ] `/error??` handle failed payments

# Site content

- [ ] License types
- [ ] Privacy policy
  - Log suspicious IP addresses with time frame

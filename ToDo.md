# Current task

Set up S3 and cloudfront so I can get this route working
`/admin/beats/{beatId}/media` POST
Then create some audio files to upload

# /auth

- [x] `/sign-in`
- [x] `/create-account`
- [x] `/validate-token`
- [x] `/delete-account`
- [ ] `/confirm-email`
- [ ] `/reset-password`
- [ ] `/sign-out`

## Admin beats

- [ ] Create SafePublicBeat interface
- [ ] Find solution for dynamic segment path type safety `/api/admin/beats/[beatId]`

- [x] `/admin/beats` POST (Creates a new Beat document, returns the beat id)
- [x] `/admin/beats` GET Published, scheduled and draft beats
- [x] `/admin/beats/{beatId}` PATCH (Update metadata, price etc.)
- [x] `/admin/beats/{beatId}` DELETE
- [ ] `/admin/beats/{beatId}/media` POST

## Signed-in beats

- Not sure of these paths yet
- [ ] `/user/beats/{beatId}` PATCH. Add favourite

## Signed-out beats (Public)

- [x] `/beats` GET all published beats
- [ ] `/beats/{beatId}` PATCH. Increment play count ?? Not sure this is public...?

## Update site settings

- [ ] `/update-settings` PATCH
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

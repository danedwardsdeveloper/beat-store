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

- [ ] `/beats/new` POST (Creates a new document, returns the beat id)
- [ ] `/beats/{beatId}` PATCH (Update metadata, price etc.)
- [ ] `/beats/{beatId}` DELETE
- [ ] `/beats/{beatId}/artwork` POST
- [ ] `/beats/{beatId}/tagged-mp3` POST
- [ ] `/beats/{beatId}/untagged-mp3` POST
- [ ] `/beats/{beatId}/wav` POST
- [ ] `/beats/{beatId}/stems` POST

## Get all beats

- [ ] `/beats` GET

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

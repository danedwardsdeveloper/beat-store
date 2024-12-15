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
- [ ] `/beats` GET (All beats)
- [ ] `/beats` PATCH (Update global pricing)

## Update site settings

- [ ] `/update-settings` PATCH
- [x] `/regenerate`

# Site content

- [ ] Privacy policy
  - Log suspicious IP addresses with time frame

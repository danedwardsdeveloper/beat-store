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

- [ ] `/beats/create-new` POST (Returns beat id)
- [ ] `/beats/{beatId}` PATCH (Update metadata, price etc.)
- [ ] `/beats/{beatId}/artwork` POST
- [ ] `/beats/{beatId}/tagged-mp3` POST
- [ ] `/beats/{beatId}/untagged-mp3` POST
- [ ] `/beats/{beatId}/wav` POST
- [ ] `/beats/{beatId}/stems` POST

## Update site settings

- [ ] `/update-settings`
- [ ] `api/admin/trigger-regeneration` (called from the client with paths to regenerate)
- [ ] `api/regenerate`
  - called from the server with a secret key in the URL
  - Receives the paths to regenerate
  - Checks for additional paths to generate from the SiteSettings database

# Site content

- [ ] Privacy policy
  - Log suspicious IP addresses with time frame

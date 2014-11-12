With social login (and with users having potentially multiple email addresses and/or phone numbers), it's likely one or more user merges will be necessary. The "unique" database fields that should be used to initiate a merge are:
1. email
2. phone number
Id fields are obviously unique too, but there should never be two of the same id (either from a social account such as facebook or twitter or within our own database) for more than one user so this should never happen; users should ALWAYS have different ids.

So, anytime that a unique field is saved (either created or updated), a check needs to be made for an already EXISTING same value for this field and, if found, a merge needs to be made (OR the operation must be rejected because another user already exists with this unique information).
So anytime an email address or phone number is created (i.e. on sign up) or updated (i.e. on user (profile / account) update), these values must be first validated and then either merged or rejected if a same value already exists.

Common (but not exhaustive) places this could happen (where uniqueness needs to be checked for and either validated/rejected and/or merges need to be checked for and performed)
1. user sign up (on our site) - NOTE: this should NOT be a merge but rather should just be a REJECTION (don't allow signing up with already existing email/phone - just have them login instead!)
2. social login/sign up
	1. facebook
	2. [twitter is NOT necessary to check because as of now, Twitter does not supply email or phone numbers]
3. user profile/account update (i.e. changing the user's email(s) or phone number(s)). Note that we support multiple emails and phone numbers so ALL must be checked.

A (non-exhaustive) list of (backend) functions that need to be checked/validated and could lead to merges:
1. Auth
	1. Auth.create [reject]
	2. Auth.createGuest [typically just a reject]
	3. Auth.socialLogin [merge]
	4. Auth.userImport [merge]
2. User
	1. User.update [reject - would only be able to merge after verifying the new email; otherwise people could just maliciously merge into anyone else's account by typing any email that is already in use to takeover/merge into that account]
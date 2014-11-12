# Using Twitter

## Twitter Login
- for some reason you need to FIRST make a call to get a request token and THEN link the the user to the twitter page to login..
	- the redirect / callback URL can theoretically be dynamically set during this step but otherwise it just uses the pre-defined default one, which is annoying..
- https://dev.twitter.com/docs/auth/sign-twitter
	- make sure the "allow this application to be used to Sign in with Twitter" button is checked in your application settings on apps.twitter.com
	- note the difference between oauth/authenticate (auto login) and oauth/authorize (allows changing users). The "force_login" URL parameter theoretically can be used for this too but doesn't seem to work?
		- https://dev.twitter.com/docs/api/1/get/oauth/authenticate
		- https://dev.twitter.com/docs/api/1/get/oauth/authorize
- note that Twitter does NOT give email address: https://dev.twitter.com/discussions/4019


## Twitter API Calls
@todo
	
	
## Share (Tweet)
- make sure you've set your application on dev.twitter.com to have read and WRITE permissions in the application permissions / settings
- with media (picture(s))
	- https://dev.twitter.com/docs/api/1.1/post/statuses/update_with_media
		- see https://dev.twitter.com/docs/api/1.1/get/help/configuration for limits, i.e.:
			- 1 'max_media_per_upload'
				- only can upload 1 picture
			- 23 'characters_reserved_per_media'
				- your tweet / status must be shorter accordingly
			- 3145728 'photo_size_limit'
				- around 3MB photo limit
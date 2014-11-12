Using Facebook


# Facebook Login
Two ways to do this:
1. with an SDK (i.e. javascript SDK)
2. manually (this is the only way to make it work on iOS Chrome)
	1. https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/

NOTE: you must make sure your app is "live" and available to the public in the "status & review" section of your app settings on developers.facebook.com otherwise you'll get sporadic "App not setup" errors (especially in Firefox)...
	- http://stackoverflow.com/questions/21329250/the-developers-of-this-app-have-not-set-up-this-app-properly-for-facebook-login

	
# Facebook API Calls
The main (only?) way to do this is the Graph API. There's 3 ways to do this:
1. FB.api IF have the Javascript SDK included
	1. BUT it's HUGE (160k minified) AND it doesn't work on Chrome iOS so don't use it unless there's no other way
		1. http://stackoverflow.com/questions/16843116/facebook-oauth-unsupported-in-chrome-on-ios
2. server side HTTP request
	1. the best way - this is how we use it after we do a manual facebook login flow.
		1. https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/
3. frontend HTTP request (CORS supported or will this give cross-domain permissions / security issues? Do we need to ONLY send auth token or do we need to send any secret info such as facebook app secret that should NOT be sent / stored / used client side?)
	1. [haven't tried this, just use backend / server-side instead]
	
	
# Share
- https://developers.facebook.com/docs/web/share
	- There are 3 ways to share
		- share button plugin
		- share dialog
			- https://developers.facebook.com/docs/sharing/reference/share-dialog
		- graph (backend) API
			- me/feed OR [user_id]/feed
			- me/[action]
	- The options go from simplest to most powerful (and most complicated) - the share button and share dialog do not require facebook login and are quicker to implement BUT they're frontend and require Facebook SDKs and pop-ups/redirects (so may not work well in apps - there's separate iOS and Android SDKs for native apps but those do not work for hybrid HTML5 apps). The graph (backend) API is the only way to do custom stories and the only sure way to work 100% cross platform (including in wrapped apps) since it's 100% backend calls. It's also fully customizable on the frontend / design-wise since it's all backend.
	- For the graph API, there's 2 main ways to share - with an object (an 'action') or the standard user/feed. Stick with user/feed unless you really need an action because using objects is much more complicated and requires Facebook APPROVAL for each open graph action you want to use...
- NOTE: when sharing, you can set the default share permissions reach (i.e. "public", "friends", "only me") in the "app permissions" on developers.facebook.com. It's pretty buried and hard to find but currently it's in App Details --> App Center Listed Platforms --> Configure App Center Permissions.


# Friends
- in v2.0 of the Graph API (April 2014), friends no longer returns ALL friends, just friends who use the app. So the only way to get all friends / a friend count is the soon to be deprecated FQL. There's a "taggable friends" and "invitable friends" endpoint that could also work but I don't think this is what it's for and it requires "Facebook Review" to use this..
	- https://graph.facebook.com/fql?q=SELECT%20friend_count%20FROM%20user%20WHERE%20uid%20=%20273103345
		- replace "273103345" with the user id you want to lookup
	- http://stackoverflow.com/questions/23417356/facebook-graph-api-v2-0-me-friends-returns-empty-or-only-friends-who-also-use-m
	- https://developers.facebook.com/docs/apps/upgrading#upgrading_v2_0_user_ids
	- https://developers.facebook.com/docs/graph-api/reference/v2.0/user/taggable_friends
	- https://developers.facebook.com/docs/graph-api/reference/v2.0/user/invitable_friends

	
## Graph API

### Using user/feed
Fairly straightforward: https://developers.facebook.com/docs/graph-api/reference/v2.0/user/feed#publish
Make sure you ask for 'publish_actions' as a permission.

### Using ACTIONS & OBJECTS
- https://developers.facebook.com/docs/opengraph/
	- https://developers.facebook.com/docs/opengraph/using-objects
	- default objects / object types: https://developers.facebook.com/docs/reference/opengraph/
	- https://developers.facebook.com/docs/opengraph/using-actions/v2.0#publish
- https://developers.facebook.com/docs/facebook-login/access-tokens/
	- use `[app_id]|[app_secret]` in place of app access token
- https://developers.facebook.com/docs/opengraph/submission-process/
	
Sharing on open graph with OBJECT and ACTION requires 2 steps:
1. create object (this is where your image goes / is pulled from)
	1. self-hosted: can be a page on your website BUT for single page apps may be easier to create an object on Facebook
	2. facebook hosted: create object on Facebook
2. publish story referencing object

#### Notes / Gotchas
- You must "enable" the actions first on developers.facebook.com in your app dashboard for users to use them AND get them APPROVED by facebook..
- The documentation has an example of a publish call with an object type as the key but it SHOULD be (and only works with) 'object' as the key. I.e. 'book=bookObjectId' does NOT work whereas 'object=bookObjectId' does.
	- http://stackoverflow.com/questions/12607458/facebook-open-graph-did-not-specify-reference-object
	
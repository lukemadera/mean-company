Most users will be likely to access the same site from multiple different platforms (i.e. different browsers or multiple devices). This leads to a security and session question of how to handle the same user being logged in more than once. There are various ways to handle this, each with their own security and usability pros and cons:
1. only allow ONE session. Invalidate any existing sessions on new login. This is the most secure since if a user ever forgets to log out (i.e. on a public computer), the user can invalidate that session remotely simply by logging in again anywhere else. Basically only the most recent session is valid. The (big) downside is no multi-device support.
2. multiple (infinite) sessions. This is a bit less secure as it requires/gives more responsibility to the end user since a session will only be invalidated on log out (which will almost always only happen manually). But it means multiple browsers and devices can log in to the same account simultaneously. To add a bit more security, sessions could be auto-invalidated over time (i.e. after 30 days of not being accessed). This is similar to financial websites auto logging out due to inactivity of a few minutes or hours. But it requires tracking time of last action per session (to reset the countdown to invalidation for that session).

Technically, a session is handled in a few places and these need to sync up/match for proper authentication to work and the request to be valid:
1. the database
2. frontend cookie and/or localStorage (the session id and user id are sent back on each backend API request to authenticate)

## Tabs
Browser "tabs" present additional complexity. Most current sites persist the SAME session across multiple tabs so if the user opens the same site (or opens a link in a new tab), the same user is still logged in for that new tab (or tabs). This is almost always a good way to handle it. However, if a user has multiple DIFFERENT accounts (that would thus require different sessions), the user may want to log in to DIFFERENT accounts on different tabs. This "multiple session tab support" would not be supported and thus the user would only be allowed to be logged in to one account at a time. This situation could also arise if the user doesn't close tabs often and has an old session still open - if navigating back to that tab after logging in with a different account on a different tab, the old tab will still have an old (potentially now invalid) session.
This issue typically won't come up or will be "user expected" so shouldn't be a big deal and the benefits of staying logged in on opening new tabs seems to outweigh the costs. The key (but likely rare) situation where this could be an issue is if there is "guest access" or auto logging in, i.e. prior to a user signing up they get an invite and can log in by clicking that link. Since that user doesn't really have a log in, then if they get multiple invites representing DIFFERENT users (i.e. different contact methods - multiple email addresses or an email and a phone) then they can't "re log in" unless they re-click the invite link so logging them out of an old session and taking them to the login screen won't work since they don't (yet) have a log in. One solution is to require login / registration no matter what (or send the user a default password rather than or in addition to the auto login link in their invite) so 100% of users DO have a login. Otherwise, "tab sessions" would have to be supported to allow multiple different users to be logged in across different tabs simultaneously. This gets messy and requires cookies by tab rather than by browser and means storing more data on the browser, localStorage, cookies, etc. in addition to removing the ability for users to open a link in a new tab without some additional logic to track which session we're coming from and thus which session to auto login to for that new tab.
- with ONE session
	- (Re)logging in to one account/tab would invalidate (or log out) the user on the existing account and each time the user switched between tabs/accounts the user would have to re-log in.
- with multiple sessions
	- (Re)logging into one account/tab would mean that any other / old tabs would still work fine UNTIL a page refresh (in which case the cookies/localStorage would update to the most recent browser wide ones/user). Old tabs on refresh would then "switch" accounts to the most recent login. If on a restricted page that the most recent account does not have access to, they'll be redirected or get an "unauthorized" error message on refresh due to the "account swapping" that happened.
	
The current recommendation is thus to persist sessions across tabs (what seems to be the default behavior of browsers and most sites) and:
- ensure that 100% of users have a login, even if it's auto-generated for them on invites or for "guest access."
- always show the current logged in user (profile picture, name) so it's easy for the user to tell what happened and which account they're currently viewing the site as - that way if they are "auto swapped" to a more recent log in, they'll see that on old tabs and know what happened and that they need to log out / re log in if they still want to view the site/app as the old/other account.
A combination of the above should make everything workable and fairly straightforward, even if not "perfect". But it seems something must be sacrificed either way so this is the best case.
	
- levels of storing data (from longest / most persistent to least):
	- localStorage
		- expires / lost: if user clears localStorage
	- cookies
		- expires / lost: if user clears cookies
	- sessionStorage (generally not used since it doesn't persist but in this case may be exactly what we need!)
		- expires / lost: if close browser tab
	- javascript
		- expires / lost: any browser page refresh / reload (closing / re-opening browser, etc.)
	- url
		- expires / lost: any new url (that doesn't have the same URL params)
		
- sessions
	- cookies/localStorage: browsers don't seem to support tab specific cookies (or localStorage?) so data will be shared across all tabs by default
	- custom: can use anything (cookies/localStorage) IF store as an array of multiple session information per tab; would need to create a unique session id on first log in and then check that and load data accordingly
	- sessionStorage: may be PERFECT for this use case!?
	- save in javascript (won't work if user refreshes the page though? so not a good solution)
	- keep / pass through URL params to ALL pages to persist it
	
Eventually we'll need to get from URL params / whatever we use to the way the rest of the app/code works (i.e. sending back session information for backend calls) so the question is how and where/when to "bridge the gap". URL params and custom/array cookies/localStorage could work but sessionStorage seems perfectly suited and cleaner for this and sessionStorage seems to have as wide of support as localStorage since they're part of the same "HTML5 Storage" API.
http://www.w3schools.com/html/html5_webstorage.asp
http://www.gwtproject.org/doc/latest/DevGuideHtml5Storage.html

So while in general tabbed sessions seems to have more cons than pros (better to just do default brower sessions and just check/logout old tabs), to achieve tabbed sessions, we basically mimic on the frontend what we do to achieve multiple sessions on the backend: have an array of SEPARATE session data rather than just one. In practice this applies to two main places (since javascript and URL params are ALREADY unique to each tab) - localStorage and cookies.

For localStorage, we just abstract storage to a service and then have that service use sessionStorage instead of localStorage - that way it's tab specific and there's no cross-polluting of storage across tabs. Basically sessionStorage handles converting our storage to an array of multiple sessions for us. To survice through page reloads/refreshes/url changes (without passing URL params through everywhere), each page refresh/page init we first check sessionStorage to see if we already have some storage; if so we use that and get/set the session id and tell our storage service to use sessionStorage (instead of localStorage). Then all we need to do is set the sessionStorage the first time (i.e. with a URL param) and then from then one, we'll be using sessionStorage for the lifetime of the browser tab!

For cookies there's not a baked in alternative BUT there's also a lot less data to store (we're basically just storing user_id, sess_id and a few other one off things like redirect_url) - so we just mimic the backend array of sess_id and prefix all our cookies with the session id so there's one set of cookies per unique key (which we'll get from the URL/sessionStorage). So when working with any cookies, we first check if sessionStorage is set and if so, we set/get cookies for that particular session (with a unique session id prefix rather than the shared/default cookies that are the same across all tabs). This abstracts everything away and our cookie calls in our code can remain unchanged.

To get the sessionStorage unique key for this tab/session (for use with the cookie array), we use a URL parameter (or just create a random id) to set it at the start (i.e. if sessionStorage is empty, which it will always be on first opening of the browser tab and will never be once the tab has already been used, even across page refreshes).
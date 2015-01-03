
## pageObjects / modularizing tests

## injecting / accessing Angular modules (i.e. http service)


## promises (protractor.promise), nested promise calls / executeAsyncScript (see api-call.js) - http://stackoverflow.com/questions/21055400/how-to-create-and-manipulate-promises-in-protractor
	- "fulfill", not "resolve"

## setup / teardown (backend api calls / mock data)
	- unique namespaced database data (so multiple tests can run async if necessary / just good practice)
	- make sure to delete / remove when done!

## social login / interacting with 3rd party sites
	- (i.e. - https://github.com/angular/protractor/issues/334 )
	- dev-test/e2e page for pulling user data after login
	- fb: add 3005 port to url too (i.e. as a page tab? otherwise need to create a new/separate testing fb app for the testing port/url..)
		- need to manually log in with the testing login once to accept permissions
	- twitter: for localhost testing, need to switch "server.domain" in "config.test.json" to ip address ("127.0.0.1")
	- google: add 3005 port to javascript origins in google developers console
		- need to manually log in with the testing login once to accept permissions

## "gotchas" - i.e. SauceLabs form input sendKeys issue..
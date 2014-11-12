# Configs

## Configs
`app/configs` holds the configuration files for the entire app, for EVERY environment. Configs are paired - for EACH environment there's a regular config (*.json) and a test config (*.test.json). The default `config.json` should work for your localhost (local development) so you shouldn't need to change anything. However, if you have issues or get errors when running grunt or viewing the site, create a NEW pair of config files and copy/set `config_environment.json` to use these new configs.

### Creating a new config pair

1. select a unique name for your new config (i.e. assuming this is for a local/localhost environment and your name is 'john', call it `localjohn` - we'll use this name for the rest of the steps; just replace it accordingly).
2. copy `config.json` and rename it `config-localjohn.json`. Then open this file and edit the values appropriately to match your environment. Typically this means changing (at least) the following:
	1. `operatingSystem` to whatever computer you're using (i.e. `windows` or `mac`)
	2. `forever` to `0`
	3. `server.domain` to `localhost`
	4. blank out the `sauceLabs` values so the Protractor tests will run locally using the Selenium Standalone Server.
3. copy `config-localjohn.json` and rename it `config-localjohn.test.json` and edit the values appropriately for your TEST environment. Typically this means changing the following:
	1. `server.port` (to a DIFFERENT port than you're using on the non test config)
	2. `server.socketPort` (to a DIFFERENT port than you're using on the non test config)
	3. `db.database` - i.e. to the same value as `app.name`
4. copy and set the `config_environment.json` to use this environment with: `cp app/config_environment.json config_environment.json` and then edit the file to set the `environment` key of your new environment: `localjohn`.


### Test Environment

When testing (backend node tests, frontend angular tests, e2e tests) the test config is used. The backend (node) just needs a new server instance to be run with `node run.js config=test`. But for the frontend, the files are built via grunt so the "final" files are pre-compiled rather than a config being set a run time. This means that the same sever can only run ONE frontend config set at a time with the same set of files. To run a test config AND a non-test config simultaneously would require a 2nd set of compiled/built "test" files.

To be robust, this would mean re-writing ALL files AND doing a production and non-production verison. However, that would double the file size for the frontend with the duplicate copies and add some confusion with the duplicate named files or 2nd folder for the test files so it would probably best best/easier to just write the production final files only (in the `build` directory, which is just 3 to 5 files). But then that makes it harder to debug..

So, we'll focus on the key files (typically ones with `-grunt` suffices) that are the ones that by duplicating these ONLY, the rest should fall out:
- index.html
	- this is the only link from the backend to the frontend since it's a Single Page App; so by serving a different (test) index.html, we can control what frontend files are then served by what resources are included in index.html
- config.js
	- this is where the config file is copied for the frontend
	
There are also some other files but I think we can get away with not changing these as long as we get the above?
- Gruntfile.js
- test files
	- protractor.conf-grunt.js (but this is already set up to use both cfgJson & cfgTestJson so is handled)
- [other `-grunt` files but that do NOT use cfgJson so shouldn't matter]
	- _base-grunt.less
	- karma-no-coverage.conf-grunt.js
	- karma.conf-grunt.js

So basically if we create an `index-test.html` file and then have the backend serve that (if on the test environment on the backend) and then create a `config-test.js` file and include that in `index-test.html`, then everything else should fall out. The only other file we may want to change to be more robust is `Gruntfile.js`.

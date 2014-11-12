HTTPS / SSL:

1. get / generate SSL certificate (*.key and *.crt files)
	1. NOTE: to get a "trusted" certificate (for production) that browsers won't issue a warning for, it will cost money (around $50 - $100+ per year)
	2. add certificates (i.e. to the `app` folder) and then reference those certifications in `config.json` `ssl` key/object
	3. set `server.scheme` to `https` in `config.json`
2. open port 443
3. configure (node) server to use certificates and HTTPS (instead of plain HTTP) and port 443
4. [on production] ip tables redirect the 443 as well as port 80
	1. http://stackoverflow.com/questions/7907102/how-can-i-configure-expressjs-to-handle-both-http-and-https

- startSSL for free (development) certificate

- generating self-signed certificate (using openSSL)
	- https://help.ubuntu.com/10.04/serverguide/certificates-and-security.html
	- https://devcenter.heroku.com/articles/ssl-certificate-self
	- https://devcenter.heroku.com/articles/ssl-endpoint#acquire-ssl-certificate
	- NOTE: can use 'localhost' for Common Name / domain
	- full steps copied / combined from above:
		- `which openssl`
		- `openssl genrsa -des3 -out ssl.pass.key 2048` to generate pass key
			- when prompted, enter EASY password value as it's just for generating CSR, not the actual password the app will use
		- `openssl rsa -in ssl.pass.key -out ssl.key` to strip password and generate key
		- if you want to create a UC or wildcard certificate that can be used on multiple servers / with multiple domains, you'll now have to create a config file (e.g. `openssl-csr.cnf`) that will set the "Subject Alternate Name" fields. Then in the step below, add a flag to use this config, e.g. `openssl req -nodes -new -key ssl.key -out ssl.csr -config openssl-csr.cnf`
			- https://rtcamp.com/wordpress-nginx/tutorials/ssl/multidomain-ssl-subject-alternative-names/
			- other references and example config files:
				- http://apetec.com/support/GenerateSAN-CSR.htm
				- https://help.ubuntu.com/community/OpenSSL
				- http://stuff.mit.edu/afs/athena/contrib/crypto/openssl.cnf
				- http://www.phildev.net/ssl/opensslconf.html
			- NOTE: some walkthroughs talk about "exporting", "importing" and focus on "where/what server the CSR was generated from" - this should not matter and makes things seem overly complicated. You're simply using the SAME, ONE certificate on multiple servers. Create ONE CSR from ANYWHERE (locally, production server, development server, etc.) and then put the certificates on all servers (e.g. with GIT version control or the `scp` command below as normal - no special "export" process is needed).
		- `openssl req -nodes -new -key ssl.key -out ssl.csr`
			- most can be blank / are self-explanatory but make sure to use proper country code
			- use your domain name for the 'Common Name' prompt, e.g. `example.com` or `www.example.com` or `*.example.com` or `localhost`
			- leave the 'Challenge Password' blank (just press 'Enter' to skip)
			- NOTE: if you want to check your CSR, use `openssl req -in ssl.csr -noout -text` to decode it
		- `openssl x509 -req -days 365 -in ssl.csr -signkey ssl.key -out ssl.crt`
- using "official" / verified certificates
	- some SSL certs such as with GoDaddy will give you multiple certificate files (i.e. a 'bundle' certificate that actually has multiple certificates in it) - in which case one of these should be the standard certificate and the other(s) should be CA certificates). If you have a bundle certificate, you'll need to break them out into separate CA cert files and use those in node.
	- http://stackoverflow.com/questions/16224064/running-ssl-node-js-server-with-godaddy-gd-bundle-crt
	- to copy the ssl certs to the server use the `scp` command (the reason for doing so is that your SSL certs should NOT be in version control!)
		- http://www.mkyong.com/linux/copy-file-to-from-server-via-scp-command/
- steps for 3rd party ("official") certificates, i.e. with GoDaddy:
1. generate a .csr (locally) [see above]
	1. this will also generate the .key (and .pass.key) files
2. upload CSR to GoDaddy to get .crt and the .ca file(s)
	1. break the .ca bundle file into individual .ca files [see above]
	
	
- using with node.js / express (already handled for you in MEAN-seed - just update `config.json` `ssl` field to point to your certs and be enabled)
	- http://stackoverflow.com/questions/21397809/create-a-self-signed-ssl-cert-for-localhost-for-use-with-express-node
	- http://stackoverflow.com/questions/5998694/how-to-create-an-https-server-in-node-js
		- http://expressjs.com/api.html#app.listen
		- http://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
- run BOTH http & https (& redirect http to https)
	- http://chrislarson.me/blog/ssl-nodejs-express-and-socketio
		
		
- places that do (or DID) have 'http' scheme
	- ci.js
	- Gruntfile.js
	- app
		- modules
			- emailMandrill.js
		- src
			- index-*-grunt.html
			- config-grunt.js
			- protractor.conf-grunt
		- test
			- apiTestHelpers.js
	- docs
		- README
		
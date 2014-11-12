# Optional Additional Setup

## Enabling HTTPS

1. get / generate SSL certificates
	1. see [ssl.md](ssl.md) for instructions & more info
2. open port 443 on your server
3. modify `config.json` as follows:
	1. `server.scheme` to `https`
	2. update `ssl` object to be enabled and point to your certificates (certs are expected to be in `app/ssl` folder, which is already in `.gitignore`)
	3. NOTE: do NOT use https/ssl for the TEST configs (e.g. `config.test.json`) that run tests / the test server
4. ip tables redirect port 443 in addition to port 80
	1. http://stackoverflow.com/questions/7907102/how-can-i-configure-expressjs-to-handle-both-http-and-https
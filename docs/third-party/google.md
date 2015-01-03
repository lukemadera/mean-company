Using Google


# Google Login
3 ways to do this but we focus on pure frontend or pure server side. https://developers.google.com/+/web/signin/
1. frontend JS SDK: https://developers.google.com/+/web/signin/javascript-flow
2. pure server side flow: https://developers.google.com/+/web/signin/redirect-uri-flow

Even though the server side flow is "not recommended", we use that because the frontend flow for some reason uses iFrames and FIVE separate HTTP requests and adds over HALF A SECOND of (page) load time! So we chose the server side (redirect) flow, which is just like we did it with Facebook. This requires ZERO extra scripts to be loaded on the frontend - it's just an <href> redirect to Google.

This post describes some of this: https://plus.google.com/117961615064129175665/posts/U7KEUUm24sj

NOTE: make sure to add the callback_url as a redirect URI in the Google Developers Console: https://console.developers.google.com
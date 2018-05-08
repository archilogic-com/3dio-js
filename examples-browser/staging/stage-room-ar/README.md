---

this demo has been moved to another repo:

repo: https://github.com/archilogic-com/web-xr-homestaging-ai
demo: https://archilogic-com.github.io/web-xr-homestaging-ai/

---

# Home staging AR Demo

This demo let's you draw a floor plan in AR

![](https://storage.3d.io/535e624259ee6b0200000484/2017-09-13_11-56-39_wW7wLF/draw-plan.gif)

and then furnish it automatically.

![](https://storage.3d.io/535e624259ee6b0200000484/2017-09-13_11-42-23_XUM61N/home-staging-ai.gif)


## WebAR phone

You'll need an WebAR enabled device<br>
Currently this limits your choices to:
* Google Pixel
* Samsung S8
* iPhone with iOS 11

Get started here to install WebARonARCore / WebARonARKit Browser:
* Android: https://github.com/google-ar/WebARonARCore
* iOS: https://github.com/google-ar/WebARonARKit

## Run the demo

1. Clone the repo
2. Get an publishable API Key from https://3d.io
3. Set it in app.js
4. build 3dio and run examples via:

```
npm run dev-browser
```
Navigate your phone ( using WebAR enabled browser ) to
`<local ip>:8080/examples-browser/staging/stage-room-ar/`

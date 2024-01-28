# Getting Started with The Zeeguu Reader

The latest version of the code is always online at [Zeeguu Reader Extension on GitHub](https://github.com/zeeguu/browser-extension).

## Requires  npm: "^8.5.1",
https://nodejs.org/en/download/

# To Build the Extension 

Run the following two steps in order and chose the third based on the desired target platform: 

### `npm install` 
This command installs a package and any packages that it depends on.

### `npm run importZeeguu`
This command clones the zeeguu-web repository inside /src. 
We need this because we reuse as much code as possible from zeeguu-web.
After cloning, 'npm install' is run inside of the src/zeeguu-react folder.

## Building for Chrome 

### `npm run build`
Builds the app for Chrome production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Go to chrome://extensions/ and unpack the build folder

## Building for Firefox
In the project directory, you can run:

### `npm run buildFirefox`
Builds the app for Firefox production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\


## Notes

### Testing the extension in development mode
- we have to add localhost to externally connectable in manifest.json, otherwise chrome.runtime can't 
send a message to the extension from checkExtensionCommunication.js>checkExtensionInstalled()
(this is captured in manifest.chrome.dev.json - however, i don't like the duplication betweem the two files...)
```js 
    "externally_connectable": {
        "matches": ["*://*.zeeguu.org/*", "*://localhost/*"]
    },
```
- also, for the communication with Chrome to work one needs to add the id of the extension 
in the .dev.env file (REACT_APP_EXTENSION_ID=...)
- for the communication with Firefox to work in development localhost has to be added to content_scripts; as done in manifest.firefox.dev.json 
```js
  "content_scripts": [
    {
      "matches": ["*://*.zeeguu.org/*", "*://localhost/*"],
      "js": ["injectOnZeeguuOrg.js"]
    }
  ],
```







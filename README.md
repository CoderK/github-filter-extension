Add Filter Storage Your GitHub!
==============

This extension add some feature to save and delete your custom filters in issues and Pull request page on Github.

[![스크린샷 2016-08-30 오후 11.54.58.png](https://s22.postimg.org/8ts6mdo41/2016_08_30_11_54_58.png)](https://postimg.org/image/v5pzfrn7x/)

## Developing

#### Set Up

First, clone this repository.
``` 
git clone https://github.com/CoderK/github-filter-extension.git
```

Second, install npm dependencies.
```
cd github-filter-extension && npm install
```

Third, bundle source code, and then bundle.js will be created at ```./dist``` 
```
npm run build
```

#### Add Extension To Chrome

1. Enable [Chrome Extensions Developer Mode](https://developer.chrome.com/extensions/faq#faq-dev-01) in Chrome.
2. In Settings > Extensions click "Load unpacked extension" and select the `chrome/` subfolder of this repository.

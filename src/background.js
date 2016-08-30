chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status !== 'complete') {
    return;
  }

  chrome.tabs.getSelected(null, tab => {
    if(/(github.com)\/(.*)\/(.*)\/(issues|pulls)/.test(tab.url)) {
      chrome.browserAction.setIcon({path: './resources/img/filter_on_128.png'});
      chrome.tabs.sendMessage(tabId, changeInfo, () => {});
    } else {
      chrome.browserAction.setIcon({path: './resources/img/filter_off_128.png'});
    }
  });
});
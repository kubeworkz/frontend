import { useEffect } from 'react';

import { BrowserTypes, useDeviceData } from 'react-device-detect';

export const useBrowserDetect = () => useEffect(() => {
  const { browser } = useDeviceData(window.navigator.userAgent);

  if (browser.name === BrowserTypes.Safari) {
    window.document.body.classList.add('safari');
  }
}, []);

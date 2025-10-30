// Detect if device is iOS
export const isIOS = () => {
    if (typeof window === 'undefined') return false;
    
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13+ detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
  };
  
  // Detect if device is Safari
  export const isSafari = () => {
    if (typeof window === 'undefined') return false;
    
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  };
  
  // Check if Web Push is supported
  export const isPushNotificationSupported = () => {
    if (typeof window === 'undefined') return false;
    
    return 'Notification' in window && 
           'serviceWorker' in navigator && 
           'PushManager' in window;
  };
  
  // Check if running as PWA (installed app)
  export const isPWA = () => {
    if (typeof window === 'undefined') return false;
    
    // Method 1: Display mode check (most reliable)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    // Method 2: iOS Safari specific check
    const isIOSStandalone = window.navigator.standalone === true;
    
    // Method 3: Check for PWA-specific properties
    const hasPWAManifest = window.matchMedia('(display-mode: minimal-ui)').matches;
    
    // Method 4: Check if launched from home screen (Android Chrome)
    const isLaunchedFromHomeScreen = window.matchMedia('(display-mode: fullscreen)').matches && 
                                    !window.navigator.userAgent.includes('Chrome/') === false;
    
    // Method 5: Check for PWA-specific window properties
    const hasPWATraits = window.screen && 
                        window.screen.width === window.screen.availWidth && 
                        window.screen.height === window.screen.availHeight;
    
    // Method 6: Check for service worker registration (PWA indicator)
    const hasServiceWorker = 'serviceWorker' in navigator;
    
    // Method 7: Check if window is not in a browser frame
    const isNotInFrame = window === window.top;
    
    // Method 8: Check for PWA-specific user agent patterns
    const isPWAAgent = /wv|WebView/.test(navigator.userAgent) && 
                      !/Chrome/.test(navigator.userAgent);

    // Combine all checks for maximum reliability
    return isStandalone || 
           isIOSStandalone || 
           hasPWAManifest || 
           (isLaunchedFromHomeScreen && hasPWATraits) ||
           (isPWAAgent && isNotInFrame);
  };
  
  // Get detailed PWA information
  export const getPWAInfo = () => {
    if (typeof window === 'undefined') return null;
    console.log(isPWA(), "isPWA!!!!")
    return {
      isPWA: isPWA(),
      displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'standalone' :
                  window.matchMedia('(display-mode: minimal-ui)').matches ? 'minimal-ui' :
                  window.matchMedia('(display-mode: fullscreen)').matches ? 'fullscreen' : 'browser',
      isIOSStandalone: window.navigator.standalone === true,
      hasServiceWorker: 'serviceWorker' in navigator,
      isInFrame: window !== window.top,
      userAgent: navigator.userAgent,
      screenInfo: {
        width: window.screen?.width,
        height: window.screen?.height,
        availWidth: window.screen?.availWidth,
        availHeight: window.screen?.availHeight,
        isFullScreen: window.screen?.width === window.screen?.availWidth && 
                     window.screen?.height === window.screen?.availHeight
      }
    };
  };

  export default {
    isIOS,
    isSafari,
    isPushNotificationSupported,
    isPWA,
    getPWAInfo
  };
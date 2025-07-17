// Extension conflict handler
(function () {
  // Capture and suppress extension-related errors
  const originalOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    if (
      source &&
      (source.includes("chrome-extension://") ||
        source.includes("moz-extension://") ||
        source.includes("safari-extension://") ||
        source.includes("contentScript.bundle.js") ||
        message.includes("web_accessible_resources"))
    ) {
      // Suppress extension-related errors
      console.debug("Extension error suppressed:", message);
      return true; // prevents the error from being reported in the console
    }
    return originalOnError
      ? originalOnError(message, source, lineno, colno, error)
      : false;
  };

  // Block certain extension fetch requests that might cause issues
  const originalFetch = window.fetch;
  window.fetch = function (resource, init) {
    if (
      resource &&
      typeof resource === "string" &&
      (resource.startsWith("chrome-extension://") ||
        resource.startsWith("moz-extension://") ||
        resource.startsWith("safari-extension://") ||
        resource === "chrome-extension://invalid/" ||
        resource.includes("extension://"))
    ) {
      // Return a dummy response instead of making the request
      console.debug("Blocked extension fetch request:", resource);
      return Promise.resolve(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );
    }
    return originalFetch.apply(this, arguments);
  };

  // Handle DOM mutation events that might be triggered by extensions
  if (typeof MutationObserver !== "undefined") {
    // Create a mutation observer to remove unwanted elements added by extensions
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node instanceof HTMLElement) {
              // Check for common extension injected elements
              if (
                node.id?.includes("extension") ||
                node.className?.includes("extension") ||
                node.tagName === "EXTENSION-ELEMENT" ||
                node.getAttribute("data-extension")
              ) {
                node.remove();
              }
            }
          });
        }
      }
    });

    // Start observing the document with the configured parameters
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }
})();

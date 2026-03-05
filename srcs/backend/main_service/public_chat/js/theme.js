/**
 * Theme sync: applies dark/light mode from URL param and listens
 * for postMessage from the parent React app (Chat.tsx)
 */
(function () {
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    // Apply immediately from URL param (prevents flash of unstyled content)
    var params = new URLSearchParams(window.location.search);
    var theme = params.get('theme');
    if (theme) applyTheme(theme);

    // Listen for dynamic changes from the parent window (theme toggle)
    window.addEventListener('message', function (event) {
        if (event.data && event.data.type === 'set-theme') {
            applyTheme(event.data.theme);
        }
    });
})();

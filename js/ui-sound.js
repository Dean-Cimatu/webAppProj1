// UI hover sound for non-game pages (index, register, login, leaderboard)
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    // Determine correct relative path to assets
    const isHtmlSubdir = window.location.pathname.replace(/\\/g, '/').includes('/html/');
    const assetBase = isHtmlSubdir ? '../assets' : './assets';

    const hoverAudio = new Audio(`${assetBase}/soundEffects/buttonHover.wav`);
    hoverAudio.preload = 'auto';
    hoverAudio.volume = 1.0; // keep original sample loudness for UI

    // Use mouseenter to avoid repeated triggers during mousemove inside button
    const attachHover = (btn) => {
      if (!btn || btn.__hoverBound) return;
      btn.__hoverBound = true;
      btn.addEventListener('mouseenter', () => {
        try {
          // rewind and play; catch and ignore autoplay restrictions
          hoverAudio.currentTime = 0;
          hoverAudio.play().catch(() => {});
        } catch (e) {}
      });
    };

    // Attach to existing buttons
    document.querySelectorAll('button').forEach(attachHover);

    // Observe DOM changes to attach to dynamically added buttons, if any
    const mo = new MutationObserver(() => {
      document.querySelectorAll('button').forEach(attachHover);
    });
    mo.observe(document.body, { childList: true, subtree: true });
  });
})();

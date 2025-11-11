(function() {
  const name = prompt('Enter your display name')?.trim() || ('User-' + Math.floor(Math.random() * 999));
  const roomId = 'lobby';

  // join presence
  WS.emit('presence:join', { roomId, name });

  // resize canvas on load
  window.addEventListener('load', () => {
    if (window.CanvasApp) CanvasApp.resize();
  });
})();

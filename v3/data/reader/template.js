/**
    Reader View - Strips away clutter

    Copyright (C) 2014-2022 [@rNeomy]

    This program is free software: you can redistribute it and/or modify
    it under the terms of the Mozilla Public License as published by
    the Mozilla Foundation, either version 2 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    Mozilla Public License for more details.
    You should have received a copy of the Mozilla Public License
    along with this program.  If not, see {https://www.mozilla.org/en-US/MPL/}.

    GitHub: https://github.com/rNeomy/reader-view/
    Homepage: https://webextension.org/listing/chrome-reader-view.html
*/

/* global config */
'use strict';

if (window.top !== window) {
  self.chrome = top.chrome;
  window.config = top.config;
}

// back
document.getElementById('reader-domain').addEventListener('click', e => {
  e.preventDefault();
  e.stopPropagation();
  top.nav.back(true);
});

// link handling
document.addEventListener('click', e => {
  const a = e.target.closest('a');
  if (!a || !a.href) return;

  // Only handle normal left-clicks
  if (e.button !== 0) return;

  const link = new URL(a.href);

  // Let browser handle internal links, anchors, and same-document navigation
  if (link.origin === location.origin) {
    return;
  }

  const reader = config.prefs['reader-mode'];
  // Let browser handle external links
  if (reader === false) {
    return;
  }

  // Only intercept external links when needed
  e.preventDefault();
  e.stopPropagation();

  chrome.runtime.sendMessage({
    cmd: 'open',
    url: a.href,
    reader: config.prefs['reader-mode'],
    current: !e.ctrlKey && !e.metaKey && a.target !== '_blank'
  });
});

// prefs
config.onChanged.push(ps => {
  if (ps['user-css']) {
    document.getElementById('user-css').textContent = config.prefs['user-css'];
  }
  if (ps['show-images']) {
    document.body.dataset.images = config.prefs['show-images'];
  }
  if (ps['mode']) {
    document.documentElement.dataset.mode = config.prefs.mode;
  }
  if (ps['font']) {
    // as a CSS selector
    document.body.dataset.font = parent.document.body.dataset.font;
  }
  if (ps['column-count']) {
    document.body.dataset.columns = config.prefs['column-count'];
  }
});

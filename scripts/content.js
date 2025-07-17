console.log("✅ content.js is running");

// Store shortcut → text map
let shortcutMap = {};

chrome.storage.local.get("snippets", ({ snippets = [] }) => {
  shortcutMap = Object.fromEntries(snippets.map(s => [s.shortcut, s.text]));
});

// Check if element is a valid target
function isEditable(el) {
  return (
    el.tagName === "TEXTAREA" ||
    el.tagName === "INPUT" ||
    el.isContentEditable
  );
}

// Replace shortcut with snippet text
function handleInput(e) {
  const el = e.target;
  if (!isEditable(el)) return;

  const isInput = el.tagName === "INPUT" || el.tagName === "TEXTAREA";
  const value = isInput ? el.value : el.innerText;
  const cursor = isInput ? el.selectionStart : getCaretPosition(el);
  if (cursor == null) return;

  const before = value.slice(0, cursor);
  const match = before.match(/(\S+)$/);
  if (!match) return;

  const typed = match[1];
  const replacement = shortcutMap[typed];
  if (!replacement) return;

  const newBefore = before.slice(0, -typed.length) + replacement;
  const newValue = newBefore + value.slice(cursor);

  if (isInput) {
    el.value = newValue;
    const newCursor = newBefore.length;
    el.setSelectionRange(newCursor, newCursor);
  } else {
    el.innerText = newValue;
    // Not restoring cursor in contentEditable for now
  }
}

// Track inputs once
function bindField(el) {
  if (!isEditable(el) || el.dataset.snippetBound) return;
  el.dataset.snippetBound = "true";
  el.addEventListener("input", handleInput);
}

// Attach listeners to all current fields
function bindAllFields() {
  const fields = document.querySelectorAll("textarea, input, [contenteditable='true']");
  fields.forEach(bindField);
}

// Rebind when new elements are added (SPA support)
const observer = new MutationObserver(() => {
  bindAllFields();
});
observer.observe(document.body, { childList: true, subtree: true });

// Initial bind
bindAllFields();

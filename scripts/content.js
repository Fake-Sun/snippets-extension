// content.js
console.log("✅ content.js is running");

// --- State ---
/** @type {Record<string, string>} */
let shortcutMap = {};

// Load current snippets into memory
async function refreshShortcutMap() {
  try {
    const { snippets = [] } = await chrome.storage.local.get("snippets");
    // Expecting objects like { shortcut: string, text: string }
    shortcutMap = Object.fromEntries(
      (Array.isArray(snippets) ? snippets : []).map(s => [s.shortcut, s.text])
    );
  } catch (e) {
    console.error("Failed loading snippets:", e);
  }
}

// Initial load
refreshShortcutMap();

// React to changes saved from popup/options/background (hot reload in-page)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.snippets) {
    const next = changes.snippets.newValue || [];
    shortcutMap = Object.fromEntries(next.map(s => [s.shortcut, s.text]));
    // No need to rebind listeners; replacements will use the updated map.
  }
});

// Optional: accept an explicit broadcast in case you also send a message
chrome.runtime.onMessage.addListener((msg) => {
  if (msg && msg.type === "snippets-updated") {
    refreshShortcutMap();
  }
});

// --- Utilities ---
function isEditable(el) {
  if (!el) return false;
  if (el.isContentEditable) return true;
  const tag = el.tagName;
  return tag === "TEXTAREA" || tag === "INPUT";
}

function getCaretPosition(el) {
  // Only for contentEiditable; inputs/textareas use selectionStart
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0);
  // Ensure caret is inside this element
  if (!el.contains(range.endContainer)) return null;

  const preCaret = range.cloneRange();
  preCaret.selectNodeContents(el);
  preCaret.setEnd(range.endContainer, range.endOffset);
  return preCaret.toString().length;
}

// --- Replacement engine ---
let composing = false; // avoid interfering with IME composition

function handleInput(e) {
  if (composing) return;

  const el = e.target;
  if (!isEditable(el)) return;

  const isInput = el.tagName === "INPUT" || el.tagName === "TEXTAREA";
  const value = isInput ? el.value : el.textContent || "";
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
    // Trigger native input events so frameworks detect the change
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  } else {
    // contentEditable
    el.textContent = newValue;
    // (Optional) restore caret at end of inserted replacement
    try {
      const range = document.createRange();
      const sel = window.getSelection();
      // Place caret roughly at newBefore.length; this is a simple approach
      // For precise positioning across nodes, a text-walker is needed.
      range.selectNodeContents(el);
      range.collapse(true);
      // Move forward newBefore.length characters
      let remaining = newBefore.length;
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      let node = walker.nextNode();
      while (node && remaining > 0) {
        const take = Math.min(remaining, node.textContent.length);
        remaining -= take;
        if (remaining === 0) {
          range.setStart(node, take);
          range.collapse(true);
          break;
        }
        node = walker.nextNode();
      }
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } catch {
      console.log("Failed to set caret position in contentEditable");
    }
  }
}

// Bind one element once
function bindField(el) {
  if (!isEditable(el) || el.dataset.snippetBound) return;
  el.dataset.snippetBound = "true";
  el.addEventListener("compositionstart", () => (composing = true));
  el.addEventListener("compositionend", () => (composing = false));
  el.addEventListener("input", handleInput);
}

// Attach to current fields
function bindAllFields() {
  // Use [contenteditable] (presence) to catch elements where contentEditable=true is set via JS
  const fields = document.querySelectorAll("textarea, input, [contenteditable]");
  fields.forEach(bindField);
}

// Observe DOM mutations (SPA support)
const observer = new MutationObserver(() => {
  bindAllFields();
});
observer.observe(document.documentElement || document.body, {
  childList: true,
  subtree: true,
});

// Initial bind
bindAllFields();

// Cleanup on unload (defensive)
window.addEventListener("unload", () => {
  observer.disconnect();
});

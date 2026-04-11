// content.js
console.log("Snipply content script is running");

/** @typedef {{ shortcut?: string, text?: string }} StoredSnippet */

/** @type {Record<string, string>} */
let shortcutMap = {};
/** @type {string[]} */
let shortcuts = [];
let composing = false;
let replacing = false;

async function refreshShortcutMap() {
  try {
    const { snippets = [] } = await chrome.storage.local.get("snippets");
    setShortcuts(snippets);
  } catch (error) {
    console.error("Failed loading snippets:", error);
  }
}

/** @param {StoredSnippet[]} snippets */
function setShortcuts(snippets) {
  shortcutMap = Object.fromEntries(
    (Array.isArray(snippets) ? snippets : [])
      .filter(snippet => snippet.shortcut && snippet.text)
      .map(snippet => [String(snippet.shortcut), String(snippet.text)])
  );

  shortcuts = Object.keys(shortcutMap).sort((a, b) => b.length - a.length);
}

refreshShortcutMap();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.snippets) {
    setShortcuts(changes.snippets.newValue || []);
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "snippets-updated") {
    refreshShortcutMap();
  }
});

/** @param {Event} event */
function findEditableFromEvent(event) {
  const path = typeof event.composedPath === "function" ? event.composedPath() : [event.target];

  for (const target of path) {
    if (!(target instanceof Element)) continue;

    const editable = target.closest?.("textarea, input, [contenteditable], [role='textbox']");
    if (editable && isEditable(editable)) return editable;

    if (target.shadowRoot?.activeElement) {
      const shadowEditable = findEditableFromElement(target.shadowRoot.activeElement);
      if (shadowEditable) return shadowEditable;
    }
  }

  return null;
}

/** @param {Element | null} element */
function findEditableFromElement(element) {
  if (!element) return null;
  const editable = element.closest?.("textarea, input, [contenteditable], [role='textbox']");
  return editable && isEditable(editable) ? editable : null;
}

/** @param {Element} element */
function isEditable(element) {
  if (element instanceof HTMLTextAreaElement) return !element.disabled && !element.readOnly;
  if (element instanceof HTMLInputElement) {
    const textLikeTypes = new Set(["", "text", "search", "url", "tel", "email", "password"]);
    return textLikeTypes.has(element.type) && !element.disabled && !element.readOnly;
  }

  if (element instanceof HTMLElement) {
    return element.isContentEditable || element.getAttribute("role") === "textbox";
  }

  return false;
}

/** @param {string} beforeCaret */
function findShortcutAtEnd(beforeCaret) {
  for (const shortcut of shortcuts) {
    if (beforeCaret.endsWith(shortcut)) {
      return shortcut;
    }
  }

  return null;
}

/** @param {HTMLInputElement | HTMLTextAreaElement} element */
function replaceInInput(element) {
  const start = element.selectionStart;
  const end = element.selectionEnd;
  if (start == null || end == null || start !== end) return false;

  const beforeCaret = element.value.slice(0, start);
  const shortcut = findShortcutAtEnd(beforeCaret);
  if (!shortcut) return false;

  const replacement = shortcutMap[shortcut];
  const replaceStart = start - shortcut.length;

  replacing = true;
  try {
    element.setRangeText(replacement, replaceStart, end, "end");
    element.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      cancelable: true,
      inputType: "insertReplacementText",
      data: replacement,
    }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  } finally {
    replacing = false;
  }

  return true;
}

/** @param {Element} root */
function getActiveRange(root) {
  const selection = root.ownerDocument.getSelection();
  if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) return null;

  const range = selection.getRangeAt(0);
  if (!root.contains(range.endContainer)) return null;

  return range;
}

/** @param {Element} root */
function getTextBeforeCaret(root) {
  const range = getActiveRange(root);
  if (!range) return null;

  const before = range.cloneRange();
  before.selectNodeContents(root);
  before.setEnd(range.endContainer, range.endOffset);
  return before.toString();
}

/** @param {Element} root @param {number} offset */
function findTextPosition(root, offset) {
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let currentOffset = offset;
  let node = walker.nextNode();

  while (node) {
    const text = node.textContent || "";
    if (currentOffset <= text.length) {
      return { node, offset: currentOffset };
    }

    currentOffset -= text.length;
    node = walker.nextNode();
  }

  return { node: root, offset: root.childNodes.length };
}

/** @param {Element} root */
function replaceInRichEditor(root) {
  const activeRange = getActiveRange(root);
  if (!activeRange) return false;

  const beforeCaret = getTextBeforeCaret(root);
  if (beforeCaret == null) return false;

  const shortcut = findShortcutAtEnd(beforeCaret);
  if (!shortcut) return false;

  const replacement = shortcutMap[shortcut];
  const startPosition = findTextPosition(root, beforeCaret.length - shortcut.length);
  const replaceRange = activeRange.cloneRange();
  replaceRange.setStart(startPosition.node, startPosition.offset);
  replaceRange.setEnd(activeRange.endContainer, activeRange.endOffset);

  const selection = root.ownerDocument.getSelection();
  if (!selection) return false;

  replacing = true;
  try {
    selection.removeAllRanges();
    selection.addRange(replaceRange);

    const insertedWithCommand = root.ownerDocument.execCommand("insertText", false, replacement);
    if (!insertedWithCommand) {
      replaceRange.deleteContents();
      const textNode = root.ownerDocument.createTextNode(replacement);
      replaceRange.insertNode(textNode);
      replaceRange.setStartAfter(textNode);
      replaceRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(replaceRange);
    }

    root.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      cancelable: true,
      inputType: "insertReplacementText",
      data: replacement,
    }));
  } finally {
    replacing = false;
  }

  return true;
}

/** @param {Event} event */
function handlePossibleReplacement(event) {
  if (composing || replacing || shortcuts.length === 0) return;

  const editable = findEditableFromEvent(event);
  if (!editable) return;

  if (editable instanceof HTMLInputElement || editable instanceof HTMLTextAreaElement) {
    replaceInInput(editable);
    return;
  }

  replaceInRichEditor(editable);
}

document.addEventListener("compositionstart", () => {
  composing = true;
}, true);

document.addEventListener("compositionend", (event) => {
  composing = false;
  setTimeout(() => handlePossibleReplacement(event), 0);
}, true);

document.addEventListener("input", handlePossibleReplacement, true);
document.addEventListener("keyup", handlePossibleReplacement, true);



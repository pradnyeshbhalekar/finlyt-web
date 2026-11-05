// Discourages casual copying of the logo and mockups. Spread these handlers on an
// element and give it the `select-none` class: right-click, copy, cut and dragging are
// blocked inside it, while text fields keep working. Screenshots and browser dev tools
// still work; nothing on a web page can stop those.
const block = (e) => {
  if (!e.target.closest?.('input, textarea')) e.preventDefault()
}

export const noCopy = { onCopy: block, onCut: block, onContextMenu: block, onDragStart: block }

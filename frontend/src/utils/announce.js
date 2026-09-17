let el = null
export function announce(msg) {
  if (!el) {
    el = document.createElement("div")
    el.className = "sr-only"
    el.setAttribute("aria-live", "polite")
    document.body.appendChild(el)
  }
  el.textContent = ""
  setTimeout(() => { el.textContent = msg }, 30)
}

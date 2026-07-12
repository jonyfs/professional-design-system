// Menubar behavior wiring (contracts/menubar.contract.md, research.md R3).
// This is layered ENTIRELY on top of the already-shipped, UNMODIFIED
// src/scripts/dropdown-menu.js — every top-level trigger is wired via
// initDropdownMenus() exactly like a standalone Dropdown Menu (open/close/
// in-panel-arrow-keys/focus-return all come from that file, for free).
// The only thing dropdown-menu.js has no concept of is roving tabindex
// BETWEEN multiple top-level triggers (it only handles arrow keys inside
// an already-open panel) — that layer, adapted from tabs.js's
// enabledIndices()/Left-Right/Home-End pattern, is this file's entire job.
export function initMenubar() {
  document.querySelectorAll("[data-menubar]").forEach((menubar) => {
    const triggers = Array.from(menubar.querySelectorAll("[data-menubar-item]"));

    // Code-review finding (feature 016, HIGH) and its full fix, found
    // across two iterations while verifying it:
    //
    // v1 (rejected): explicitly call `hidePopover()` on the old panel,
    // wait for ITS "toggle" event, then call `showPopover()` on the new
    // one and wait for a SECOND "toggle" event before focusing. Two
    // independently-queued toggle events chained together left a window
    // where a rapid second keypress's own transition could interleave
    // with the first's, and dropdown-menu.js's own unconditional
    // close-time `trigger.focus()` (reused unmodified, no staleness
    // awareness) would fire against whichever chain's queued event
    // happened to resolve last — regardless of which keypress was
    // actually "newest." A `generation` counter could stop THIS module
    // from reacting to its own stale callbacks, but could not stop
    // dropdown-menu.js's unrelated listener from firing anyway.
    //
    // v2 (this version): confirmed empirically that calling
    // `showPopover()` directly on a SIBLING auto-popover already closes
    // the currently-open one as one atomic native operation — the two
    // resulting "toggle" events (old panel "closed", new panel "open")
    // fire in a fixed, guaranteed order (closed, then open) with no
    // separate developer-orchestrated chain in between. This removes the
    // whole two-chain race entirely: there is only ever ONE `showPopover`
    // call and ONE toggle event (the new panel's "open") this module
    // needs to wait for before asserting the correct final focus.
    //
    // `settledGeneration`/`generation` remain as a second, explicit guard:
    // a keypress arriving while an earlier transition hasn't yet reached
    // its own final focus placement is ignored outright (never starts an
    // overlapping second transition), rather than relying solely on the
    // single-call ordering guarantee above.
    let generation = 0;
    let settledGeneration = 0;

    function panelFor(trigger) {
      return document.getElementById(trigger.getAttribute("popovertarget"));
    }

    function isOpen(trigger) {
      const panel = panelFor(trigger);
      return panel ? panel.matches(":popover-open") : false;
    }

    function focusTrigger(index) {
      triggers.forEach((t, i) => {
        t.tabIndex = i === index ? 0 : -1;
      });
      triggers[index].focus();
    }

    // Attached to the menubar container (not each trigger) and relies on
    // bubbling — a real finding from implementation: once a trigger's
    // panel opens, dropdown-menu.js's own toggle listener moves focus INTO
    // the panel's first menu item (its own, correct, unmodified behavior).
    // A per-trigger keydown listener would then never see ArrowRight/
    // ArrowLeft again, since the keydown fires on the now-focused menu
    // item inside the panel, not the trigger button. Real Menubar
    // convention (WAI-ARIA APG) requires ArrowRight/ArrowLeft to switch to
    // the sibling top-level menu even while focus is inside an open
    // submenu — bubbling catches this for free, since dropdown-menu.js's
    // own panel keydown listener only explicitly handles ArrowUp/
    // ArrowDown/Tab and returns (without stopPropagation) for any other
    // key, and a popover's top-layer promotion is paint-only, not a
    // DOM-tree relocation — the event still bubbles up through the
    // ordinary parent chain to this container.
    menubar.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End", "ArrowDown"].includes(event.key)) return;

      // A transition from an earlier keypress hasn't reached its final
      // focus placement yet — ignore this keypress rather than starting
      // a second, overlapping transition.
      if (settledGeneration !== generation) {
        event.preventDefault();
        return;
      }

      const currentIndex = triggers.findIndex(
        (t) => t === document.activeElement || panelFor(t)?.contains(document.activeElement),
      );
      if (currentIndex === -1) return;
      const last = triggers.length - 1;

      // ArrowDown never switches which trigger is current — it only opens
      // THIS trigger's own panel — so it deliberately does not go through
      // the sibling-switch path below. Focus is intentionally left to
      // dropdown-menu.js's own toggle listener, which moves it into the
      // panel's first item (the tested, correct behavior for a plain
      // "open this menu" action, distinct from the sibling auto-switch
      // case below, which must land focus on the TRIGGER instead — see
      // that branch's own comment).
      if (event.key === "ArrowDown") {
        panelFor(triggers[currentIndex])?.showPopover();
        event.preventDefault();
        return;
      }

      let newIndex;
      if (event.key === "ArrowRight") newIndex = currentIndex === last ? 0 : currentIndex + 1;
      else if (event.key === "ArrowLeft") newIndex = currentIndex === 0 ? last : currentIndex - 1;
      else if (event.key === "Home") newIndex = 0;
      else newIndex = last;

      const wasOpen = triggers.some((t) => isOpen(t));
      const newTrigger = triggers[newIndex];
      const newPanel = panelFor(newTrigger);
      const myGeneration = ++generation;

      function settle() {
        focusTrigger(newIndex);
        settledGeneration = myGeneration;
      }

      if (wasOpen && newPanel) {
        // A single `showPopover()` call on a sibling auto-popover closes
        // whichever one is currently open as one atomic native operation
        // (confirmed empirically) — no explicit `hidePopover()` on the
        // old panel needed. dropdown-menu.js's own toggle listener
        // (registered first, at page load) reacts to the resulting
        // "open" event on `newPanel` by focusing its first item; this
        // module's own one-time listener (registered second, here) then
        // overrides that with the TRIGGER as the final focus destination
        // (spec.md's own wording: arrow navigation "moves focus to a
        // different top-level trigger", not into the panel's first item).
        newPanel.addEventListener("toggle", settle, { once: true });
        newPanel.showPopover();
      } else {
        settle();
      }

      event.preventDefault();
    });
  });
}

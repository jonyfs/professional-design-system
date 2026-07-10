import { useRef, useState, type HTMLAttributes, type ReactNode } from "react";

export interface TabData {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  tabs: TabData[];
  defaultSelectedId?: string;
}

// WAI-ARIA Tabs pattern reimplemented as React state (research.md R2) —
// no native element covers roving-tabindex/arrow-key navigation, direct
// port of src/scripts/tabs.js's algorithm.
export function Tabs({ tabs, defaultSelectedId, className, ...rest }: TabsProps) {
  const firstEnabled = tabs.find((tab) => !tab.disabled);
  const [selectedId, setSelectedId] = useState<string | undefined>(
    defaultSelectedId ?? firstEnabled?.id,
  );
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function enabledTabs() {
    return tabs.filter((tab) => !tab.disabled);
  }

  // Selects `nextId` and focuses it using that SAME locally-computed id,
  // never by re-reading `selectedId` state — React 18 batches
  // setSelectedId's update, so the `selectedId` closure value is still
  // stale at this point if read instead (/speckit-analyze finding M1).
  function selectAndFocus(nextId: string) {
    if (tabs.find((tab) => tab.id === nextId)?.disabled) return;
    setSelectedId(nextId);
    tabRefs.current[nextId]?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent, currentId: string) {
    const enabled = enabledTabs();
    const posInEnabled = enabled.findIndex((tab) => tab.id === currentId);
    const lastEnabled = enabled.length - 1;
    if (event.key === "ArrowRight") {
      selectAndFocus(enabled[posInEnabled === lastEnabled ? 0 : posInEnabled + 1].id);
    } else if (event.key === "ArrowLeft") {
      selectAndFocus(enabled[posInEnabled === 0 ? lastEnabled : posInEnabled - 1].id);
    } else if (event.key === "Home") {
      selectAndFocus(enabled[0].id);
    } else if (event.key === "End") {
      selectAndFocus(enabled[lastEnabled].id);
    } else {
      return;
    }
    event.preventDefault();
  }

  const classes = ["max-w-lg", className].filter(Boolean).join(" ");

  return (
    <div className={classes} {...rest}>
      <div role="tablist" aria-label="Tabs" className="tabs-list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[tab.id] = el)}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-controls={`panel-${tab.id}`}
            aria-selected={tab.id === selectedId}
            tabIndex={tab.id === selectedId ? 0 : -1}
            disabled={tab.disabled}
            className="tab-trigger"
            data-testid={`tab-${tab.id}`}
            onClick={() => selectAndFocus(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          tabIndex={0}
          hidden={tab.id !== selectedId}
          className="tab-panel"
          data-testid={`panel-${tab.id}`}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

import { useState, type ReactNode } from "react";

export interface TreeViewNode {
  /** Stable key, unique among siblings (used as React key). */
  id: string;
  /** Visible label for the summary (branch) or the leaf row. */
  label: ReactNode;
  /** Child nodes. Presence of children makes this a branch; absence makes
   * it a leaf (rendered with no disclosure triangle). An empty array is
   * still a branch with no children. */
  children?: TreeViewNode[];
  /** Whether a branch starts expanded. Ignored for leaves. */
  defaultExpanded?: boolean;
  summaryTestId?: string;
  detailsTestId?: string;
  leafTestId?: string;
}

export interface TreeViewProps {
  nodes: TreeViewNode[];
  ariaLabel?: string;
  testId?: string;
}

// One branch = one native <details>/<summary>. Expanded state is held per
// branch in its own React state and synced through the native `toggle`
// event (Enter/Space on a focused summary toggle <details> natively, which
// fires `toggle`). Because each branch owns its own independent state and
// collapsing a parent only hides — never unmounts — its descendants, a
// nested branch keeps its own expanded state when an ancestor collapses and
// re-expands (contracts/tree-view.contract.md's state-persistence case).
function TreeBranch({ node }: { node: TreeViewNode }) {
  const [expanded, setExpanded] = useState(Boolean(node.defaultExpanded));

  return (
    <li>
      <details
        open={expanded}
        data-testid={node.detailsTestId}
        onToggle={(event) => setExpanded(event.currentTarget.open)}
      >
        <summary className="tree-view-summary" data-testid={node.summaryTestId}>
          {node.label}
        </summary>
        <ul className="tree-view-children">
          {node.children?.map((child) => (
            <TreeNodeItem key={child.id} node={child} />
          ))}
        </ul>
      </details>
    </li>
  );
}

function TreeNodeItem({ node }: { node: TreeViewNode }) {
  if (node.children) {
    return <TreeBranch node={node} />;
  }
  return (
    <li className="tree-view-leaf" data-testid={node.leafTestId}>
      {node.label}
    </li>
  );
}

// Hierarchical disclosure tree (contracts/tree-view.contract.md, feature
// 016) — recursively nested native <details>/<summary>, zero custom ARIA
// (the native disclosure semantics are correct on their own, confirmed via
// accessibility-tree inspection in the reference). Distinct from
// TreeSelect, which is a combobox; this is a pure expand/collapse tree.
export function TreeView({ nodes, ariaLabel, testId }: TreeViewProps): ReactNode {
  return (
    <ul className="tree-view" aria-label={ariaLabel} data-testid={testId}>
      {nodes.map((node) => (
        <TreeNodeItem key={node.id} node={node} />
      ))}
    </ul>
  );
}

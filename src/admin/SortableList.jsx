import { useCallback, useEffect, useRef, useState } from 'react';

/** Immutable splice reorder. Returns the same array reference when indices are invalid. */
export function moveItem(list, from, to) {
  if (!Array.isArray(list)) return list;
  if (from === to) return list;
  if (from < 0 || to < 0 || from >= list.length || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function GripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="5" cy="4" r="1.25" fill="currentColor" />
      <circle cx="11" cy="4" r="1.25" fill="currentColor" />
      <circle cx="5" cy="8" r="1.25" fill="currentColor" />
      <circle cx="11" cy="8" r="1.25" fill="currentColor" />
      <circle cx="5" cy="12" r="1.25" fill="currentColor" />
      <circle cx="11" cy="12" r="1.25" fill="currentColor" />
    </svg>
  );
}

export function DragHandle({ label = 'Drag to reorder', ...props }) {
  return (
    <button
      type="button"
      className="admin-drag-handle"
      aria-label={label}
      title={label}
      {...props}
    >
      <GripIcon />
    </button>
  );
}

/**
 * Pointer-based sortable list (mouse + touch). Order only commits on drop;
 * Escape / cancelled pointer restores the prior visual order with no data write.
 */
export default function SortableList({
  items = [],
  onReorder,
  getKey = (_item, index) => index,
  className = '',
  listClassName = '',
  itemClassName = '',
  renderItem,
  listTag: ListTag = 'div',
  itemTag: ItemTag = 'div',
}) {
  const itemRefs = useRef([]);
  const dragRef = useRef(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [undo, setUndo] = useState(null);

  const clearUndoSoon = useCallback((snapshot) => {
    setUndo({ snapshot, at: Date.now() });
  }, []);

  useEffect(() => {
    if (!undo) return undefined;
    const t = window.setTimeout(() => setUndo(null), 6000);
    return () => window.clearTimeout(t);
  }, [undo]);

  const resolveOverIndex = useCallback((clientY, fromIndex) => {
    const refs = itemRefs.current;
    let next = fromIndex;
    for (let i = 0; i < refs.length; i += 1) {
      const el = refs[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      if (clientY < mid) {
        next = i;
        break;
      }
      next = i + 1;
    }
    // When inserting after an index greater than from, account for removal.
    if (next > fromIndex) next -= 1;
    return Math.max(0, Math.min(items.length - 1, next));
  }, [items.length]);

  const endDrag = useCallback(
    (commit) => {
      const state = dragRef.current;
      dragRef.current = null;
      if (!state) {
        setDragIndex(null);
        setOverIndex(null);
        return;
      }
      const { from, over, pointerId, target } = state;
      try {
        target?.releasePointerCapture?.(pointerId);
      } catch {
        /* already released */
      }
      setDragIndex(null);
      setOverIndex(null);
      if (!commit || over == null || over === from) return;
      const snapshot = items;
      const next = moveItem(items, from, over);
      if (next === items) return;
      onReorder?.(next);
      clearUndoSoon(snapshot);
    },
    [clearUndoSoon, items, onReorder],
  );

  useEffect(() => {
    function onKey(e) {
      if (e.key !== 'Escape') return;
      if (dragRef.current == null) return;
      e.preventDefault();
      endDrag(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [endDrag]);

  function onHandlePointerDown(index, e) {
    if (e.button != null && e.button !== 0) return;
    // Ignore interactive descendants that aren't the handle itself.
    if (e.target.closest('input, textarea, select, a, button:not(.admin-drag-handle)')) return;
    e.preventDefault();
    const target = e.currentTarget;
    target.setPointerCapture?.(e.pointerId);
    dragRef.current = {
      from: index,
      over: index,
      pointerId: e.pointerId,
      target,
    };
    setDragIndex(index);
    setOverIndex(index);
    setUndo(null);
  }

  function onHandlePointerMove(e) {
    const state = dragRef.current;
    if (!state || state.pointerId !== e.pointerId) return;
    const over = resolveOverIndex(e.clientY, state.from);
    state.over = over;
    setOverIndex(over);
  }

  function onHandlePointerUp(e) {
    const state = dragRef.current;
    if (!state || state.pointerId !== e.pointerId) return;
    endDrag(true);
  }

  function onHandlePointerCancel(e) {
    const state = dragRef.current;
    if (!state || state.pointerId !== e.pointerId) return;
    endDrag(false);
  }

  function applyUndo() {
    if (!undo?.snapshot) return;
    onReorder?.(undo.snapshot);
    setUndo(null);
  }

  function bump(index, dir) {
    const next = moveItem(items, index, index + dir);
    if (next === items) return;
    const snapshot = items;
    onReorder?.(next);
    clearUndoSoon(snapshot);
  }

  return (
    <div className={`admin-sortable ${className}`.trim()}>
      {undo ? (
        <div className="admin-sortable__undo" role="status">
          <span>Order updated.</span>
          <button type="button" className="admin-btn ghost" onClick={applyUndo}>
            Undo
          </button>
        </div>
      ) : null}
      <ListTag className={['admin-sortable__list', listClassName].filter(Boolean).join(' ')}>
        {items.map((item, index) => {
          const key = getKey(item, index);
          const isDragging = dragIndex === index;
          const showBefore =
            dragIndex != null && overIndex === index && dragIndex !== index && overIndex < dragIndex;
          const showAfter =
            dragIndex != null && overIndex === index && dragIndex !== index && overIndex > dragIndex;
          const handleProps = {
            onPointerDown: (e) => onHandlePointerDown(index, e),
            onPointerMove: onHandlePointerMove,
            onPointerUp: onHandlePointerUp,
            onPointerCancel: onHandlePointerCancel,
          };
          const controls = {
            index,
            isDragging,
            moveUp: () => bump(index, -1),
            moveDown: () => bump(index, 1),
            canMoveUp: index > 0,
            canMoveDown: index < items.length - 1,
            handleProps,
            DragHandle: (props) => <DragHandle {...handleProps} {...props} />,
          };

          return (
            <ItemTag
              key={key}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className={[
                'admin-sortable__item',
                itemClassName,
                isDragging ? 'is-dragging' : '',
                showBefore ? 'is-drop-before' : '',
                showAfter ? 'is-drop-after' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              data-sortable-index={index}
            >
              {showBefore ? <div className="admin-sortable__drop-line" aria-hidden="true" /> : null}
              {renderItem(item, index, controls)}
              {showAfter ? <div className="admin-sortable__drop-line" aria-hidden="true" /> : null}
            </ItemTag>
          );
        })}
      </ListTag>
      {dragIndex != null ? (
        <p className="admin-sortable__hint hint" role="status">
          Drop to place · Esc to cancel
        </p>
      ) : null}
    </div>
  );
}

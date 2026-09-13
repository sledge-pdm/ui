import { createSignal, onCleanup, Show, type Component, type JSX } from 'solid-js';
import '../../styles/DialogContent.css';

export interface DialogContentProps {
  title?: string;
  onClose?: () => void;
  /** タイトルバーを掴んでの移動を許可する。位置は親が決めた場所からのオフセットとして持つ */
  movable?: boolean;
  backgroundOpacity?: number;
  class?: string;
  children: JSX.Element;
}

/**
 * @description Dialog box itself - the framed panel with an optional titlebar. Placed by its parent;
 *   Dialog gives it a floating position, ModalDialog centres it in a scope.
 */
const DialogContent: Component<DialogContentProps> = (props) => {
  let rootRef: HTMLDivElement | undefined;
  const [offset, setOffset] = createSignal({ x: 0, y: 0 });

  const hasTitlebar = () => props.title !== undefined || props.onClose !== undefined || props.movable === true;

  const drag = { pointerId: null as number | null, lastX: 0, lastY: 0 };

  const onPointerMove = (e: PointerEvent) => {
    if (drag.pointerId !== e.pointerId || !rootRef) return;
    const rect = rootRef.getBoundingClientRect();
    // 画面外へ出ないところまでに実際の移動量を切り詰め、その量だけ基準も進める（切り詰め時のズレ防止）
    const dx = Math.max(-rect.left, Math.min(e.clientX - drag.lastX, window.innerWidth - rect.right));
    const dy = Math.max(-rect.top, Math.min(e.clientY - drag.lastY, window.innerHeight - rect.bottom));
    drag.lastX += dx;
    drag.lastY += dy;
    setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
  };

  const stopDragListening = () => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onDragEnd);
    window.removeEventListener('pointercancel', onDragEnd);
  };

  const onDragEnd = (e: PointerEvent) => {
    if (drag.pointerId !== e.pointerId) return;
    stopDragListening();
    drag.pointerId = null;
  };

  const onTitlebarPointerDown = (e: PointerEvent) => {
    if (!props.movable) return;
    if ((e.target as HTMLElement).closest('.dialog-close-btn, button, input, a')) return;
    if (drag.pointerId !== null) return;
    drag.pointerId = e.pointerId;
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onDragEnd);
    window.addEventListener('pointercancel', onDragEnd);
  };

  onCleanup(() => {
    if (drag.pointerId !== null) stopDragListening();
  });

  return (
    <div
      ref={(el) => (rootRef = el)}
      class={['dialog-content-root', props.movable ? 'dialog-movable' : undefined, props.class].filter(Boolean).join(' ')}
      role='dialog'
      // translate は包含ブロックを作るので、移動可能なときだけ付ける
      style={props.movable ? { translate: `${offset().x}px ${offset().y}px` } : undefined}
    >
      <div class='dialog-background' style={{ opacity: props.backgroundOpacity ?? 1 }} />
      <Show when={hasTitlebar()}>
        <div class='dialog-titlebar' onPointerDown={onTitlebarPointerDown}>
          <span class='dialog-title'>{props.title}</span>
          <div class='dialog-titlebar-spacer' />
          <Show when={props.onClose}>
            <div class='dialog-close-btn' onClick={props.onClose}>
              ×
            </div>
          </Show>
        </div>
      </Show>
      <div class='dialog-content'>{props.children}</div>
    </div>
  );
};

export default DialogContent;

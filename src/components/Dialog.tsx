import type { Vec2 } from '@sledge-pdm/core';
import { type Component, type JSX, Show, createSignal, onCleanup, onMount } from 'solid-js';
import { Portal } from 'solid-js/web';
import '../styles/Dialog.css';

export interface DialogProps {
  title?: string;
  zIndex?: number;
  modal?: boolean;
  initialPosition?: Vec2;
  onClose?: () => void;
  children: JSX.Element;
}

const DEFAULT_Z_INDEX = 2000; // --zindex-dialog

const Dialog: Component<DialogProps> = (props) => {
  let dialogRef: HTMLDivElement | undefined;

  const [position, setPosition] = createSignal<Vec2>({ x: 0, y: 0 });

  const clampPos = (x: number, y: number): Vec2 => {
    if (!dialogRef) return { x, y };
    return {
      x: Math.max(0, Math.min(x, window.innerWidth - dialogRef.offsetWidth)),
      y: Math.max(0, Math.min(y, window.innerHeight - dialogRef.offsetHeight)),
    };
  };

  const onResize = () => {
    setPosition((p) => clampPos(p.x, p.y));
  };

  onMount(() => {
    if (props.initialPosition) {
      setPosition(clampPos(props.initialPosition.x, props.initialPosition.y));
    } else if (dialogRef) {
      setPosition(clampPos((window.innerWidth - dialogRef.offsetWidth) / 2, (window.innerHeight - dialogRef.offsetHeight) / 2));
    }
    window.addEventListener('resize', onResize);
  });

  const drag = {
    pointerId: null as number | null,
    lastX: 0,
    lastY: 0,
  };

  const onPointerMove = (e: PointerEvent) => {
    if (drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.lastX;
    const dy = e.clientY - drag.lastY;
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
    setPosition((p) => clampPos(p.x + dx, p.y + dy));
  };

  const onDragEnd = (e: PointerEvent) => {
    if (drag.pointerId !== e.pointerId) return;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onDragEnd);
    window.removeEventListener('pointercancel', onDragEnd);
    drag.pointerId = null;
  };

  const onTitlebarPointerDown = (e: PointerEvent) => {
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
    window.removeEventListener('resize', onResize);
    if (drag.pointerId !== null) {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onDragEnd);
      window.removeEventListener('pointercancel', onDragEnd);
      drag.pointerId = null;
    }
  });

  const zIndex = () => props.zIndex ?? DEFAULT_Z_INDEX;

  return (
    <Portal>
      <Show when={props.modal}>
        <div class='dialog-backdrop' style={{ 'z-index': zIndex() - 1 }} />
      </Show>
      <div
        ref={(el) => (dialogRef = el)}
        class='dialog-root'
        style={{
          left: `${position().x}px`,
          top: `${position().y}px`,
          'z-index': zIndex(),
        }}
      >
        <div class='dialog-background' />
        <div class='dialog-titlebar' onPointerDown={onTitlebarPointerDown}>
          <span class='dialog-title'>{props.title}</span>
          <div class='dialog-titlebar-spacer' />
          <Show when={props.onClose}>
            <div class='dialog-close-btn' onClick={props.onClose}>
              ×
            </div>
          </Show>
        </div>
        <div class='dialog-content'>{props.children}</div>
      </div>
    </Portal>
  );
};

export default Dialog;

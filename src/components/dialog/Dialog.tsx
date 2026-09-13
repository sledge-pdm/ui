import type { Vec2 } from '@sledge-pdm/core';
import { type Component, type JSX, createSignal, onCleanup, onMount } from 'solid-js';
import { Portal } from 'solid-js/web';
import '../../styles/Dialog.css';
import DialogContent from './DialogContent';

export interface DialogProps {
  title?: string;
  zIndex?: number;
  backgroundOpacity?: number;
  initialPosition?: Vec2;
  onClose?: () => void;
  children: JSX.Element;
}

const DEFAULT_Z_INDEX = 2000; // --zindex-dialog

const Dialog: Component<DialogProps> = (props) => {
  let positionerRef: HTMLDivElement | undefined;

  const [position, setPosition] = createSignal<Vec2>({ x: 0, y: 0 });

  const clampPos = (x: number, y: number): Vec2 => {
    if (!positionerRef) return { x, y };
    return {
      x: Math.max(0, Math.min(x, window.innerWidth - positionerRef.offsetWidth)),
      y: Math.max(0, Math.min(y, window.innerHeight - positionerRef.offsetHeight)),
    };
  };

  const onResize = () => {
    setPosition((p) => clampPos(p.x, p.y));
  };

  onMount(() => {
    if (props.initialPosition) {
      setPosition(clampPos(props.initialPosition.x, props.initialPosition.y));
    } else if (positionerRef) {
      setPosition(clampPos((window.innerWidth - positionerRef.offsetWidth) / 2, (window.innerHeight - positionerRef.offsetHeight) / 2));
    }
    window.addEventListener('resize', onResize);
  });

  onCleanup(() => {
    window.removeEventListener('resize', onResize);
  });

  const zIndex = () => props.zIndex ?? DEFAULT_Z_INDEX;

  return (
    <Portal>
      <div
        ref={(el) => (positionerRef = el)}
        class='dialog-root'
        style={{
          left: `${position().x}px`,
          top: `${position().y}px`,
          'z-index': zIndex(),
        }}
      >
        <DialogContent title={props.title} onClose={props.onClose} backgroundOpacity={props.backgroundOpacity} movable>
          {props.children}
        </DialogContent>
      </div>
    </Portal>
  );
};

export default Dialog;

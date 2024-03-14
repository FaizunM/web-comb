import React, {
  CanvasHTMLAttributes,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { WebDot } from "./webdot";

/**
 * Interface untuk CobWeb
 */
export interface CobWebInterface
  extends CanvasHTMLAttributes<HTMLCanvasElement> {
  props?: CanvasHTMLAttributes<HTMLCanvasElement>;
}

/**
 *
 * @param {CobWebInterface} props - attribute
 * @returns
 */
export const CobWeb: React.FC<CobWebInterface> = ({
  ...props
}: CobWebInterface) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [MousePos, setMousePos] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [WebDots, setWebDots] = useState<WebDot[]>([]);

  /**
   * Mendapatkan random position berdasarkan max dan min position
   * @param {number} xmax - position x max
   * @param {number} ymax - position y max
   * @param {number} xmin - position x min
   * @param {number} ymin - position y min
   * @returns
   */
  const getRandomPos = (
    xmax: number,
    ymax: number,
    xmin: number = 0,
    ymin: number = 0
  ) => {
    const xaxis = Math.floor(Math.random() * (xmax - xmin + 1) + xmin);
    const yaxis = Math.floor(Math.random() * (ymax - ymin + 1) + ymin);
    return { x: xaxis, y: yaxis };
  };

  /**
   * Mendapatkan canvas ref
   */
  const getCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return canvas;
  }, []);

  /**
   * Mendapatkan canvas context
   */
  const getContext = useCallback(() => {
    const context = getCanvas()?.getContext("2d");
    if (!context) return;
    return context;
  }, [getCanvas]);

  /**
   * Menangani mouse enter
   * @param {MouseEvent<HTMLCanvasElement>} event - MouseEvent
   */
  const onMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    event;
  };

  /**
   * Menangani mouse move
   * @param {MouseEvent<HTMLCanvasElement>} event - MouseEvent
   */
  const onMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const canvas = getCanvas();
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const pos = {
      x: event.pageX - rect.left - window.scrollX,
      y: event.pageY - rect.top - window.scrollY,
    };
    setMousePos(pos);
  };

  /**
   * Menangani mouse up
   * @param {MouseEvent<HTMLCanvasElement>} event - MouseEvent
   */
  const onMouseUp = (event: MouseEvent<HTMLCanvasElement>) => {
    event;
  };

  useEffect(() => {
    const context = getContext();
    if (!context) return;

    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;

    const interval = setInterval(() => {
      if (WebDots.length > 100) {
        clearInterval(interval);
        return;
      }
      setWebDots((prev) => [
        ...prev,
        new WebDot(getRandomPos(canvasWidth, canvasHeight)),
      ]);
    }, 50);
    return () => clearInterval(interval);
  }, [getContext, WebDots]);

  useEffect(() => {
    const context = getContext();
    if (!context) return;

    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;

    const render = () => {
      // clear canvas
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      // draw mouse axis
      context.lineWidth = 0.5;
      context.setLineDash([5, 5]);
      context.strokeStyle = "#f6f6f6";
      // axis x
      context.beginPath();
      context.moveTo(MousePos.x, 0);
      context.lineTo(MousePos.x, canvasHeight);
      context.stroke();
      context.closePath();

      // axis y
      context.beginPath();
      context.moveTo(0, MousePos.y);
      context.lineTo(canvasWidth, MousePos.y);
      context.stroke();
      context.closePath();
      context.setLineDash([0, 0]);

      // render component
      for (let index = 0; index < WebDots.length; index++) {
        WebDots[index].render(context);
        const collisions = WebDots[index].collision(60, WebDots);
        if (collisions !== null) {
          for (let colidx = 0; colidx < collisions.length; colidx++) {
            WebDots[index].createLine(
              context,
              WebDots[collisions[colidx]].position
            );
          }
        }
        if (WebDots[index].checkObjectPosition(120, MousePos)) {
          WebDots[index].createLine(context, MousePos);
        }
      }
    };

    const animationFrame = setInterval(() => render());

    return () => clearInterval(animationFrame);
  }, [getContext, WebDots, MousePos]);

  useEffect(() => {
    const context = getContext();
    if (!context) return;

    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;

    const interval = setInterval(() => {
      for (let x = 0; x < WebDots.length; x++) {
        WebDots[x].randomMove(canvasWidth, canvasHeight);
        if (WebDots[x].checkObjectPosition(30, MousePos)) {
          WebDots[x].collided = true;
        } else {
          WebDots[x].collided = false;
        }
      }
    }, 0);
    return () => {
      clearInterval(interval);
    };
  }, [getContext, MousePos, WebDots]);

  return (
    <canvas
      {...props}
      ref={canvasRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    />
  );
};

/**
 * WebCob Component
 */
export class WebDot {
  position: {
    x: number;
    y: number;
  };
  moveDirection: {
    x: number;
    y: number;
  };
  step: number;
  collided: boolean;

  constructor(position: { x: number; y: number }) {
    this.position = position;
    this.moveDirection = { x: 0, y: 0 };
    this.step = 0;
    this.collided = false;
  }

  /**
   * Mendapatkan random position berdasarkan max dan min position
   * @param {number} max - arah
   * @param {number} min - arah
   * @returns
   */
  getRandomPos = (max: number, min: number) => {
    const xaxis = Math.floor(Math.random() * (max - min + 1) + min);
    const yaxis = Math.floor(Math.random() * (max - min + 1) + min);
    return { x: xaxis, y: yaxis };
  };

  /**
   * Menangani gerak acak titik
   * @param {number} maxposx - max position untuk x
   * @param {number} maxposy - max position untuk y
   * @param {number} minposx - min position untuk x
   * @param {number} minposy - min position untuk y
   */
  randomMove(
    maxposx: number,
    maxposy: number,
    minposx: number = 0,
    minposy: number = 0
  ) {
    if (this.position.x < minposx) {
      this.position.x = minposx;
      this.moveDirection.x = -this.moveDirection.x;
    }
    if (this.position.y < minposy) {
      this.moveDirection.y = -this.moveDirection.y;
      this.position.y = minposy;
    }
    if (this.position.x > maxposx) {
      this.position.x = maxposx;
      this.moveDirection.x = -this.moveDirection.x;
    }
    if (this.position.y > maxposy) {
      this.moveDirection.y = -this.moveDirection.y;
      this.position.y = maxposy;
    }
    this.position.x += this.moveDirection.x * 0.5;
    this.position.y += this.moveDirection.y * 0.5;

    if (this.step >= 200) {
      const posdir = this.getRandomPos(1, -1);

      this.moveDirection.x = posdir.x;
      this.moveDirection.y = posdir.y;
      this.step = 0;
    }
    this.step += 1;
  }

  /**
   * Render dot
   * @param {CanvasRenderingContext2D} context - context canvas
   */
  render(context: CanvasRenderingContext2D) {
    // draw dot
    context.fillStyle = "#fff";
    context.beginPath();
    context.arc(this.position.x, this.position.y, 1, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  }

  /**
   * Check apakah target berada pada area
   * @param {number} areaDistance - lingkup area
   * @param position
   * @returns
   */
  checkObjectPosition = (
    areaDistance: number,
    position: { x: number; y: number }
  ) => {
    const distance = Math.sqrt(
      Math.pow(position.x - this.position.x, 2) +
        Math.pow(position.y - this.position.y, 2)
    );

    if (distance <= areaDistance) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Membuat garis line ke target
   * @param context
   * @param position
   */
  createLine(
    context: CanvasRenderingContext2D,
    position: { x: number; y: number }
  ) {
    context.strokeStyle = "white";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(this.position.x, this.position.y);
    context.lineTo(position.x, position.y);
    context.stroke();
    context.closePath();
  }

  /**
   * Cek apakah titik bertabrakan dengan object lain
   * @param distance
   * @param arrays
   * @returns
   */
  collision(distance: number, arrays: WebDot[]) {
    const collised = [];
    for (let x = 0; x < arrays.length; x++) {
      if (this.checkObjectPosition(distance, arrays[x].position)) {
        collised.push(x);
      }
    }
    return collised;
  }
}

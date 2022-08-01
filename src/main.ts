// import "./style.css";

function color(x: number) {
  return 0.5 * Math.cos(2 * Math.PI * x) + 0.5;
}

function slope(x: number) {
  return 0.5 * Math.cos(2 * Math.PI * x);
}

function H(x: number) {
  return -0.1 * Math.sin(2 * Math.PI * x);
}

class HCONN {
  collection = [new HCO(150, 0), new HCO(300, 0.25)];

  step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.collection[0].step(this.collection[1].p - this.collection[0].p);
    this.collection[1].step(this.collection[0].p - this.collection[1].p);
  }
}

class HCO {
  p = 0;
  r = 0.5;
  omega = 2;
  x = 150;
  dt = 0.01;

  constructor(x: number, p: number) {
    this.x = x;
    this.p = p;
    this.r = (p + 0.5) % 1;
  }

  update(phi: number) {
    this.p = (this.dt * (this.omega + H(phi)) + this.p) % 1;

    this.r = (this.p + 0.5) % 1;
  }

  animate() {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    let p_1 = color(this.p);
    let r_1 = color(this.r);
    // console.log(p_1);

    ctx.fillStyle = `rgba(0,255,0,${p_1})`;
    ctx.beginPath();
    ctx.ellipse(this.x, 100, 50, 50, 0, -Math.PI, Math.PI);
    ctx.stroke();
    ctx.fill();

    // console.log(this.r);
    ctx.fillStyle = `rgba(0,255,0,${r_1})`;
    ctx.beginPath();
    ctx.ellipse(this.x, 225, 50, 50, 0, -Math.PI, Math.PI);
    ctx.stroke();
    ctx.fill();

    // Matrix transformation
    ctx.translate(this.x, 300);
    ctx.rotate(slope(this.p));
    ctx.translate(-this.x, -300);

    // Rotated rectangle
    ctx.fillStyle = "red";
    ctx.fillRect(this.x - 5, 300, 10, 140);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // ctx.rotate(Math.PI * 1.5);
    // console.log(slope(this.p));

    // ctx.rect(140, 290, 20, 100);
    // ctx.translate(140, 290);
    // ctx.rotate(Math.PI);s
    ctx.stroke();
  }
  step(phi: number) {
    this.update(phi);
    this.animate();
    // setTimeout(this.step, 500);
  }
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

let h = new HCONN();
function stp() {
  h.step();
  setTimeout(stp, 25);
}
stp();

// h.step();

// h.step();
// setInterval(() => {
//   h.step();
// }, 500);

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
export {};

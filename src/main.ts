// import "./style.css";

function color(x: number) {
  return 0.5 * Math.cos(2 * Math.PI * x) + 0.5;
}

function slope(x: number) {
  return 0.5 * Math.cos(2 * Math.PI * x);
}

class HCONN {
  collection = [
    new HCO(150, 0),
    new HCO(300, 0.25),
    new HCO(450, 0.5),
    new HCO(600, 0.75),
  ];

  step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < this.collection.length; x++) {
      const y = this.collection[x];

      y.step();
    }
  }
}

class HCO {
  p = 0;
  r = 0.5;
  omega = 0.1;
  x = 150;

  constructor(x: number, p: number) {
    this.x = x;
    this.p = p;
    this.r = (p + 0.5) % 1;
  }

  update() {
    this.p = (this.omega + this.p) % 1;

    this.r = (this.omega + this.r) % 1;
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

    // ctx.translate(145, 100);
    // ctx.rotate(slope(this.p));
    // ctx.fillStyle = "red";
    // ctx.fillRect(145, 300, 10, 80);
    // ctx.fillStyle = "red";

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // ctx.rotate(Math.PI * 1.5);
    // console.log(slope(this.p));

    // ctx.rect(140, 290, 20, 100);
    // ctx.translate(140, 290);
    // ctx.rotate(Math.PI);s
    ctx.stroke();
  }
  step() {
    this.update();
    this.animate();
    // setTimeout(this.step, 500);
  }
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

let h = new HCONN();
function stp() {
  h.step();
  setTimeout(stp, 100);
}
stp();

// h.step();

// h.step();
// setInterval(() => {
//   h.step();
// }, 500);

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
export {};

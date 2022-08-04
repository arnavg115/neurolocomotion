// import "./style.css";
import katex from "katex";
import Chart from "chart.js/auto";

// const labels = ["January", "February", "March", "April", "May", "June"];
// const ctx2 = document.getElementById("myChart") as HTMLCanvasElement

let element = document.getElementById("formula")!;
katex.render("\\phi = \\theta_2 - \\theta_1", element, {
  throwOnError: false,
});

function color(x: number) {
  return 0.5 * Math.cos(2 * Math.PI * x) + 0.5;
}

function slope(x: number) {
  return 0.5 * Math.cos(2 * Math.PI * x);
}

function G(x: number) {
  if (x < 0) {
    let y = 1 + x;
    return -y * (y - 0.25) * (y - 1);
  }
  return -x * (x - 0.25) * (x - 1);
}

class HCONN {
  collection = [
    new HCO(150, 0.0, 1),
    new HCO(300, 0.5, 2),
    new HCO(450, 0.3, 3),
    new HCO(600, 0.9, 4),
  ];
  phi_calc() {
    let out: number[] = [];
    for (let x = 0; x < this.collection.length - 1; x++) {
      out.push(this.collection[x + 1].p - this.collection[x].p);
    }
    return out;
  }

  step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let phi = this.phi_calc();
    katex.render(this.phi_to_katex(phi), element, {
      throwOnError: false,
    });
    this.collection[0].step(phi[0]);
    this.collection[1].step(-phi[0], 0.5, G(phi[1] % 1));
    this.collection[2].step(-phi[1], 0.5, G(phi[2] % 1));
    this.collection[3].step(-phi[2], 0.5);
  }
  phi_to_katex(phi: number[]) {
    let out = "";
    for (let x = 0; x < phi.length; x++) {
      const y = phi[x];
      out += String.raw`\phi_${x + 1} = \theta_${x + 2} - \theta_${
        x + 1
      } =${Math.abs(y).toFixed(2)}\\ `;
    }
    return out;
  }

  reset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.collection.forEach((x) => {
      x.reset();
      x.animate();
    });
    const phi = this.phi_calc();
    katex.render(this.phi_to_katex(phi), element, {
      throwOnError: false,
    });
  }
}

class HCO {
  p = 0;
  r = 0.5;
  omega = 2;
  x = 150;
  dt = 0.01;
  ogp = 0;
  n = 0;

  constructor(x: number, p: number, n: number) {
    this.x = x;
    this.p = p;
    this.ogp = p;
    this.n = n;

    this.r = (p + 0.5) % 1;
  }

  update(phi: number, anti: number, other: number) {
    // console.log(G(phi + 0.5));

    this.p = this.dt * (this.omega + G((phi + anti) % 1) + other) + this.p;

    this.r = this.p + 0.5;
  }

  animate() {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    let p_1 = color(this.p % 1);
    let r_1 = color(this.r % 1);
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
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.font = "24px sans-serif";
    ctx.fillText(`Θ${this.n}`, this.x - 10, 105);

    // Matrix transformation
    ctx.translate(this.x, 300);
    ctx.rotate(slope(this.p % 1));
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
  step(phi: number, anti = 0, other = 0) {
    this.update(phi, anti, other);
    this.animate();
    // setTimeout(this.step, 500);
  }
  reset() {
    this.p = this.ogp;
    this.r = (this.ogp + 0.5) % 1;
    // this.animate();
    // console.log(this.ogp);
  }
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

let h = new HCONN();

let y = setInterval(() => {
  h.step();
}, 25);

let el = document.getElementById("pause");
let reset = document.getElementById("reset");

let playing = true;

el?.addEventListener("click", () => {
  if (playing) {
    clearInterval(y);
    playing = false;
    el!.innerText = "play";
  } else {
    playing = true;
    y = setInterval(() => {
      h.step();
    }, 25);
    el!.innerText = "pause";
  }
});

reset?.addEventListener("click", () => {
  h.reset();

  clearInterval(y);
  el!.innerText = "play";
  playing = false;
});

export {};

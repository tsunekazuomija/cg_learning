function setup() {
    createCanvas(windowWidth, windowHeight);
    stroke(240);
    translate(width/2, height/2);

    const a = {x: 300, y: 0};
    const b = {x: 100, y: 100};
    const c = {x: -100, y: -100};
    const d = {x: -300, y: 0};

    drawCircle(a);
    drawCircle(b);
    drawCircle(c);
    drawCircle(d);

    drawCatmullRomSprine(a, b, c, d);
}

function drawCircle(pos) {
    push();
    strokeWeight(2);
    fill("#292a33");
    circle(pos.x, pos.y, 10);
    pop();
}

// todo: push, popとは？？

function drawCatmullRomSprine(a, b, c, d) {
    let prev = a;
    const n = 100;
    for (let i=0; i <= n; i++) {
        const t = i/n;
        const e = my_lerp2d(a,b,t,0,1/4);
        const f = my_lerp2d(b,c,t,1/4,3/4);
        const g = my_lerp2d(c, d, t, 3/4, 1);

        const h = my_lerp2d(e, f, t, 0, 3/4);
        const j = my_lerp2d(f, g, t, 1/4, 1);

        const k = my_lerp2d(h, j, t, 0, 1);
        line(prev.x, prev.y, k.x, k.y);

        prev = k;
    }
}

function my_lerp(p0, p1, t, t0, t1) {
    return (1 - (t - t0)/(t1 - t0))*p0 + (t-t0)/(t1-t0)*p1;
}

function my_lerp2d(a, b, t, t0, t1) {
    return {x: my_lerp(a.x, b.x, t, t0, t1), y: my_lerp(a.y, b.y, t, t0, t1)};
}
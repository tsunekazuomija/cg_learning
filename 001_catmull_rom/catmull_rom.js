mouse_radius = 50;

const p_array = [
    {x: 300, y: 0},
    {x: 100, y: 100},
    {x: -100, y: -100},
    {x: -300, y: 0}
]

function setup() {
    createCanvas(800, 600);
    stroke(240);
    translate(width/2, height/2);

    for (let i=0; i < p_array.length; i++) {
        drawCircle(p_array[i]);
    }

    drawCatmullRomSprine(p_array);
}

function draw() {

    if (mouseIsPressed) {
        movePoints();
    }


    clear();
    translate(width/2, height/2);

    strokeWeight(2);
    noFill();
    circle(mouseX- width/2, mouseY - height/2, mouse_radius*2);

    for (let i=0; i < p_array.length; i++) {
        drawCircle(p_array[i]);
    }

    drawCatmullRomSprine(p_array);
}

// マウスと点の最短距離を求め、その距離がmouse_radiusより小さければ、その点を移動する
function movePoints() {
    const mouse_pos = {x: mouseX - width/2, y: mouseY - height/2};
    // const mouse_pos = {x:mouseX, y:mouseY};

    let nearest = 0;
    let min_dist = distance(mouse_pos, p_array[0]);

    for (let i=1; i < p_array.length; i++) {
        const dist = distance(mouse_pos, p_array[i]);
        if (dist < min_dist) {
            nearest = i;
            min_dist = dist;
        }
    }


    if (min_dist < mouse_radius) {
        
        p_array[nearest] = mouse_pos;
    }
}

function drawCircle(pos) {
    push();
    strokeWeight(2);
    fill("#292a33");
    circle(pos.x, pos.y, 10);
    pop();
}

// todo: push, popとは？？

function drawCatmullRomSprine(p_arr) {
    let prev = p_arr[0];

    const dist_01 = distance(p_arr[0], p_arr[1]);
    const dist_12 = distance(p_arr[1], p_arr[2]);
    const dist_23 = distance(p_arr[2], p_arr[3]);
    const dist_all = dist_01 + dist_12 + dist_23;

    const n = 500;
    for (let i=0; i <= n; i++) {
        const t = i/n;
        const e = my_lerp2d(p_arr[0], p_arr[1], t, 0, dist_01/dist_all);
        const f = my_lerp2d(p_arr[1], p_arr[2], t, dist_01/dist_all, (dist_01 + dist_12)/dist_all);
        const g = my_lerp2d(p_arr[2], p_arr[3], t, (dist_01 + dist_12)/dist_all, 1);

        const h = my_lerp2d(e, f, t, 0, (dist_01 + dist_12)/dist_all);
        const j = my_lerp2d(f, g, t, dist_01/dist_all, 1);

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

function distance(a, b) {
    return Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2)
}

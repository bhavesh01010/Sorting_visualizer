class column {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.queue = [];
    }
    moveTo(loc, framecount = 100) {
        for (let i = 1; i <= framecount; i++) {
            const t = i / framecount;
            this.queue.push({
                x: lerp(this.x, loc.x, t),
                y: lerp(this.y, loc.y, t)
            });
        }
    }
    jump(framecount=100){
        for(let i=0; i<=framecount;i++){
            let t=i/framecount;
            let u=Math.sin(t*Math.PI);
            this.queue.push({
                x:this.x,
                y:this.y-u*this.width,
            });
        }
    }
    draw(ctx) {
        let changed = false
        if (this.queue.length > 0) {
            const { x, y } = this.queue.shift();
            this.x = x;
            this.y = y;
            changed = true;
        }
        const top = this.y - this.height;
        const left = this.x - (this.width / 2);
        const right = this.x + (this.width / 2);
        ctx.beginPath();
        ctx.fillStyle = "rgb(150,150,150)";
        ctx.moveTo(left, top);
        ctx.lineTo(left, this.y);
        ctx.ellipse(this.x, this.y, this.width / 2, this.width / 4, 0, Math.PI, Math.PI * 2, true);
        ctx.lineTo(right, top);
        ctx.ellipse(this.x, top, this.width / 2, this.width / 4, 0, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        return changed;
    }
}
const canvas = document.getElementById('c');
const ctx = canvas.getContext("2d");
const n = 20;
const array = [];
const margin = 30;
canvas.width = 500;
canvas.height = 400;
let moves = [];
canvas.width = 500;
canvas.height = 400;
const cols = [];
const spacing = (canvas.width - margin * 2) / n;
const maxcolumnheight = 300;
randomize();
function randomize() {
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    moves = [];
    for (let i = 0; i < array.length; i++) {
        const x = (i * spacing) + (spacing / 2) + margin;
        const y = canvas.height - margin - i * 3;
        const width = spacing - 4;
        const height = maxcolumnheight * array[i];
        cols[i] = new column(x, y, width, height);
    }
}
function lerp(a, b, t) {
    return a + (b - a) * t;
}
function play() {
    moves = bubblesort(array);
}
function play2() {
    moves = selectionSort(array);
}
function bubblesort(array) {
    const moves = [];
    do {
        var swapped = false;
        for (let i = 1; i < array.length; i++) {
            if (array[i - 1] > array[i]) {
                swapped = true;
                [array[i - 1], array[i]] = [array[i], array[i - 1]];
                moves.push({
                    indices: [i - 1, i], swap: true
                });
            } else {
                moves.push({
                    indices: [i - 1, i], swap: false
                });
            }
        }
    } while (swapped);
    return moves;
}
function selectionSort(array) {
    const moves = [];
    var i, j, min_idx;
    for (i = 0; i < array.length - 1; i++) {
        min_idx = i;
        for (j = i + 1; j < array.length; j++)
            if (array[j] < array[min_idx])
                min_idx = j;
        if (min_idx != i) {
            [array[min_idx], array[i]] = [array[i], array[min_idx]];
            moves.push({
                indices: [min_idx, i],
                swap: true
            });
            console.log(min_idx);
        }
    }
    return moves;
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let changed = false;
    for (let i = 0; i < cols.length; i++) {
        changed = cols[i].draw(ctx) || changed;
    }
    if (!changed && moves.length > 0) {
        const move = moves.shift();
        const [i, j] = move.indices;
        if (move.swap) {
            // cols[i].change_color();
            cols[i].moveTo(cols[j]);
            cols[j].moveTo(cols[i]);
            [cols[i], cols[j]] = [cols[j], cols[i]];
        } else {
            cols[i].jump();
            cols[j].jump();
        }
    }
    requestAnimationFrame(animate);
}
animate();
let canvas = document.querySelector("#canvas");
let canvas1 = document.querySelector("#hodograph-canvas");
let hodograph_ctx = canvas1.getContext('2d');
let bezier_ctx = canvas.getContext('2d');
let POINTS = [];
const SEGMENTS = 200;


HodographControlPoints = () => {
    let HodographCP = [];
    if (POINTS.length === 0)
        return;
    if (POINTS.length === 1) {
        return arr[0];
    }
    for (let i = 1; i < POINTS.length; i++) {
        HodographCP.push({
            x: POINTS[i].x - POINTS[i - 1].x,
            y: POINTS[i].y - POINTS[i - 1].y
        });
    }
    let maxX = HodographCP[0].x;
    let minX = HodographCP[0].x;
    let maxY = HodographCP[0].y;
    let minY = HodographCP[0].y;
    for (let i = 1; i < HodographCP.length; i++) {
        if (HodographCP[i].x > maxX)
            maxX = HodographCP[i].x;
        if (HodographCP[i].x < minX)
            minX = HodographCP[i].x;
        if (HodographCP[i].y > maxY)
            maxY = HodographCP[i].y;
        if (HodographCP[i].y < minY)
            minY = HodographCP[i].y;
    }

    const scale = Math.max(maxX - minX, maxY - minY);
    for (let i = 0; i < HodographCP.length; i++) {
        HodographCP[i].x -= (maxX + minX) / 2;
        HodographCP[i].y -= (maxY + minY) / 2;
        HodographCP[i].x /= 2;
        HodographCP[i].y /= 2;
        HodographCP[i].x += 250;
        HodographCP[i].y += 250;

    }
   // console.log(HodographCP);
   // console.log(maxX);
   // console.log(minX);
   // console.log(maxY);
   // console.log(minY);
    return HodographCP;
}

onLeftClick = (e) => {
    canvas.addEventListener('contextmenu', e => e.preventDefault())
    if (e.button !== 2) {
        return;
    }
    let rect = canvas.getBoundingClientRect();
    let closest_index;
    for (let i = 0; i < POINTS.length; i++) {
        let a = POINTS[i].x - (e.clientX - rect.left);
        let b = POINTS[i].y - (e.clientY - rect.top);
        let c = Math.hypot(a, b);
        if (c < 30) {
            closest_index = i;
            //console.log(POINTS[i]);
            break;
        }
    }
    onDrag = (e) => {
        POINTS[closest_index].x = e.clientX - rect.left;
        POINTS[closest_index].y = e.clientY - rect.top;
        update(bezier_ctx, POINTS);
        update(hodograph_ctx, HodographControlPoints());
    }
    canvas.addEventListener("mousemove", onDrag);

    canvas.addEventListener("mouseup", e => {
        canvas.removeEventListener("mousemove", onDrag);
        // canvas.removeEventListener("click",onClick);

    });
}

interpolate = (p1, p2, t) => {
    let new_point = {
        x: p1.x + (p2.x - p1.x) * t,
        y: p1.y + (p2.y - p1.y) * t
    };

    return new_point;
}

deCasteljau = (arr, t) => {
   
    if (arr.length === 0)
        return;
    if (t === 0 || arr.length === 1) {
        return arr[0];
    }
    if (t === 0.5)
    //     console.log(arr);
    if (t === 1) 
        return arr[arr.length - 1];

    let interpolated = [];
    //console.log(interpolated);
    for (let i = 1; i < arr.length; i++) {
        interpolated.push(interpolate(arr[i - 1], arr[i], t));
    };
   
   //console.log
    return deCasteljau(interpolated, t);
}
compute = (arr) => {
    let t;
    let curvePoints = [SEGMENTS];
    for (let i = 0; i < SEGMENTS; i++) {
        t = i / SEGMENTS;
        curvePoints[i] = deCasteljau(arr, t);
    }
    return curvePoints;
}

draw = (arr, color, context) => {
    let curvePoints1 = compute(arr);
    // console.log(curvePoints);
    // console.log(curvePoints1)
    context.beginPath();
    for (let i = 1; i < SEGMENTS; i++) {
        context.moveTo(curvePoints1[i - 1].x, curvePoints1[i - 1].y);
        context.lineTo(curvePoints1[i].x, curvePoints1[i].y);
    };

    context.lineWidth = 2;
    context.strokeStyle = color;
    context.stroke();
    context.closePath();
}
const update = (context, pointArr) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    // Draw the shape
    context.translate(0.5,0.5);
    context.strokeStyle = "#cc6699";
    context.lineWidth = 1

    context.beginPath();
    pointArr.forEach((point, index, arr) => {
        if (arr.length > 1) {

            if (index == 0)
                context.moveTo(point.x, point.y);

            if (index != arr.length - 1)
                context.lineTo(arr[index + 1].x, arr[index + 1].y);


        }
    });
    context.stroke();


    pointArr.forEach((point, index, arr) => {
        context.beginPath();
        context.arc(point.x, point.y, 3, 0, 2 * Math.PI,true);
        context.fillStyle = '#cc6699';
        context.fill();
        context.font = '20px ariel';
        context.fillText('b',point.x+3,point.y+3);
        context.font = '10px ariel';
        context.fillText(index, point.x+13,point.y+6);
    });
    context.closePath();
context.restore();
    draw(POINTS, '#786D60', bezier_ctx);

    draw(HodographControlPoints(), '#556b85', hodograph_ctx);


}



canvas.addEventListener("mousedown", onLeftClick);
onClick = (e) => {

    const rect = canvas.getBoundingClientRect();

    POINTS.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    });

    //console.log(POINTS);

    update(bezier_ctx, POINTS);
    update(hodograph_ctx, HodographControlPoints());
}
canvas.addEventListener("click", onClick);
document.addEventListener('keydown', event => {
    if (event.keyCode === 67) 
    location.reload();
})
update(bezier_ctx, POINTS);
update(hodograph_ctx, HodographControlPoints());


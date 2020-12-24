let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext('2d');
let Points = [];
const SEGMENTS = 100;

HodographControlPoints = (Points) => {
    let HodographCP = [];
    if (Points.length === 0)
    return;
    if (Points.length === 1) {
        return Points[0];
    }
    for (let i = 1; i < Points.length; i++) {
        HodographCP.push({x: Points[i].x - Points[i-1].x,
        y: Points[i].y - Points[i - 1].y});
    }
    console.log(HodographCP);
    return HodographCP;
}

onLeftClick = (e) => {
    canvas.addEventListener('contextmenu', e => e.preventDefault())
   if (e.button !== 2) {
       return;
   }
    let closest_index;
    for (let i = 0; i < Points.length; i++) {
        let a = Points[i].x - e.offsetX;
        let b = Points[i].y - e.offsetY;
        let c = Math.hypot(a,b);
        if (c < 30) {
            closest_index = i;
            console.log(Points[i]);
            break;
        }
    }
    onDrag = (e) => {
        Points[closest_index].x = e.offsetX;
        Points[closest_index].y = e.offsetY;
        update();
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

deCasteljau = (Points, t) => {
    if (Points.length === 0)
        return;
    if (t === 0 || Points.length === 1)
        return Points[0];
    if (t === 1)
        return Points[Points.length - 1];

    let interpolated = [];
    //console.log(interpolated);
    for (let i = 1; i < Points.length; i++) {
        interpolated.push(interpolate(Points[i - 1], Points[i], t))
    };

    //console.log(interpolated);
    return deCasteljau(interpolated, t);
}
compute = (Points) => {
    let t;
    let curvePoints = [SEGMENTS];
    for (let i = 0; i < SEGMENTS; i++) {
        t = i / SEGMENTS;
        curvePoints[i] = deCasteljau(Points, t);
    }
    return curvePoints;
}

draw = (Points,color) => {
    let curvePoints1 = compute(Points);
    // console.log(curvePoints);
    // console.log(curvePoints1)
    ctx.beginPath();
    for (let i = 1; i < SEGMENTS; i++) {
        ctx.moveTo(curvePoints1[i - 1].x, curvePoints1[i - 1].y);
        ctx.lineTo(curvePoints1[i].x, curvePoints1[i].y);
    };

    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
}
const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the shape
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    Points.forEach((point, index, arr) => {
        if (arr.length > 1) {

            if (index == 0)
                ctx.moveTo(point.x, point.y);

            if (index != arr.length - 1)
                ctx.lineTo(arr[index + 1].x, arr[index + 1].y);


        }
    });
    
    ctx.stroke();

    // Draw the dots, this should be done last due to then they are above the path
    Points.forEach((point, index, arr) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
        ctx.fill();
    });
    ctx.closePath();


    draw(Points,'#4ec91d');
    //console.log(curvePoints);
    draw(HodographControlPoints(Points),'#1d4bc9');

}
canvas.addEventListener("mousedown", onLeftClick);
onClick = (e) => {
    
    Points.push({ x: e.offsetX, y: e.offsetY });

    console.log(Points);

    update();
}
canvas.addEventListener("click", onClick);

update();
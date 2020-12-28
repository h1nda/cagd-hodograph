let canvas = document.querySelector("#canvas");
let canvas1 = document.querySelector("#hodograph-canvas");
let ctx1 = canvas1.getContext('2d');
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
        HodographCP.push({x: Points[i].x - Points[i-1].x + 250,
        y: Points[i].y - Points[i - 1].y + 250});
    }
    console.log(HodographCP);
    return HodographCP;
}

onLeftClick = (e) => {
    canvas.addEventListener('contextmenu', e => e.preventDefault())
   if (e.button !== 2) {
       return;
   }
   let rect = canvas.getBoundingClientRect();
    let closest_index;
    for (let i = 0; i < Points.length; i++) {
        let a = Points[i].x - ((e.clientX - rect.left) / (rect.right - rect.left) * canvas.width);
        let b = Points[i].y - ((e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);
        let c = Math.hypot(a,b);
        if (c < 30) {
            closest_index = i;
            console.log(Points[i]);
            break;
        }
    }
    onDrag = (e) => {
        Points[closest_index].x = (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
        Points[closest_index].y = (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
        update(ctx,Points);
    update(ctx1,HodographControlPoints(Points));
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

draw = (Points,color,context) => {
    let curvePoints1 = compute(Points);
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
const update = (context, Points1) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the shape
    context.strokeStyle = "#000";
    context.beginPath();
    Points1.forEach((point, index, arr) => {
        if (arr.length > 1) {

            if (index == 0)
                context.moveTo(point.x, point.y);

            if (index != arr.length - 1)
                context.lineTo(arr[index + 1].x, arr[index + 1].y);


        }
    });
    
    context.stroke();

    // Draw the dots, this should be done last due to then they are above the path
    Points1.forEach((point, index, arr) => {
        context.beginPath();
        context.arc(point.x, point.y, 2, 0, 2 * Math.PI);
        context.fill();
    });
    ctx.closePath();


    draw(Points,'#4ec91d',ctx);
    //console.log(curvePoints);
    draw(HodographControlPoints(Points),'#1d4bc9',ctx1);

}

canvas.addEventListener("mousedown", onLeftClick);
onClick = (e) => {
    
    let rect = canvas.getBoundingClientRect();

    Points.push({
        x: (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    });

    console.log(Points);

    update(ctx,Points);
    update(ctx1,HodographControlPoints(Points));
}
canvas.addEventListener("click", onClick);

update(ctx,Points);
update(ctx1,HodographControlPoints(Points));


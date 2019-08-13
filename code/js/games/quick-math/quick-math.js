document.getElementById("logo").addEventListener('click', function () {
    console.log("asda");
    window.location.replace("../../popup.html");
});

function start() {
    let score = {
        "points": 0
    };
    document.getElementById("goButton").style.display = "none";
    document.getElementById("result").innerHTML = "";
    document.getElementById("play").style.display = "block";
    let count = 1;
    question(score);
    let intervalId = setInterval(() => {
        if (count++ === 10) {
            clearInterval(intervalId);
            gameOver(score);
        }
        question(score)
    }, 1000);
}

function question(score) {
    let num1 = Math.floor(Math.random() * (15));
    let num2 = Math.floor(Math.random() * (15));
    document.getElementById("num1").innerHTML = num1;
    document.getElementById("num2").innerHTML = num2;
    let operator = Math.floor(Math.random() * (3));
    doMath(num1, num2, operator, score);
}

function doMath(num1, num2, operator, score) {
    let ans, ramdon;
    let check = true;
    let btn1 = document.getElementById("ans");
    let btn2 = document.getElementById("random");
    if (operator === 0) {
        ans = num1 + num2;
        random = Math.floor(Math.random() * (3)) + ans + 1;
        document.getElementById("operator").innerHTML = "+";
    } else if (operator === 1) {
        ans = num1 - num2;
        random = Math.floor(Math.random() * (3)) + ans + 1;
        document.getElementById("operator").innerHTML = "-";
    } else if (operator === 2) {
        ans = num1 * num2;
        random = Math.floor(Math.random() * (3)) + ans + 1;
        document.getElementById("operator").innerHTML = "*";
    }
    let temp = Math.floor(Math.random() * (2));
    if (temp === 1) {
        btn1.innerHTML = ans;
        btn2.innerHTML = random;
    } else {
        btn2.innerHTML = ans;
        btn1.innerHTML = random;
    }
    btn1.onclick = () => {
        if (check && btn1.innerHTML == ans) {
            score.points++;
            console.log(ans);
        }
        check = false;
    };
    btn2.onclick = () => {
        if (check && btn2.innerHTML == ans) {
            score.points++;
            console.log(ans);
        }
        check = false;
    };
    // debugger;
}

function gameOver(score) {
    document.getElementById("goButton").style.display = "block";
    document.getElementById("play").style.display = "none";
    document.getElementById("result").innerHTML = `YOU SOCRED ${score.points} points....`;
}

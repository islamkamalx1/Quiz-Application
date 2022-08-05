let countSpan = document.querySelector('.count span');
let bulletsContainer = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz-area');
let answerArea = document.querySelector('.answers-area');
let submitBtn = document.querySelector('.submit-button');
let bullets = document.querySelector('.bullets');
let results = document.querySelector('.results');
let countdownContainer = document.querySelector('.countdown');
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = ()=> {
        if (myRequest.readyState === 4 && myRequest.status === 200) {
            let questionsObj = JSON.parse(myRequest.responseText);
            let questionsCount = questionsObj.length;
            // Create Bullets + Set Questions Count
            createBullets(questionsCount);
            // Add Question Data
            addQuestionData(questionsObj[currentIndex],questionsCount);
             // Start CountDown
            countdown(30,questionsCount);
            // Click On Submit
            submitBtn.onclick = () => {
                //get right answer
                let theRightAnswer = questionsObj[currentIndex].right_answer;
                // increase index
                currentIndex++;
                // Check The Answer
                checkAnswer(theRightAnswer);
                //remove previous question
                quizArea.innerHTML = "";
                answerArea.innerHTML = "";
                // Add Question Data
                addQuestionData(questionsObj[currentIndex],questionsCount);
                // Handle Bullets Class
                handleBullets();
                // Start CountDown
                clearInterval(countdownInterval);
                countdown(30,questionsCount);
                // show results
                showResults(questionsCount);
            }
        }
    }
    myRequest.open('GET','html-questions.json');
    myRequest.send();
}
getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;
    // Create Spans
    for (let i = 0; i < num; i++){ 
        // Create Bullet
        let bullet = document.createElement('span');
        // Check If Its First Span
        if (i === 0) {
            bullet.className = "active"
        }
        // Append Bullets To Main Bullet Container
        bulletsContainer.appendChild(bullet)
    }
}

function addQuestionData(obj,count) {
    if (currentIndex < count) {
         // Create H2 Question Title
        let questionTitle = document.createElement('h2');
        // Create Question Text
        let questionText = document.createTextNode(obj.title);
        // Append Text To H2
        questionTitle.appendChild(questionText);
        // Append The H2 To The Quiz Area
        quizArea.appendChild(questionTitle);
        // Create The Answers
        for (let i = 1; i <= 4; i++) {
            // Create Main Answer Div
            let mainDiv = document.createElement('div');
            // Add Class To Main Div
            mainDiv.className ='answer';
            // Create Radio Input
            let radioInput = document.createElement('input');
            // Add Type + Name + Id + Data-Attribute
            radioInput.name = 'questions';
            radioInput.type = 'radio';
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];
            // Make First Option Selected
            if (i === 1){
                radioInput.checked = true;
            }
            // Create Label
            let label = document.createElement('label');
            // Add For Attribute
            label.htmlFor = `answer_${i}`;
            // Create Label Text
            let labelText = document.createTextNode(obj[`answer_${i}`]);
            // Add The Text To Label
            label.appendChild(labelText);
            // Add Input + Label To Main Div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(label);
            // Append All Divs To Answers Area
            answerArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer(rAnswer) {
    let answers = document.getElementsByName('questions');
    let theChoosenAnswer;
    for (i = 0; i < answers.length; i++) {
        if (answers[i].checked){
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
    }
}

function handleBullets() {
    let bulletsSpan = document.querySelectorAll('.bullets .spans span');
    bulletsSpan.forEach((span,index) => {
        if (currentIndex === index) {
            span.className = "active";
        }
    });
}

function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answerArea.remove();
        submitBtn.remove();
        bullets.remove();
        if(rightAnswers > count / 2 && rightAnswers < count) {
            theResults = `<span class='good'>Good</span>, ${rightAnswers} From ${count}`;
        } else if (rightAnswers === count) {
            theResults = `<span class='perfect'>Perfect</span>, All Answers Is Good`;
        } else {
            theResults = `<span class='bad'>Bad</span>, ${rightAnswers} From ${count}`;
        }
        results.innerHTML = theResults;
        results.style.padding = "10px";
        results.style.backgroundColor = "white";
        results.style.marginTop = "10px";
    }
}

function countdown(duration,count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(()=>{
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            countdownContainer.innerHTML = `${minutes}:${seconds}`;
            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitBtn.onclick();
            }
        },1000)
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-btn");
    const nextBtn = document.getElementById("next-btn");
    const restartBtn = document.getElementById("restart-btn");

    const startScreen = document.getElementById("start-screen");
    const quizScreen = document.getElementById("quiz-screen");
    const resultsScreen = document.getElementById("results-screen");

    const questionText = document.getElementById("question-text");
    const answerButtons = document.getElementById("answer-buttons");

    const scoreText = document.getElementById("score-text");
    const reviewList = document.getElementById("incorrect-list");
    const scoreValue = document.getElementById("score-value");
    const questionCounter = document.getElementById("question-counter");

    let score = 0;
    let currentQuestionIndex = 0;
    let incorrectAnswers = [];
    let questions = []

    function decodeHTML(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
    

    async function fetchQuestions() {
        const response = await fetch("https://opentdb.com/api.php?amount=5&type=multiple");
        const data = await response.json();
        
        // Convert API format to  app format
        questions = data.results.map(q => {
            const allOptions = [...q.incorrect_answers, q.correct_answer];
            const shuffled = allOptions.sort(() => Math.random() - 0.5); // shuffle options
    
            return {
                question: decodeHTML(q.question),
                correct: decodeHTML(q.correct_answer),
                options: shuffled.map(opt => decodeHTML(opt))
            };
        });
    
        showQuestion();
    }
    
      


    startBtn.addEventListener("click", () => {
        startScreen.classList.add("hidden")
        quizScreen.classList.remove("hidden")

        fetchQuestions();
    })

    function showQuestion(){
        const currentQuestion = questions[currentQuestionIndex]

        questionText.textContent = currentQuestion.question

        questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

       


        // clearing previous options

        const optionList = document.getElementById("answer-buttons" )
        optionList.innerHTML = ""

        // creating buttons for each option
        currentQuestion.options.forEach(option => {
            const li = document.createElement("li")
            const button = document.createElement("button")
            button.textContent = option;
            button.classList.add("btn", "option-btn")
            button.addEventListener("click", () => selectAnswer(option));
            li.appendChild(button)
            optionList.appendChild(li)
        })
    }


    // Adding a selectAnswer function:
    function selectAnswer(selectedOption){

        const currentQuestion = questions[currentQuestionIndex]
        const isCorrect = selectedOption === currentQuestion.correct

        // updating score if correct
        if (isCorrect){
            score++
            scoreValue.textContent = score
        }else {
            incorrectAnswers.push({
                question: currentQuestion.question,
                selected: selectedOption,
                correct: currentQuestion.correct
            })
        }

       // Adding feedback class to all buttons

       const buttons = document.querySelectorAll(".option-btn")
       buttons.forEach(button => {
        button.disabled = true
        if (button.textContent === currentQuestion.correct){
            button.classList.add("correct")
        } else {
            button.classList.add("incorrect")
        }
       })

     // Showing next button
       const nextBtn = document.getElementById("next-btn")
       nextBtn.classList.remove("hidden") 
    }

    // Wiring up the “Next Question” button


    nextBtn.addEventListener("click", () => {
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length){
            showQuestion();
            nextBtn.classList.add("hidden")
        } else {
            showResults()
        }
    })

    function showResults() {
        quizScreen.classList.add("hidden")
        resultsScreen.classList.remove("hidden")

        scoreText.textContent = `You scored ${score} out of ${questions.length}!`

        // Adding incorrect answers for review
        reviewList.innerHTML = "";
        incorrectAnswers.forEach(item => {
            const li = document.createElement("li")
            li.innerHTML = `
            <strong>Q:</strong> ${item.question} <br />
            <strong>Your Answer:</strong> ${item.selected} <br />
            <strong>Correct Answer:</strong> ${item.correct}`

            reviewList.appendChild(li)
        })
    }


    // Adding an event listener to restart
    restartBtn.addEventListener("click", () => {
        currentQuestionIndex = 0
        score = 0
        incorrectAnswers = []

        nextBtn.classList.add("hidden")

        
        // Updating score display
        scoreValue.textContent = score;

        // Showing the quiz screen and hiding results
        resultsScreen.classList.add("hidden")
        quizScreen.classList.remove("hidden")


        showQuestion()


    })

    
})
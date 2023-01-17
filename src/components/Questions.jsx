import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { nanoid } from 'nanoid'
import { useLocation } from "react-router-dom";

function Questions() {
    const [questions, setQuestions] = useState([])
    const [startCheckAnswer, setStartCheckAnswer] = useState(false)
    const [numOfCorrectAnswer, setNumOfCorrectAnswer] = useState(0)
    const [hasReceiveData, setHasReceiveData] = useState(true)

    // Use location to get formData from TopicChosen page
    const location = useLocation();
    const request = location.state

    // Fetch questions data from API: handle response data length receive < 5
    useEffect(() => {
        fetch(`https://opentdb.com/api.php?amount=5${request.category}${request.difficulty}${request.type}`)
            .then(res => res.json())
            .then(data => {
                if (data.results.length < 5) {
                    setHasReceiveData(false)
                }
                // Map each question from API response to return new question object with one added key: "anwsers" - an array of answer object 
                const dataArr = data.results.map(question => {
                    let correctAns = question.correct_answer
                    let answersArr = question.incorrect_answers.slice()
                    let index = Math.floor(Math.random() * answersArr.length)
                    answersArr.splice(index, 0, correctAns)
                    let answers = answersArr.map(answer => {
                        return {
                            id: nanoid(),
                            value: answer,
                            selected: false
                        }
                    })
                    return {
                        id: nanoid(),
                        ...question,
                        answers: answers
                    }
                })
                setQuestions(dataArr)
            })
    }, [])

    // Decode special characters for HTML display
    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    // Map through answers array to return each answer based on purpose of showing questions or checked answers
    function Answers(props) {
        let answers = props.value.map(answer => {
            if (!startCheckAnswer) {
                return <p onClick={() => props.handleClick(props.questionId, answer.id)}
                    key={answer.id} className={`answer ${answer.selected ? 'selected' : ''}`}>{decodeHtml(answer.value)}</p>
            }
            else {
                return <p key={answer.id} className={`answer ${answer.status}`}>{decodeHtml(answer.value)}</p>
            }
        })
        return answers
    }
    // Handle when each answer is selected
    function selectedAnswer(questionId, answerId) {
        setQuestions(oldQuestionArr => {
            return oldQuestionArr.map(question => {
                if (question.id === questionId) {
                    let answers = question.answers.map(answer => {
                        if (answer.id === answerId) {
                            return {
                                ...answer,
                                selected: !answer.selected
                            }
                        } else {
                            return {
                                ...answer,
                                selected: false
                            }
                        }
                    })
                    return {
                        ...question,
                        answers: answers
                    }
                } else {
                    return question
                }
            })

        })
    }

    // Handle when button  "Check Answers" is clicked
    function checkAnswers() {
        setStartCheckAnswer(true)
        let correctAnwser = 0;
        setQuestions(oldQuestionArr => {
            return oldQuestionArr.map(question => {
                let answers = question.answers.map(answer => {
                    if (answer.selected) {
                        if (answer.value === question.correct_answer) {
                            correctAnwser++
                            setNumOfCorrectAnswer(correctAnwser)
                            return {
                                ...answer,
                                status: 'correct'
                            }
                        } else {
                            return {
                                ...answer,
                                status: 'incorrect'
                            }
                        }
                    }
                    else {
                        if (answer.value === question.correct_answer) {
                            return {
                                ...answer,
                                status: 'correct'
                            }
                        } else {
                            return {
                                ...answer,
                                status: 'not-chosen'
                            }
                        }
                    }
                })
                return {
                    ...question,
                    answers: answers
                }
            })
        })
    }

    // Map through questions array to return each question and its answers
    const question = questions.map(item => {
        return <div key={item.id} className="question-container">
            <p className="question">{decodeHtml(item.question)}
                <sup className="category">{item.category}</sup>
                <sup className="difficulty">{item.difficulty}</sup></p>
            <div className="answer-container">
                <Answers value={item.answers}
                    handleClick={selectedAnswer}
                    questionId={item.id} />
            </div>
        </div>
    })

    // Display footer button based on purpose: Check Answers or Reset Quiz 
    function Footer(props) {
        if (!props.startCheckAnswer) {
            return <button onClick={checkAnswers}>Check Answers</button>
        } else {
            return <div className="footer">
                <p>You scored {props.numOfCorrectAnswer}/5 correct answers </p>
                <Link to="/"><button>Play Again</button></Link>
            </div>
        }
    }
    // render Questions: if data from API is recieved or not
    return (
        hasReceiveData ? <>
            {question}
            <Footer startCheckAnswer={startCheckAnswer} numOfCorrectAnswer={numOfCorrectAnswer} />
        </> : <>
            <p className="error-message">We don't have enough questions that match your preferences, please choose another topic </p>
            <Link to="/select"><button>Go Back</button></Link>
        </>
    )
}

export default Questions
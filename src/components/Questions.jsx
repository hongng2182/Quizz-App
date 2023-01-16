import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { nanoid } from 'nanoid'

function Questions() {
    const [questions, setQuestions] = useState([])
    const [checkAnswer, setCheckAnswer] = useState(false)
    const [numOfCorrectAnswer, setNumOfCorrectAnswer] = useState(0)


    useEffect(() => {
        fetch(`https://opentdb.com/api.php?amount=5`)
            .then(res => res.json())
            .then(data => {
                const dataArr = data.results.map(question => {
                    let correctAns = question.correct_answer
                    console.log("correct Ans: " + correctAns)
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
                console.log(dataArr)
                setQuestions(dataArr)
            })
    }, [])


    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    function Answers(props) {
        let answers = props.value.map(answer => {
            if (!checkAnswer) {
                return <p onClick={() => props.handleClick(props.questionId, answer.id)}
                    key={answer.id} className={`answer ${answer.selected ? 'selected' : ''}`}>{decodeHtml(answer.value)}</p>
            }
            else {
                return <p key={answer.id} className={`answer ${answer.status}`}>{decodeHtml(answer.value)}</p>
            }
        })
        return answers
    }

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
    function checkAnswers() {
        setCheckAnswer(true)
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


    const question = questions.map(item => {
        return <div key={item.id} className="question-container">
            <p className="question">{decodeHtml(item.question)}</p>
            <div className="answer-container">
                <Answers value={item.answers}
                    handleClick={selectedAnswer}
                    questionId={item.id} />
            </div>
        </div>
    })

    function Footer(props) {
        if (!props.checkAnswer) {
            return <button onClick={checkAnswers}>Check Answers</button>
        } else {
            return <div className="footer">
                <p>You scored {props.numOfCorrectAnswer}/5 correct answers </p>
                <Link to="/"><button>Play Again</button></Link>
            </div>
        }
    }
    return (
        <>
            {question}
            <Footer checkAnswer={checkAnswer} numOfCorrectAnswer={numOfCorrectAnswer} />
        </>
    )
}

export default Questions
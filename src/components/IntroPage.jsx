import { Link } from "react-router-dom";

function IntroPage() {
    return (
        <div className="intro">
            <div className="title">
                Quizzical
            </div>
            <div className="description">
                A mini quiz of 5 questions to test your general knowledge on any topic.
            </div>
            <Link to="/questions"><button> Start Quiz</button></Link>
        </div>
    )
}
export default IntroPage
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function TopicChosen() {

    const [formData, setFormData] = useState({
        category: "",
        difficulty: "",
        type: ""
    })

    const [categories, setCategories] = useState([])
    const types = [{ name: 'Any Type', value: '' }, { name: 'Multiple Choice Questions', value: 'multiple' }, { name: 'True/ False', value: 'boolean' }]
    const difficulties = [{ name: 'Any Difficulty', value: '' }, { name: 'Easy', value: 'easy' }, { name: 'Medium', value: 'medium' }, { name: 'Hard', value: 'hard' }]

    // Fetch Category API
    useEffect(() => {
        fetch(`https://opentdb.com/api_category.php`)
            .then(res => res.json())
            .then(data => {
                setCategories(data.trivia_categories)
            })
    }, [])

    // Set value for formData as soon as user make their choices to match API request URL
    function handleChange(event) {
        const { name, value } = event.target
        setFormData(prevFormData => {
            if (value === '') {
                return {
                    ...prevFormData,
                    [name]: value
                }
            } else {
                return {
                    ...prevFormData,
                    [name]: `&${name}=${value}`
                }
            }
        })
    }

    // Use navigate to send formData to Questions page
    const navigate = useNavigate();
    const sendFormDataToQuestions = () => {
        navigate('/questions', { state: formData });
    }

    // Map to generate each category option
    const category = categories.map(item =>
        <option key={item.id} value={item.id}>{item.name}</option>)


    // Map to generate each questions type - input radio and label
    const type = types.map(item => <div key={item.name} >
        <input
            type="radio"
            id={item.name}
            name="type"
            value={item.value}
            onChange={handleChange}>
        </input>
        <label htmlFor={item.value}>{item.name}</label>
    </div>)

    // Map to generate each difficulty level as input radio and label
    const difficulty = difficulties.map(item => <div key={item.name} >
        <input
            key={item.name}
            type="radio"
            id={item.name}
            name="difficulty"
            value={item.value}
            onChange={handleChange}>
        </input>
        <label htmlFor={item.value}>{item.name}</label>
    </div>)

    // render TopicChosen
    return (
        <>
            <h1>Select your topic</h1>
            <div className="categories-container">
                <h3>Category</h3>
                <select id="category" className="category"
                    onChange={handleChange}
                    name="category">
                    <option value="">Any Category</option>
                    {category}
                </select>
            </div>
            <div className="type-container" >
                <h3>Questions Type</h3>
                {type}
            </div>
            <div className="difficulty-container">
                <h3>Level of difficulty</h3>
                {difficulty}
            </div>
            <button onClick={sendFormDataToQuestions}> Start Quiz</button>
        </>
    )
}

export default TopicChosen
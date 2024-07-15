import { useEffect, useState } from "react"

function GreetingCard(props) {
    const [greet, setGreet] = useState(null)

    let today = new Date()
    let hrs = today.getHours()
    useEffect(() => {
    if (hrs < 12)
        setGreet('Good Morning');
    else if (hrs >= 12 && hrs <= 18)
        setGreet('Good Afternoon');
    else if (hrs >= 18 && hrs <= 22)
        setGreet('Good Evening');
    else if (hrs >= 22 && hrs <= 24)
        setGreet('Good Night');
    }, [greet])

    return (
        <div className="card">
            <span className="card-container">
                <h2>{greet}, {props.name}</h2>
            </span>
        </div>
    )
}

export default GreetingCard
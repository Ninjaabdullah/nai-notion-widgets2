
function GreetingCard(props) {
    let today = new Date()
    let greet = new String
    let hrs = today.getHours()
    if (hrs < 12)
        greet = 'Good Morning';
    else if (hrs >= 12 && hrs <= 17)
        greet = 'Good Afternoon';
    else if (hrs >= 17 && hrs <= 22)
        greet = 'Good Evening';
    else if (hrs >= 22 && hrs <= 24)
        greet = 'Good Night';

    return (
        <div className="card">
            <span className="card-container">
                <h2>{greet}, {props.name}</h2>
            </span>
        </div>
    )
}

export default GreetingCard
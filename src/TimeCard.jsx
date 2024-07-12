import { useState, useEffect } from "react"

function TimeCard() {
    const [time, setTime] = useState("0:00:00");

    useEffect(() => {
        setTimeout(() => {
            setTime((time) => hour + ":" + minutes + ":" + seconds);
    }, 1000)})

    let today = new Date()
    let hour = (tweleveHour(today.getHours()))
    let minutes = (zeros(today.getMinutes()))
    let seconds = (zeros(today.getSeconds()))
    const amStyle = {
        fontSize: 16,
        verticalAlign: "text-top",
    }
    const pmStyle = {
        fontSize: 16,
        verticalAlign: "text-bottom",
    }
    let amorpm = today.getHours() < 12 ? <span style={amStyle}>AM</span> : <span style={pmStyle}>PM</span>
    const weeks =
    ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    let week = weeks[today.getDay()].slice(0,3)
    const dayStyle = {
        fontWeight: 600,
        fontSize: 18,
        verticalAlign: "baseline",
    }
    let day = today.getDate()
    const months =
    ["January","February","March","April","May","June","July","August","September","October","November","December"]
    let month = months[today.getMonth()].slice(0,3)
    let year = today.getFullYear()


    // Turn hours into 12 hour format
    function tweleveHour(hour) {
        if (hour > 12)
            return hour - 12
        else if (hour == 0)
            return 12
        else 
            return hour
    }

    function zeros(num) {
        if (num < 10)
            return num = "0" + num
        else
            return num
    }

    return (
    <div className="card">
        <span className="card-container">
            <h2 className="clock">{time}{amorpm}</h2>
            <p className="date">{month} <span style={dayStyle}>{day}</span> {week}</p>
        </span>
    </div>
    );
}

export default TimeCard
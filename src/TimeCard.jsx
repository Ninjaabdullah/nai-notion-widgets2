import { useState, useEffect } from "react"

function TimeCard() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date())
        }, 1000);

        return () => {
            clearInterval(intervalId);
        }
    }, [])

    function formatTime(){
        // Time Formating
        let hour = (tweleveHour(time.getHours()))
        let minutes = (zeros(time.getMinutes()))
        let seconds = (zeros(time.getSeconds()))
        return `${hour}:${minutes}:${seconds}`;
    }
    // AM & PM Styling
    const amStyle = {
        fontSize: 16,
        verticalAlign: "text-top",
    }
    const pmStyle = {
        fontSize: 16,
        verticalAlign: "text-bottom",
    }
    // AM & PM Getter
    let amorpm = time.getHours() < 12 ? <span style={amStyle}>AM</span> : <span style={pmStyle}>PM</span>
    // Weekdays Names
    const weekDayNames =
    ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    // Weekday Getter
    let week = weekDayNames[time.getDay()].slice(0,3)
    // Day Styling
    const dayStyle = {
        fontWeight: 600,
        fontSize: 18,
        verticalAlign: "baseline",
    }
    // Day Getter
    let day = time.getDate()
    // Month Names
    const months =
    ["January","February","March","April","May","June","July","August","September","October","November","December"]
    // Month Getter
    let month = months[time.getMonth()].slice(0,3)
    // Year Getter
    let year = time.getFullYear()


    // Turn hours into 12 hour format
    function tweleveHour(hour) {
        if (hour > 12)
            return hour - 12
        else if (hour == 0)
            return 12
        else 
            return hour
    }

    // Add zeros to numbers less than
    function zeros(num) {
        if (num < 10)
            return num = "0" + num
        else
            return num
    }

    return (
    <div className="card">
        <span className="card-container">
            <h2 className="clock">{formatTime()}{amorpm}</h2>
            <p className="date">{month} <span style={dayStyle}>{day}</span> {week}</p>
        </span>
    </div>
    );
}

export default TimeCard
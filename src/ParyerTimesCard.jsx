import { useState, useEffect } from "react"
import axios from "axios"

function PrayerTimesCard() {
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [upcomingPrayer, setUpcomingPrayer] = useState({ name: '', time: '' });
    const [hijriDate, setHijriDate] = useState(null)
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrayerTimes = async () => {
            try {
                const response = await axios.get('http://api.aladhan.com/v1/timingsByCity', {
                    params: {
                        city: 'Cairo',
                        country: 'Egypt',
                        method: 5 // Method 2 is the default method for prayer times calculation
                    }
                });
                let timings = response.data.data.timings;
                const unwantedTimings = ['Imsak', 'Midnight', 'Firstthird', 'Lastthird', 'Sunset'];
                timings = Object.fromEntries(
                    Object.entries(timings).filter(([key]) => !unwantedTimings.includes(key))
                );

                setPrayerTimes(timings);
                calculateUpcomingPrayer(timings);
            } catch (error) {
                setError('Error fetching prayer times');
                console.error(error);
            }
        };

        const calculateUpcomingPrayer = (timings) => {
            const currentTime = new Date();
            const prayerTimesArray = Object.entries(timings).map(([name, time]) => {
                const [hours, minutes] = time.split(':');
                const prayerTime = new Date();
                prayerTime.setHours(hours);
                prayerTime.setMinutes(minutes);
                return { name, time: prayerTime };
            });

            for (let i = 0; i < prayerTimesArray.length; i++) {
                if (currentTime < prayerTimesArray[i].time) {
                    setUpcomingPrayer({ name: prayerTimesArray[i].name, time: prayerTimesArray[i].time.toLocaleTimeString(["en-US"], { hour: 'numeric', minute: '2-digit' }) });
                    if (currentTime.getDay = 5 && prayerTimesArray[i].name == "Dhuhr") {
                        setUpcomingPrayer({ name: "Juhmma", time: prayerTimesArray[i].time.toLocaleTimeString(["en-US"], { hour: '2-digit', minute: '2-digit' })})
                        return;
                    }
                    return;
                }
            }

            // If all prayer times have passed, the next prayer is Fajr of the next day
            setUpcomingPrayer({ name: 'Fajr', time: prayerTimesArray[0].time.toLocaleTimeString(["en-US"], { hour: 'numeric', minute: '2-digit' }) });
        };

        const a2e = num => num.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))

        const fetchHijriDate = () => {
            let today = new Date();
            const hijriMonths = 
            ["Muharram","Safar","Rabi' al-awwal","Rabi' al-Thani","Jumada al-awwal","Jumada al-Thani","Rajab","Sha'ban","Ramadan","Shawwal","Dhu al-Qi'dah","Dhu al-Hijjah"];
            let hijriDay = a2e(today.toLocaleDateString(["ar-SA"], {day: "numeric"}))
            let hijriMonth = a2e(today.toLocaleDateString(["ar-SA"], {month: "numeric"})) - 1
            let hijriYear = a2e(today.toLocaleDateString(["ar-SA"], {year: "numeric"})).replace(/\D/g,'')
            setHijriDate(hijriDay + " " + hijriMonths[hijriMonth] + " " + hijriYear)
        }

        fetchPrayerTimes();
        fetchHijriDate();
    }, []);

    const hijriDateStyle = {
        fontSize: 16,
        marginTop: -2
    }

    if (!prayerTimes) {
        return (
        <div className="card">
            <span className="card-container">
                <h2>Loading...</h2>
            </span>
        </div>
        )
    }

    if (error) {
        return (
            <div className="card">
                <span className="card-container">
                    <h2>Error: {error}</h2>
                </span>
            </div>
            )
    }
    
    return (
        <div className="card">
            <span className="card-container">
                <span className="prayer">
                    <p><b>Upcoming Prayer:</b></p>
                    <h1>{upcomingPrayer.name}</h1>
                    <h2>{upcomingPrayer.time}</h2>
                    <p style={hijriDateStyle}>{hijriDate}</p>
                </span>
            </span>
        </div>
    )
}
export default PrayerTimesCard
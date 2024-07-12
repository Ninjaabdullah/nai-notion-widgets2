import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrayerTimes = () => {
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [upcomingPrayer, setUpcomingPrayer] = useState({ name: '', time: '' });
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
                console.info(timings)

                // Remove unwanted prayer times
                const unwantedTimings = ['Imsak', 'Midnight', 'Firstthird', 'Lastthird', 'Sunset'];
                timings = Object.fromEntries(
                    Object.entries(timings).filter(([key]) => !unwantedTimings.includes(key))
                );
                const today = new Date()
                if (today.getDay = 5) {
                    timings['Juhmma'] = timings['Dhuhr']
                    timings = Object.fromEntries(
                    Object.entries(timings).filter(([key]) => 'Dhuhr' !== key)
                    )
                }

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
                prayerTime.setSeconds(0);
                return { name, time: prayerTime };
            });

            for (let i = 0; i < prayerTimesArray.length; i++) {
                if (currentTime < prayerTimesArray[i].time) {
                    setUpcomingPrayer({ name: prayerTimesArray[i].name, time: prayerTimesArray[i].time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
                    if (currentTime.getDay = 5 && prayerTimesArray[i].name == "Dhuhr") {
                        setUpcomingPrayer({ name: "Juhmma", time: prayerTimesArray[i].time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                        return;
                    }
                    return;
                }
            }

            // If all prayer times have passed, the next prayer is Fajr of the next day
            setUpcomingPrayer({ name: 'Fajr', time: prayerTimesArray[0].time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
        };

        fetchPrayerTimes();
    }, []);

    if (error) {
        return <h1>{error}</h1>;
    }

    if (!prayerTimes) {
        return <h1>Loading...</h1>;
    }

    return (
        <div>
            <h1>Upcoming Prayer: {upcomingPrayer.name} at {upcomingPrayer.time}</h1>
            <h2>Prayer Times for Cairo</h2>
            <ul>
                {Object.entries(prayerTimes).map(([key, value]) => (
                    <li key={key}>
                        {key}: {value}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PrayerTimes;

import React from "react";
import {StyleSheet, Text, View, Button} from "react-native";
import {vibrate} from "./utils";
import moment from "moment";
// causes phone to vibrate

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: "00:00:00",
            running: true,
        };

        this.startTimer();
    }

    startTimer = () => {
        const tick = 1000;
        let duration = 10 * 1000;

        const interval = setInterval(() => {
            duration = moment.duration(duration - tick, "milliseconds");

            let hours = duration.hours();
            let minutes = duration.minutes();
            let seconds = duration.seconds();

            if (hours < 10) hours = "0" + hours;
            if (minutes < 10) minutes = "0" + minutes;
            if (seconds < 10) seconds = "0" + seconds;

            this.setState({
                timer: hours + ":" + minutes + ":" + seconds,
            });

            if (duration.seconds() === 0) {
                clearInterval(interval);
                this.alertUser();
            }
        }, tick);
    };

    alertUser = () => {
        console.log("TERMINO");
        vibrate();
    };

    render() {
        const {timer} = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.timerText}>{timer}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        top: 100,
    },

    timerText: {
        fontSize: 30,
    },
});

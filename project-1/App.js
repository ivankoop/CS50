import React from "react";
import {StyleSheet, Text, View, TouchableOpacity, Picker} from "react-native";
import {vibrate} from "./utils";
import moment from "moment";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: "00:25:00",
            time: 25,
            showPicker: false,
            timerStarted: false,
            timerPaused: true,
        };

        this.interval;
    }

    _alertUser = () => {
        vibrate();
    };

    _selectTime = () => {
        this.setState({showPicker: true});
    };

    _startTimer = () => {
        this.setState({timerStarted: true, timerPaused: false}, () => {
            const tick = 1000;
            const {time} = this.state;
            let duration = time * 60000;

            this.interval = setInterval(() => {
                let {timerPaused} = this.state;

                if (timerPaused) {
                    return;
                }

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

                if (
                    duration.seconds() === 0 &&
                    duration.minutes() === 0 &&
                    duration.hours() === 0
                ) {
                    clearInterval(this.interval);
                    this._alertUser();
                }
            }, tick);
        });
    };

    _pauseTimer = () => {
        this.setState(prevState => ({
            timerPaused: !prevState.timerPaused,
        }));
    };

    _resetTimer = () => {
        clearInterval(this.interval);
        this.setState({
            timer: "00:00:00",
            running: false,
            showPicker: false,
            timerStarted: false,
            timerPaused: true,
        });
    };

    _valueChanged = value => {
        this.setState({time: value});
    };

    render() {
        const {timer, showPicker, timerStarted, timerPaused} = this.state;

        return (
            <View style={styles.container}>
                <Text style={styles.timerText}>{timer}</Text>
                {timerStarted ? (
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={{
                                ...styles.pauseBtn,
                                ...{
                                    backgroundColor: timerPaused
                                        ? "#32CD32"
                                        : "#ff1919",
                                },
                            }}
                            onPress={this._pauseTimer}
                        >
                            <Text style={{color: "white", fontSize: 20}}>
                                {timerPaused ? "Continue" : "Pause"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.startBtn}
                            onPress={this._resetTimer}
                        >
                            <Text style={{color: "white", fontSize: 20}}>
                                Reset Timer
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : showPicker ? (
                    <View style={styles.selectContainer}>
                        <Picker
                            selectedValue={this.state.time}
                            style={styles.picker}
                            onValueChange={(itemValue, _itemIndex) => {
                                this.setState({
                                    time: itemValue,
                                    timer: "00:" + itemValue + ":00",
                                });
                            }}
                        >
                            <Picker.Item selected label="25" value="25" />
                            <Picker.Item label="20" value="20" />
                            <Picker.Item label="15" value="15" />
                            <Picker.Item label="10" value="10" />
                            <Picker.Item label="05" value="5" />
                        </Picker>
                        <TouchableOpacity
                            style={styles.startBtn}
                            onPress={this._startTimer}
                        >
                            <Text style={{color: "white", fontSize: 20}}>
                                Start Timer
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.selectBtn}
                        onPress={this._selectTime}
                    >
                        <Text style={{color: "white", fontSize: 20}}>
                            Select Time
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
    },

    timerText: {
        fontSize: 30,
        top: 100,
    },

    selectContainer: {
        flex: 1,
        alignItems: "center",
    },

    selectBtn: {
        marginTop: 150,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 5,
        backgroundColor: "#5844ed",
    },

    startBtn: {
        backgroundColor: "#32CD32",
        marginTop: 10,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 5,
    },

    picker: {
        width: 300,
        marginTop: 100,
    },

    actionsContainer: {
        flex: 1,
        alignItems: "center",
        marginTop: 100,
    },

    pauseBtn: {
        backgroundColor: "#ff1919",
        marginTop: 80,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 5,
        alignItems: "center",
        width: 130,
    },
});

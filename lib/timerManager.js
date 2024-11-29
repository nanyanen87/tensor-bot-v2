// utils/TimerManager.js
class TimerManager {
    constructor() {
        this.timers = new Map(); // serverId に紐づくタイマー
    }

    startTimer(serverId, callback, delay) {
        if (this.timers.has(serverId)) {
            throw new Error(`Timer for serverId ${serverId} is already running.`);
        }

        const timer = setTimeout(() => {
            this.timers.delete(serverId);
            callback();
        }, delay);

        this.timers.set(serverId, timer);
    }

    clearTimer(serverId) {
        if (!this.timers.has(serverId)) {
            throw new Error(`Timer for serverId ${serverId} is not running.`);
        }

        clearTimeout(this.timers.get(serverId));
        this.timers.delete(serverId);
    }

    hasTimer(serverId) {
        return this.timers.has(serverId);
    }
}

module.exports = new TimerManager();

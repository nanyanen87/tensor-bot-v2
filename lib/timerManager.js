// utils/TimerManager.js
class TimerManager {
    constructor() {
        this.timers = new Map(); // serverId に紐づくタイマー
        this.callbacks = new Map(); // serverId に紐づくコールバック関数を保存
    }

    startTimer(serverId, callback, delay) {
        if (this.timers.has(serverId)) {
            throw new Error(`Timer for serverId ${serverId} is already running.`);
        }

        const timer = setTimeout(() => {
            callback();
            // タイマー完了時にMap からクリーンアップ
            this.timers.delete(serverId);
            this.callbacks.delete(serverId);
        }, delay);

        this.timers.set(serverId, timer);
        this.callbacks.set(serverId, callback);
    }

    clearTimer(serverId) {
        if (!this.timers.has(serverId)) {
            throw new Error(`Timer for serverId ${serverId} is not running.`);
        }

        clearTimeout(this.timers.get(serverId));
        this.timers.delete(serverId);
        this.callbacks.delete(serverId);
    }

    hasTimer(serverId) {
        return this.timers.has(serverId);
    }

    extendTimer(serverId, additionalTime) {
        if (!this.timers.has(serverId)) {
            throw new Error(`Timer for serverId ${serverId} is not running.`);
        }

        const callback = this.callbacks.get(serverId);

        // 現在のタイマーをクリア
        clearTimeout(this.timers.get(serverId));

        // 新しいタイマーを設定
        const timer = setTimeout(() => {
            callback();
            this.timers.delete(serverId);
            this.callbacks.delete(serverId);
        }, additionalTime);

        this.timers.set(serverId, timer);
    }

}

export const timerManager = new TimerManager();
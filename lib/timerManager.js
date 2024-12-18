class TimerManager {
    // private static instance
    static #instance = null;

    // private constructor
    constructor() {
        // 2回目以降のnew TimerManager()を防ぐ
        if (TimerManager.#instance) {
            throw new Error('TimerManagerは直接インスタンス化できません。getInstance()を使用してください。');
        }
        this.timers = new Map();
        this.callbacks = new Map();
        TimerManager.#instance = this;
    }

    // public static getInstance method
    static getInstance() {
        if (!TimerManager.#instance) {
            TimerManager.#instance = new TimerManager();
        }
        return TimerManager.#instance;
    }

    startTimer(serverId, callback, delay) {
        if (this.timers.has(serverId)) {
            throw new Error(`Timer for serverId ${serverId} is already running.`);
        }

        const timer = setTimeout(() => {
            callback();
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

        clearTimeout(this.timers.get(serverId));

        const timer = setTimeout(() => {
            callback();
            this.timers.delete(serverId);
            this.callbacks.delete(serverId);
        }, additionalTime);

        this.timers.set(serverId, timer);
    }
}

// エクスポートする単一のインスタンス
export const timerManager = TimerManager.getInstance();
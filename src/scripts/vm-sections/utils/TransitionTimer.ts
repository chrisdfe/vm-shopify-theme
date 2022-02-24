import mitt, { type Emitter } from "mitt";

export default class TransitionTimer {
  timeoutId;

  emitter: Emitter<{ start: void; end: void }>;
  timeoutLength: number;

  constructor(length: number) {
    this.timeoutLength = length;
    this.emitter = mitt();
  }

  start = () => {
    this.emitter.emit("start");
    console.log("start");
    this.timeoutId = setTimeout(() => {
      this.emitter.emit("end");
      console.log("end");
    }, this.timeoutLength);

    return new Promise<void>((resolve) => {
      const onEnd = () => {
        resolve();
        this.emitter.off("end", onEnd);
      };

      this.emitter.on("end", onEnd);
    });
  };

  cancel = () => {
    this.emitter.emit("end");
    clearTimeout(this.timeoutId);
  };
}

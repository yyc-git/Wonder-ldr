import { concat } from "most";

export let concatArray = (streamArr) => {
    // TODO add contract check: stream.length >= 1

    return streamArr.slice(1).reduce((wholeStream, stream) => {
        return concat(wholeStream, stream);
    }, streamArr[0]);
}

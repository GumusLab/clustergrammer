import registerWebworker from 'webworker-promise/lib/register';
import vectorize_label from "./vectorizeLabel";

registerWebworker(async (message, _) => {
    const shader = vectorize_label(message.frontDetails, message.axis, message.name);
    return {
        shader,
        axis: message.axis,
        name: message.name,
        offsetInst: message.offsetInst,
        offsetNew: message.offsetNew,
    }
    
});

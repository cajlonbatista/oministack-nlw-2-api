export default function converterTime(time: string){
    const [hour, minutes] = time.split(":").map(Number);
    const minutesTime = (hour * 60) + minutes;
    return minutesTime;
}
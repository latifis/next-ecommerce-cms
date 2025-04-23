export const formatTime = (date: string | undefined) => {
    if (!date) return "N/A";

    const formattedTime = new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    return formattedTime;
};

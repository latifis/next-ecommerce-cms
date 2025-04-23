export const formatDateAndTime = (date: string | undefined) => {
    if (!date) return "N/A";

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Jakarta',
        timeZoneName: 'short',
    };

    const formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(new Date(date));

    return formattedDateTime.replace(', ', ' at ');
};

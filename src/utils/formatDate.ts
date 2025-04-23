export const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return formattedDate;
};

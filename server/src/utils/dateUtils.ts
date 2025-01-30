export const isValidDate = (date: Date) => {
    return date instanceof Date && !isNaN(date.getTime());
};

export const isCurrentMonth = (date: Date) => {
    const now = new Date();
    return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    );
};

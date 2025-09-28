/**
 * محاسبه زمان مطالعه متن فارسی
 * @param {string} text - متن ورودی
 * @param {number} wpm - سرعت مطالعه (کلمات در دقیقه) پیش‌فرض ۱۸۰
 * @returns {object} { minutes, words, text }
 */
export function readingTimeFa(text, wpm = 180) {
    // حذف فاصله‌های اضافه و شمارش کلمات
    const words = text.trim().split(/\s+/).length;

    const minutes = words / wpm;
    const rounded = Math.max(1, Math.round(minutes)); // حداقل ۱ دقیقه

    return {
        words,
        minutes,
        text: `${rounded} دقیقه مطالعه`,
    };
}
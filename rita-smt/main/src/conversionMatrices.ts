/**
 * From luxon
 *
 *
 *
 * Copyright 2019 JS Foundation and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// unit conversion constants
export const lowOrderMatrix = {
        weeks: {
            days: 7,
            hours: 7 * 24,
            minutes: 7 * 24 * 60,
            seconds: 7 * 24 * 60 * 60,
            milliseconds: 7 * 24 * 60 * 60 * 1000,
        },
        days: {
            hours: 24,
            minutes: 24 * 60,
            seconds: 24 * 60 * 60,
            milliseconds: 24 * 60 * 60 * 1000,
        },
        hours: { minutes: 60, seconds: 60 * 60, milliseconds: 60 * 60 * 1000 },
        minutes: { seconds: 60, milliseconds: 60 * 1000 },
        seconds: { milliseconds: 1000 },
    },
    casualMatrix = {
        years: {
            quarters: 4,
            months: 12,
            weeks: 52,
            days: 365,
            hours: 365 * 24,
            minutes: 365 * 24 * 60,
            seconds: 365 * 24 * 60 * 60,
            milliseconds: 365 * 24 * 60 * 60 * 1000,
        },
        quarters: {
            months: 3,
            weeks: 13,
            days: 91,
            hours: 91 * 24,
            minutes: 91 * 24 * 60,
            seconds: 91 * 24 * 60 * 60,
            milliseconds: 91 * 24 * 60 * 60 * 1000,
        },
        months: {
            weeks: 4,
            days: 30,
            hours: 30 * 24,
            minutes: 30 * 24 * 60,
            seconds: 30 * 24 * 60 * 60,
            milliseconds: 30 * 24 * 60 * 60 * 1000,
        },

        ...lowOrderMatrix,
    },
    daysInYearAccurate = 146097.0 / 400,
    daysInMonthAccurate = 146097.0 / 4800,
    accurateMatrix = {
        years: {
            quarters: 4,
            months: 12,
            weeks: daysInYearAccurate / 7,
            days: daysInYearAccurate,
            hours: daysInYearAccurate * 24,
            minutes: daysInYearAccurate * 24 * 60,
            seconds: daysInYearAccurate * 24 * 60 * 60,
            milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1000,
        },
        quarters: {
            months: 3,
            weeks: daysInYearAccurate / 28,
            days: daysInYearAccurate / 4,
            hours: (daysInYearAccurate * 24) / 4,
            minutes: (daysInYearAccurate * 24 * 60) / 4,
            seconds: (daysInYearAccurate * 24 * 60 * 60) / 4,
            milliseconds: (daysInYearAccurate * 24 * 60 * 60 * 1000) / 4,
        },
        months: {
            weeks: daysInMonthAccurate / 7,
            days: daysInMonthAccurate,
            hours: daysInMonthAccurate * 24,
            minutes: daysInMonthAccurate * 24 * 60,
            seconds: daysInMonthAccurate * 24 * 60 * 60,
            milliseconds: daysInMonthAccurate * 24 * 60 * 60 * 1000,
        },
        ...lowOrderMatrix,
    };

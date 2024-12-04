const startDate = new Date()
startDate.setMonth(startDate.getMonth() - 9)
const createParentData = require('../test_helpers/createParentData')

const startDateCases = [
  {
    year: startDate.getFullYear() - 10,
    month: startDate.getMonth() + 1,
    day: startDate.getDate(),
    message: 'returns false and adds an error if the year is more than one year before today',
    errorText: 'Enter a date within one year of today'
  },
  {
    year: startDate.getFullYear() + 10,
    month: startDate.getMonth() + 1,
    day: startDate.getDate(),
    message: 'returns false and adds an error if the year is more than one year after today',
    errorText: 'Enter a date within one year of today'
  },
  {
    year: '',
    month: '10',
    day: '15',
    message: 'returns false and adds an error if the year part is missing',
    errorText: 'Enter a valid year'
  },
  {
    year: startDate.getFullYear(),
    month: '',
    day: startDate.getDate(),
    message: 'returns false and adds an error if the month part is missing',
    errorText: 'Enter a valid month'
  },
  {
    year: startDate.getFullYear(),
    month: startDate.getMonth() + 1,
    day: '',
    message: 'returns false and adds an error if any day part is missing',
    errorText: 'Enter a valid day'
  },
  {
    year: '',
    month: '',
    day: '',
    message: 'returns false and adds an error if all date parts are missing',
    errorText: 'Enter a valid day, month and year'
  },
  {
    year: startDate.getFullYear(),
    month: startDate.getMonth() + 1,
    day: '41',
    message: 'returns false and adds an error if the day is invalid',
    errorText: 'Enter a valid day'
  },
  {
    year: startDate.getFullYear(),
    month: '20',
    day: startDate.getDate(),
    message: 'returns false and adds an error if the month is invalid',
    errorText: 'Enter a valid month'
  },
  {
    year: 'C',
    month: 'B',
    day: 'C',
    message: 'returns false and adds an error if non-integers have been inputted',
    errorText: 'Enter a valid date'
  }
]

const addStartDateError = [
  {
    message: 'Test error message',
    dateParts: ['year', 'month', 'day'],
    expectedHref: '#start-date-year'
  },
  {
    message: 'Month error',
    dateParts: ['month'],
    expectedHref: '#start-date-month'
  },
  {
    message: 'Day error',
    dateParts: ['day'],
    expectedHref: '#start-date-day'
  },
  {
    message: 'No date parts error',
    dateParts: [],
    expectedHref: '#start-date-undefined'
  }
]

const whichParent = [
  {
    whichParent: 'primary',
    expected: true,
    message: 'returns true for whichParent is primary'
  },
  {
    whichParent: 'secondary',
    expected: true,
    message: 'returns true for whichParent is secondary'
  },
  {
    whichParent: 'invalid',
    expected: false,
    message: 'returns false for whichParent is invalid'
  },
  {
    whichParent: '',
    expected: false,
    message: 'returns false for whichParent is an empty string'
  },
  {
    whichParent: null,
    expected: false,
    message: 'returns false for whichParent is null'
  }
]

const employmentStatus = [
  {
    employmentStatus: ['employee', 'worker', 'self-employed', 'unemployed'],
    expected: true,
    message: 'should returns true for valid employmentStatus'
  },
  {
    employmentStatus: ['invalid', '', null],
    expected: false,
    message: 'should return false for invalid employmentStatus'
  }
]

const workAndPay = [
  {
    primary: createParentData('employee', 'yes', 'yes', 'yes'),
    secondary: createParentData('employee', 'yes', 'yes', 'yes'),
    whichParent: 'secondary',
    parent: 'primary',
    expected: true,
    message: 'should return true when which-parent is "secondary" and parent is "primary"'
  },
  {
    primary: createParentData('employee', 'yes', 'yes', 'yes'),
    secondary: createParentData('employee', 'yes', 'yes', 'yes'),
    whichParent: 'primary',
    parent: 'secondary',
    expected: true,
    message: 'should return true when which-parent is "primary" and parent is "secondary"'
  },
  {
    primary: createParentData('self-employed', '', '', ''),
    parent: 'primary',
    expected: true,
    message: 'should return true when employmentStatus is "self-employed" and parent is "primary"'
  },
  {
    secondary: createParentData('self-employed', '', '', ''),
    parent: 'secondary',
    expected: true,
    message: 'should return true when employmentStatus is "self-employed" and parent is "secondary"'
  }
]

const sinonStubs = [
  {
    primary: createParentData('employee', 'yes', 'yes', 'yes'),
    function: 'employmentStatus',
    expected: true,
    message: 'should return true for employmentStatus'
  },
  {
    primary: createParentData('employee', 'yes', 'yes', 'yes'),
    function: 'workAndPay',
    expected: true,
    message: 'should return true for workAndPay'
  },
  {
    primary: createParentData('employee', 'yes', 'yes', 'yes'),
    function: 'otherParentWorkAndPay',
    expected: true,
    message: 'should return true for otherParentWorkAndPay'
  }
]

module.exports = {
  startDateCases,
  addStartDateError,
  whichParent,
  employmentStatus,
  workAndPay,
  sinonStubs
}

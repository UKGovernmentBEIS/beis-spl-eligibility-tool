const relevantWeek = [
  {
    isBirth: false,
    isAdoption: true,
    expected: '2019-09-29',
    message: 'returns the start of the match week for adopters'
  },
  {
    isBirth: true,
    isAdoption: false,
    expected: '2019-06-16',
    message: 'returns 15 weeks before the start of the birth week for birth parents'
  },
  {
    isBirth: false,
    isAdoption: true,
    data: {
      'start-date-day': '29',
      'start-date-month': '09',
      'start-date-year': '2019'
    },
    expected: '2019-09-29',
    message: 'always returns a sunday'
  }
]

const providedDateName = [
  { isBirth: true, isAdoption: false, isSurrogacy: false, isInPast: true, expected: 'birth' },
  { isBirth: true, isAdoption: false, isSurrogacy: false, isInPast: false, expected: 'due' },
  { isBirth: false, isAdoption: false, isSurrogacy: true, isInPast: true, expected: 'birth' },
  { isBirth: false, isAdoption: false, isSurrogacy: true, isInPast: false, expected: 'due' },
  { isBirth: false, isAdoption: true, isSurrogacy: false, isInPast: false, expected: 'match' }
]

const currentParentInitialPayName = [
  { isBirth: true, isAdoption: false, currentParent: 'primary', expected: 'maternity' },
  { isBirth: false, isAdoption: true, currentParent: 'primary', expected: 'adoption' },
  { isBirth: false, isAdoption: false, currentParent: 'secondary', expected: 'paternity' }
]

const isWorker = [
  {
    employmentStatus: 'worker',
    parent: 'primary',
    expected: true,
    message: 'returns true if the parent is a worker'
  },
  {
    employmentStatus: 'employee',
    parent: 'primary',
    expected: false,
    message: 'returns false if the parent is an employee'
  },
  {
    employmentStatus: 'unemployed',
    parent: 'primary',
    expected: false,
    message: 'returns false if the parent is unemployed'
  },
  {
    employmentStatus: 'self-employed',
    parent: 'primary',
    expected: false,
    message: 'returns false if the parent is self-employed'
  },
  {
    employmentStatus: 'worker',
    parent: 'secondary',
    expected: true,
    message: 'returns true if the parent is a worker'
  },
  {
    employmentStatus: 'employee',
    parent: 'secondary',
    expected: false,
    message: 'returns false if the parent is an employee'
  },
  {
    employmentStatus: 'unemployed',
    parent: 'secondary',
    expected: false,
    message: 'returns false if the parent is unemployed'
  },
  {
    employmentStatus: 'self-employed',
    parent: 'secondary',
    expected: false,
    message: 'returns false if the parent is self-employed'
  }
]

const eligibilityIcon = [
  {
    employmentStatus: 'employee',
    expected: '<span aria-hidden="true">✔</span>',
    policy: 'spl',
    message: 'returns "✔" if parent is eligible and not a worker'
  },
  {
    employmentStatus: 'self-employed',
    policy: 'spl',
    expected: '<span aria-hidden="true">✘</span>',
    message: 'returns "✘" if parent is not eligible'
  },
  {
    employmentStatus: '',
    policy: 'spl',
    expected: '<span aria-hidden="true"><strong>?</strong></span>',
    message: 'returns "?" if eligibility is unknown'
  },
  {
    employmentStatus: 'worker',
    policy: 'shpp',
    expected: '<span aria-hidden="true"><strong>?</strong></span>',
    message: 'returns "?" if parent is eligible and a worker'
  }
]

const hasCheckedAnyEligibility = [
  {
    primary: {
      'employment-status': 'employee',
      'pay-threshold': 'yes',
      'continuous-work': 'yes',
      'work-start': 'yes'
    },
    secondary: {
      'employment-status': 'employee',
      'pay-threshold': 'yes',
      'continuous-work': 'yes',
      'work-start': 'yes'
    },
    expected: true,
    parent: 'primary',
    message: 'returns true if both parents are eligible and parent is primary'
  },
  {
    primary: {
      'employment-status': 'employee',
      'pay-threshold': 'yes',
      'continuous-work': 'yes',
      'work-start': 'yes'
    },
    secondary: {
      'employment-status': 'employee',
      'pay-threshold': 'yes',
      'continuous-work': 'yes',
      'work-start': 'yes'
    },
    expected: true,
    parent: 'secondary',
    message: 'returns true if both parents are eligible and parent is secondary'
  },
  {
    primary: {
      'employment-status': undefined,
      'pay-threshold': 'yes',
      'continuous-work': 'yes',
      'work-start': 'yes'
    },
    expected: false,
    parent: 'primary',
    message: 'returns false if parent is primary and there is no employment status'
  },
  {
    primary: {
      'employment-status': 'employee',
      'pay-threshold': 'yes',
      'continuous-work': undefined,
      'work-start': 'yes'
    },
    expected: false,
    parent: 'primary',
    message: 'returns false if there is an undefined continuous work value'
  },
  {
    expected: false,
    parent: 'primary',
    message: 'returns false if there is no data'
  }
]

const coupleHasAnyIneligibility = [
  {
    data: {
      primary: { 'employment-status': 'self-employed' },
      secondary: { 'employment-status': 'unemployed' }
    },
    expected: true,
    message: 'returns true if one parent is ineligible'
  },
  {
    data: {
      primary: {
        'employment-status': 'employee',
        'pay-threshold': 'yes',
        'continuous-work': 'yes',
        'work-start': 'yes'
      },
      secondary: {
        'employment-status': 'employee',
        'pay-threshold': 'yes',
        'continuous-work': 'yes',
        'work-start': 'yes'
      }
    },
    expected: false,
    message: 'returns false if both parents are eligible'
  }
]

const hasStartDateError = [
  {
    errors: { 'start-date': { dateParts: ['day'] } },
    partOfDate: 'day',
    expected: true,
    message: 'returns true if there is an error with the day'
  },
  {
    errors: { 'start-date': { dateParts: ['month'] } },
    partOfDate: 'month',
    expected: true,
    message: 'returns true if there is an error with the month'
  },
  {
    errors: { 'start-date': { dateParts: ['year'] } },
    partOfDate: 'year',
    expected: true,
    message: 'returns true if there is an error with the year'
  }
]

module.exports = {
  relevantWeek,
  providedDateName,
  currentParentInitialPayName,
  isWorker,
  eligibilityIcon,
  hasCheckedAnyEligibility,
  coupleHasAnyIneligibility,
  hasStartDateError
}

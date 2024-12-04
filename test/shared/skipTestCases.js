const createParentData = require('../test_helpers/createParentData')

const nextParent = [
  {
    whichParent: 'both',
    parent: 'secondary',
    expected: true,
    message: 'should return true when which-parent is "both" and parent is "secondary"'
  },
  {
    whichParent: 'primary',
    parent: 'primary',
    expected: true,
    message: 'should return true when which-parent is "primary" and parent is "primary"'
  },
  {
    whichParent: 'both',
    parent: 'primary',
    expected: false,
    message: 'should return false when which-parent is "both" and parent is "primary"'
  },
  {
    whichParent: 'primary',
    parent: 'secondary',
    expected: true,
    message: 'should return true when which-parent is "primary" and parent is "secondary"'
  },
  {
    whichParent: 'secondary',
    parent: 'secondary',
    expected: true,
    message: 'should return true when which-parent is "secondary" and parent is "secondary"'
  }
]

const employmentStatus = [
  {
    whichParent: 'secondary',
    parent: 'primary',
    expected: true,
    message: 'should return true when which-parent is "secondary" and parent is "primary"'
  },
  {
    whichParent: 'primary',
    parent: 'secondary',
    expected: true,
    message: 'should return true when which-parent is "primary" and parent is "secondary"'
  },
  {
    whichParent: 'both',
    parent: 'primary',
    expected: false,
    message: 'should return false when which-parent is "both" and parent is "primary"'
  },
  {
    whichParent: 'both',
    parent: 'secondary',
    expected: false,
    message: 'should return false when which-parent is "both" and parent is "secondary"'
  }
]

const parentMeetsPayAndContinuousWorkThresholds = [
  {
    primary: createParentData('employee', 'yes', 'yes', 'yes'),
    parent: 'primary',
    expected: true,
    message: 'should return true when parent meets pay and continuous work thresholds'
  },
  {
    primary: createParentData('', 'yes', 'no', 'no'),
    parent: 'primary',
    expected: false,
    message: 'should return false when only pay threshold is met'
  },
  {
    primary: createParentData('', 'no', 'yes', 'yes'),
    parent: 'primary',
    expected: false,
    message: 'should return false when only continuous work threshold is met'
  },
  {
    primary: createParentData('', 'no', 'no', 'no'),
    parent: 'primary',
    expected: false,
    message: 'should return false when parent does not meet both pay and continuous work thresholds'
  },
  {
    secondary: createParentData('employee', 'yes', 'yes', 'yes'),
    parent: 'secondary',
    expected: true,
    message: 'should return true when parent meets pay and continuous work thresholds for secondary parent'
  },
  {
    secondary: createParentData('', 'no', 'yes', 'yes'),
    parent: 'secondary',
    expected: false,
    message: 'should return false when only pay threshold is met for secondary parent'
  },
  {
    secondary: createParentData('', 'yes', 'no', 'no'),
    parent: 'secondary',
    expected: false,
    message: 'should return false when only continuous work threshold is met for secondary parent'
  }
]

const otherParentWorkAndPay = [
  {
    whichParent: 'secondary',
    parent: 'primary',
    expected: true,
    message: 'should return true when which-parent is "secondary" and parent is "primary"'
  },
  {
    whichParent: 'primary',
    parent: 'secondary',
    expected: true,
    message: 'should return true when which-parent is "primary" and parent is "secondary"'
  },
  {
    whichParent: 'primary',
    parent: 'primary',
    expected: false,
    message: 'should return false when which-parent is "primary" and parent is "primary"'
  },
  {
    whichParent: 'secondary',
    parent: 'secondary',
    expected: false,
    message: 'should return false when which-parent is "secondary" and parent is "secondary"'
  },
  {
    secondary: createParentData('employee', 'yes', 'yes', 'yes'),
    whichParent: 'both',
    parent: 'primary',
    expected: true,
    message: 'should return true when which-parent is "both" and parent is "primary"'
  },
  {
    primary: createParentData('self-employed', '', '', ''),
    parent: 'primary',
    expected: true,
    message: 'should return true when parent is self-employed'
  },
  {
    primary: createParentData('unemployed', '', '', ''),
    parent: 'primary',
    expected: true,
    message: 'should return true when parent is unemployed'
  },
  {
    secondary: createParentData('worker', 'no', 'no', 'no'),
    parent: 'primary',
    expected: false,
    message: 'should return false when parent is a worker and does not meet pay and work thresholds'
  },
  {
    secondary: createParentData('worker', 'yes', 'yes', 'yes'),
    primary: createParentData('worker', 'yes', 'yes', 'yes'),
    parent: 'primary',
    expected: true,
    message: 'should return true when parent is a worker and does meet pay and work thresholds'
  },
  {
    primary: createParentData('employee', '', 'no', 'no'),
    parent: 'primary',
    expected: true,
    message: 'should return true when parent is an employee and does not meet continuous work thresholds'
  },
  {
    secondary: createParentData('employee', '', 'yes', 'yes'),
    parent: 'primary',
    expected: false,
    message: 'should return false when parent is an employee and does meet continuous work thresholds'
  },
  {
    data: {},
    parent: 'primary',
    expected: false,
    message: 'should return false when parent does not have data'
  },
  {
    data: { primary: {} },
    parent: 'secondary',
    expected: false,
    message: 'should return false when data for the other parent is missing'
  },
  {
    data: { secondary: {} },
    parent: 'primary',
    expected: false,
    message: 'should return false when data for the other parent is missing'
  },
  {
    secondary: createParentData('employee', 'no', '', ''),
    parent: 'primary',
    expected: false,
    message: 'should return false when other parent is an employee but does not meet pay thresholds'
  },
  {
    secondary: createParentData('employee', 'yes', '', ''),
    parent: 'primary',
    expected: true,
    message: 'should return true when other parent is an employee and does meet pay thresholds'
  },
  {
    primary: createParentData('employee', 'yes', 'yes', 'yes'),
    secondary: createParentData('employee', 'yes', 'yes', 'yes'),
    parent: 'primary',
    expected: true,
    message: 'should return true when both parents meet pay thresholds'
  },
  {
    primary: createParentData('employee', 'yes', '', ''),
    parent: 'secondary',
    expected: true,
    message: 'should return true when other parent is an employee and does meet pay thresholds'
  },
  {
    primary: createParentData('worker', 'no', '', ''),
    parent: 'secondary',
    expected: false,
    message: 'should return false when other parent is a worker but does not meet pay thresholds'
  },
  {
    secondary: createParentData('employee', 'no', '', ''),
    parent: 'primary',
    expected: false,
    message: 'should return false when other parent is an employee but does not meet pay thresholds'
  },
  {
    secondary: createParentData('worker', 'yes', '', ''),
    parent: 'primary',
    expected: true,
    message: 'should return true when other parent is a worker and does meet pay thresholds'
  }
]

const otherParent = [
  {
    secondary: createParentData('self-employed', 'no', '', ''),
    parent: 'primary',
    expected: false,
    message: 'should return false when otherParent is "secondary, "self-employed" and does not meet pay threshold'
  },
  {
    primary: createParentData('unemployed', 'no', '', ''),
    parent: 'secondary',
    expected: false,
    message: 'should return false when otherParent is "primary", "unemployed" and does not meet pay threshold'
  }
]

module.exports = {
  nextParent,
  employmentStatus,
  parentMeetsPayAndContinuousWorkThresholds,
  otherParentWorkAndPay,
  otherParent
}

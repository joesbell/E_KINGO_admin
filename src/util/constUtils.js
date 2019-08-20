class constUtils {
  static toArray (enumType) {
    let a = []
    for (let p in enumType) {
      if (enumType.hasOwnProperty(p)) {
        a.push(enumType[p])
      }
    }
    return a
  }

  static getItem (enumType, value) {
    for (let p in enumType) {
      if (enumType.hasOwnProperty(p) && value === enumType[p].value) {
        return enumType[p]
      }
    }
    return null
  }

  static getItems (enumType) {
    let items = []
    for (let p in enumType) {
      if (enumType.hasOwnProperty(p) && typeof enumType[p] !== 'function') {
        items.push(enumType[p])
      }
    }
    return items
  }

  static getItemName (enumType, value) {
    if (value === null) {
      return null
    }
    for (let p in enumType) {
      if (enumType.hasOwnProperty(p) && value === enumType[p].value) {
        return enumType[p].name
      }
    }
    return null
  }
}

/**
 * 性别
 */
export const SexEnum = {
  MAN: { value: '1', name: '男' },
  WOMAN: { value: '0', name: '女' }
}

/**
 * 分配状态
 */
export const AssignStatusEnum = {
  UN_ASSIGN: { value: '0', name: '未分配' },
  ASSIGNED: { value: '1', name: '已分配' }
}
/**
 * 分配类型
 */
export const AssignTypeEnum = {
  AUTO: { value: '0', name: '自动分配' },
  POOL: { value: '1', name: '任务池' },
  MANUAL: { value: '2', name: '人工分配' }
}
/**
 * 审核结果
 */
export const AuditResultEnum = {
  APPROVED: { value: 'APPROVED', name: '通过' },
  REFUSED: { value: 'REFUSED', name: '拒绝' },
  REJECTED: { value: 'REJECTED', name: '驳回' }
}
/**
 * 流程类型
 */
export const FlowTypeEnum = {
  CREDIT_APPLY: { value: 'CREDIT', name: '授信申请' },
  LEND_APPLY: { value: 'LEND', name: '提现申请' }
}
/**
 * 地址类型
 */
export const AddressTypeEnum = {
  HOME_ADDRESS: { value: 'HOME', name: '家庭地址' },
  WORK_ADDRESS: { value: 'WORK', name: '工作地址' },
  REGIST_ADDRESS: { value: 'REGIST', name: '户籍地址' }
}
/**
 * 学历类型
 */
export const eduTypeEnum = {
  MID_EDU: { value: 'MIDDLESCHOOL', name: '初中' },
  HIG_EDU: { value: 'HIGHSCHOOL', name: '高中' },
  JUN_EDU: { value: 'JUNIORCOLLEGE', name: '中专' },
  UND_EDU: { value: 'UNDERGRADUATE', name: '本科' },
  MAS_EDU: { value: 'MASTER', name: '硕士' },
  DOC_EDU: { value: 'DOCTOR', name: '博士及以上' },
  OTH_EDU: { value: 'OTHERS', name: '其他' }
}

/**
 *
 */
export const ISMAXTypeEnum = {
  IS: { value: 'Y', name: '是' },
  NOTIS: { value: 'N', name: '不是' }
}
/**
 *
 */
export const RelationTypeEnum = {
  URG_REL: { value: 'URG_REL', name: '紧急联系人' },
  OTHER: { value: 'OTHER', name: '其他联系人' }
}

// 对象类型
export const TargetTypeEnum = {
  APPLY: { value: 'APPLY', name: '申请人' },
  COLLEAGUE: { value: 'COLLEAGUE', name: '同事' },
  CLASSMATE: { value: 'CLASSMATE', name: '同学' },
  FRIEND: { value: 'FRIEND', name: '朋友' },
  KINSMAN: { value: 'KINSMAN', name: '亲戚' },
  PARENT: { value: 'PARENT', name: '父母' },
  SPOUSE: { value: 'SPOUSE', name: '配偶' },
  CHILDREN: { value: 'CHILDREN', name: '子女' }
}
// 问题类型
export const QuestionTypeEnum = {
  TEXT: { value: '0', name: '文本框' },
  SELECT: { value: '1', name: '选择列表' },
  CHECKBOX: { value: '2', name: '复选框' },
  RADIOBUTTON: { value: '3', name: '单选框' }
}

export default constUtils
export { constUtils }

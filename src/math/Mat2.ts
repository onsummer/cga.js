import { Mat3 } from "./Mat3"
import { Vec2 } from "./Vec2"


class Mat2 {
  v11 = 0
  v12 = 0
  v21 = 0
  v22 = 0

  /**
   * 二维矩阵，行主序
   * @param {number[]} values 行主序的矩阵元素
   * 
   * @example
   * const m = new Mat2(1.5, -4.2, 12.1, 9.5) // Mat2 { v11: 1.5, v12: -4.2, v21: 12.1, v22: 9.5 }
   * const zero = Mat2.ZERO // Mat2 { v11: 0.0, v12: 0.0, v21: 0.0, v22: 0.0 }
   * const identity = Mat2.IDENTITY // Mat2 { v11: 1.0, v12: 0.0, v21: 0.0, v22: 1.0 }
   * const m2 = new Mat2(-3, 1.2) // Mat2 { v11: -3.0, v12: 1.2, v21: 0.0, v22: 0.0 }
   * const m3 = new Mat2(1, 2, 3, 4, 5) // Mat2 { v11: 1.0, v12: 2.0, v21: 3.0, v22: 4.0 }
   */
  constructor(...values: number[]) {
    let invalidValues: number[] | undefined = []
    const length = values.length
    if (length > 4) {
      console.warn('Values length is over than 4, it will be cut off.')
      invalidValues = values.slice(0, 4)
    } else if (length < 4) {
      console.warn('Values length is less than 4, others will fill with ZERO.')
      invalidValues = [...values, ...(new Array<number>(4 - length).fill(0))]
    } else {
      invalidValues = values
    }

    [this.v11, this.v12, this.v21, this.v22] = invalidValues
  }
  
  /**
   * @description
   *   单位矩阵
   */
  static IDENTITY = new Mat2(1, 0, 0, 1)

  /**
   * @description
   *   零矩阵
   */
  static ZERO = new Mat2(0, 0, 0, 0)

  /**
   * 将矩阵按行展平为一维数组，等同于 Mat2.toFlatArray()
   * @param {Mat2} m 二维矩阵
   */
  static flat(m: Mat2): number[] {
    return Mat2.toFlatArray(m)
  }

  /**
   * 将矩阵按行展平为一维数组
   * @param {Mat2} m 二维矩阵
   */
  static toFlatArray(m: Mat2): number[] {
    return Mat2.toArray(m).flat()
  }

  /**
   * 将矩阵按行主序转为二维数组
   * @param {Mat2} m 二维矩阵
   */
  static toArray(m: Mat2): number[][] {
    return [
      [m.v11, m.v12],
      [m.v21, m.v22]
    ]
  }

  /**
   * 求行列式的值
   * @param {Mat2} m 二维矩阵
   */
  static determinant(m: Mat2): number {
    return m.v11 * m.v22 - m.v12 * m.v21
  }


  /**
   * 判断两个矩阵是否相等
   * @param {Mat2} a 二维矩阵
   * @param {Mat2} b 二维矩阵
   */
  static equalPerElement(a: Mat2, b: Mat2): boolean {
    /** TODO 考虑抽取数字判断逻辑，isNumberEqual(a, b) => (a - b) > Number.EPSILON or 0.1 ** 10 */
    const _isEqual = 
      a.v11 === b.v11 && 
      a.v12 === b.v12 && 
      a.v21 === b.v21 && 
      a.v22 === b.v22
    return _isEqual
  }

  /**
   * 将源矩阵复制到目标矩阵，深拷贝
   * @param {Mat2} sourceMatrix 源矩阵
   * @param {Mat2} [toMatrix] 可选 | 待存入的矩阵
   */
  static copyTo(sourceMatrix: Mat2, toMatrix: Mat2 = Mat2.ZERO) {
    toMatrix.v11 = sourceMatrix.v11
    toMatrix.v12 = sourceMatrix.v12
    toMatrix.v21 = sourceMatrix.v21
    toMatrix.v22 = sourceMatrix.v22
    return toMatrix
  }

  /**
   * 深拷贝一个矩阵
   * @param {Mat2} m 二维矩阵
   */
  static clone(m: Mat2) {
    return new Mat2(m.v11, m.v12, m.v21, m.v22)
  }

  /**
   * 从一维数组创建二维矩阵
   * @param {number[]} arr 数组
   */
  static fromArray(arr: number[]): Mat2 {
    return new Mat2(...arr)
  }

  /**
   * 从三维的左上角提取二维矩阵
   * @param {Mat3} m 三维矩阵
   */
  static fromMat3(m: Mat3): Mat2 {
    const [v11, v12, _, v21, v22, ] = m.toArray()
    return Mat2.fromArray([v11, v12, v21, v22])
  }

  /**
   * 矩阵乘法
   * @param {Mat2} left 左矩阵
   * @param {Mat2} right 右矩阵
   */
  static multiply(left: Mat2, right: Mat2): Mat2 {
    const [
      leftV11, leftV12, 
      leftV21, leftV22
    ] = Mat2.flat(left)
    const [
      rightV11, rightV12, 
      rightV21, rightV22
    ] = Mat2.flat(right)

    return new Mat2(
      leftV11 * rightV11 + leftV12 * rightV21, leftV11 * rightV12 + leftV12 * rightV22,
      leftV21 * rightV11 + leftV22 * rightV21, leftV21 * rightV12 + leftV22 * rightV22
    )
  }

  /**
   * 矩阵乘以常数
   * @param {Mat2} m 二维矩阵
   * @param {number} num 常数
   */
  static multiplyByScalar(m: Mat2, num: number): Mat2 {
    if (num === 0) {
      return Mat2.ZERO
    }
    const t = Mat2.clone(m)
    return Mat2.forEachRowOrder(t, (v: number, ): number => v *= num)
  }

  /**
   * 矩阵转置
   * @param {Mat2} m 二维矩阵
   */
  static inverse(m: Mat2) {
    const det = Mat2.determinant(m)
    if (det === 0) {
      throw new Error('Can not be inverse !')
    }

    return Mat2.multiplyByScalar(new Mat2(m.v22, -m.v12, -m.v21, m.v11), 1 / det)
  }

  /**
   * 矩阵左乘一个二维向量
   * @param {Mat2} m 二维矩阵
   * @param {Vec2} vec 二维向量
   */
  static multiplyVec2(m: Mat2, vec: Vec2): Vec2 {
    const x = m.v11 * vec.x + m.v12 * vec.y
    const y = m.v21 * vec.x + m.v22 * vec.y
    return new Vec2(x, y)
  }

  /**
   * 矩阵转置
   * @param {Mat2} m 二维矩阵
   */
  static transpose(m: Mat2) {
    return new Mat2(m.v11, m.v21, m.v12, m.v22)
  }

  /**
   * 判断一个对象是否满足 Mat2 类型
   * @experiment
   * @param {Mat2} m 二维矩阵
   */
  static isMat2(m: {}): boolean {
    const keys = Object.keys(m)
    return keys.includes('v11') && keys.includes('v12') && keys.includes('v21') && keys.includes('v22')
  }

  /**
   * 行主序遍历矩阵
   * @param m 二维矩阵
   * @param fn 函数，接受两个数字，前一个是矩阵的元素值，后一个是当前元素的索引号（行主序）
   */
  static forEachRowOrder(m: Mat2, fn: (v: number, index: number) => number): Mat2 {
    m.v11 = fn(m.v11, 0)
    m.v12 = fn(m.v12, 1)
    m.v21 = fn(m.v21, 2)
    m.v22 = fn(m.v22, 3)
    return m
  }

  /**
   * 列主序遍历矩阵
   * @param m 二维矩阵
   * @param fn 函数，接受两个数字，前一个是矩阵的元素值，后一个是当前元素的索引号（列主序）
   */
  static forEachColumnOrder(m: Mat2, fn: (v: number, index?: number) => number): Mat2 {
    m.v11 = fn(m.v11, 0)
    m.v21 = fn(m.v21, 1)
    m.v12 = fn(m.v12, 2)
    m.v22 = fn(m.v22, 3)
    return m
  }
}

export default Mat2
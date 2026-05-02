/** Mirrors the original HTML `calcNumbers` (Mifflin–St Jeor + deficit bands + carb cycling). */

export type NumbersSex = 'm' | 'f'
export type NumbersPhase = 'cut' | 'break' | 'maintain'

export interface NumbersInput {
  sex: NumbersSex
  age: number
  heightCm: number
  weightKg: number
  waistCm: number
  activity: number
  phase: NumbersPhase
}

export interface NumbersResult {
  tdee: number
  deficitLabel: string
  kcalLow: number
  kcalHigh: number
  proteinLow: number
  proteinHigh: number
  whtr: string
  waistTarget: number
  bmi: number
  bmiCat: string
  carbTrain: number
  carbRest: number
  fatGrams: number
}

export function calculateYourNumbers(input: NumbersInput): NumbersResult {
  const { sex, age, heightCm: ht, weightKg: wt, waistCm: waist, activity: act, phase } = input

  const bmr = sex === 'm' ? 10 * wt + 6.25 * ht - 5 * age + 5 : 10 * wt + 6.25 * ht - 5 * age - 161
  const tdee = Math.round(bmr * act)

  let deficitLow: number
  let deficitHigh: number
  let deficitLabel: string
  if (phase === 'cut') {
    deficitLow = 0.15
    deficitHigh = 0.25
    deficitLabel = '15–25% deficit'
  } else if (phase === 'break') {
    deficitLow = 0
    deficitHigh = 0
    deficitLabel = 'maintenance (diet break)'
  } else {
    deficitLow = 0
    deficitHigh = 0
    deficitLabel = 'maintenance'
  }

  const kcalHigh = Math.round(tdee * (1 - deficitLow))
  const kcalLow = Math.round(tdee * (1 - deficitHigh))

  const heightM = ht / 100
  const bmi = wt / (heightM * heightM)
  const targetWt = bmi > 25 ? Math.round(24 * heightM * heightM) : wt
  const proteinLow = Math.round(targetWt * 1.6)
  const proteinHigh = Math.round(targetWt * 2.2)

  const whtr = (waist / ht).toFixed(2)
  const waistTarget = Math.round(ht * 0.49)

  const kcalMid = Math.round((kcalLow + kcalHigh) / 2)
  const proteinMid = Math.round((proteinLow + proteinHigh) / 2)
  const proteinKcal = proteinMid * 4
  const remainingKcal = Math.max(0, kcalMid - proteinKcal)
  const carbTrain = Math.round((remainingKcal * 0.35) / 4)
  const carbRest = Math.round((remainingKcal * 0.15) / 4)
  const fatGrams = Math.round((remainingKcal - carbRest * 4) / 9)

  let bmiCat: string
  if (bmi < 18.5) bmiCat = 'Underweight'
  else if (bmi < 25) bmiCat = 'Normal'
  else if (bmi < 30) bmiCat = 'Overweight'
  else if (bmi < 35) bmiCat = 'Obesity class I'
  else if (bmi < 40) bmiCat = 'Obesity class II'
  else bmiCat = 'Obesity class III'

  return {
    tdee,
    deficitLabel,
    kcalLow,
    kcalHigh,
    proteinLow,
    proteinHigh,
    whtr,
    waistTarget,
    bmi,
    bmiCat,
    carbTrain,
    carbRest,
    fatGrams,
  }
}

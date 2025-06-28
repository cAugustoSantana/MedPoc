'use client'
import React from 'react'

type AgeDisplayProps = {
  dob: string | Date | null
  showDetail?: boolean
}


function calculateAge(dob: string | Date, detailed = false): string {
  const birth = new Date(dob)
  const today = new Date()

  let years = today.getFullYear() - birth.getFullYear()
  let months = today.getMonth() - birth.getMonth()
  let days = today.getDate() - birth.getDate()

  if (days < 0) {
    months--
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate()
  }

  if (months < 0) {
    years--
    months += 12
  }

  if (years === 0 && !detailed) return `${months} months`
  return detailed ? `${years}y ${months}m` : `${years} years`
}

export const AgeDisplay: React.FC<AgeDisplayProps> = ({ dob, showDetail = false }) => {
  return <span>{calculateAge(dob, showDetail)}</span>
}

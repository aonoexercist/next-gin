import React from 'react'
import styles from './dashboard.module.css'

type Props = {
  title: string
  value: string
  description?: string
}

export default function MainCard({ title, value, description }: Props) {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardValue}>{value}</p>
      {description && <p className={styles.cardDesc}>{description}</p>}
    </div>
  )
}

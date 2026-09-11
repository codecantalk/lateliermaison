import EstimateCalculator from '@/components/EstimateCalculator'
import styles from './page.module.css'

export const metadata = {
  title: 'Free Estimate | L\'Atelier Maison',
  description: 'Get an instant online quote for housekeeping and remodeling services in Atlanta.',
}

export default function EstimatePage() {
  return (
    <div className={styles.main}>
      <div className={`container ${styles.estimateContainer}`}>
        <EstimateCalculator />
      </div>
    </div>
  )
}

import styles from "./page.module.css";
import Digit from "./components/Containter/Digit";

export default function Home() {
  return (
    <div className={styles.page}>
      <Digit value={4} color="#ff0000" />
    </div>
  );
}

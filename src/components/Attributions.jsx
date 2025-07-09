import styles from "./Attributions.module.css";
export default function Attributions() {
  return (
    <div>
      <h3 className={styles.attributionsTitle}>Attributions</h3>
      <div className={styles.afterTitleBorder}></div>

      <section className={styles.attributionSection}>
        <ol>
          <Attribution
            mediaName='Clock Ticking (60 second countdown)'
            authorName='StudioKolomna'
            authorLink='https://pixabay.com/users/studiokolomna-2073170/'
            platformLink='https://pixabay.com/'
            platformName='Pixabay'
          />
          <Attribution
            mediaName='Super Mario 64 [ALARM CLOCK]'
            authorName='Lesiakower'
            authorLink='https://pixabay.com/users/lesiakower-25701529/'
            platformLink='https://pixabay.com/'
            platformName='Pixabay'
          />
          <Attribution
            mediaName='Dreamscape [ALARM CLOCK]'
            authorName='Lesiakower'
            authorLink='https://pixabay.com/users/lesiakower-25701529/'
            platformLink='https://pixabay.com/'
            platformName='Pixabay'
          />
          <Attribution
            mediaName='Alarm beep'
            authorName='Felfa (Freesound)'
            authorLink='https://pixabay.com/users/freesound_community-46691455/'
            platformLink='https://pixabay.com/'
            platformName='Pixabay'
          />
          <Attribution
            mediaName='Alarm'
            authorLink='https://icons8.com/icon/FhnRPWu7HD5f/alarm'
            platformLink='https://icons8.com'
            platformName='Icons8'
          />
        </ol>
      </section>
    </div>
  );
}

function Attribution({
  mediaName,
  authorName,
  authorLink,
  platformLink,
  platformName,
}) {
  if (authorName) {
    return (
      <li className={styles.attribution}>
        {mediaName} by{" "}
        <a className={styles.underline} href={authorLink}>
          {authorName}
        </a>{" "}
        on{" "}
        <a className={styles.underline} href={platformLink}>
          {platformName}
        </a>
      </li>
    );
  }

  if (!authorName) {
    return (
      <li className={styles.attribution}>
        <a className={styles.underline} href={authorLink}>
          {mediaName}
        </a>{" "}
        by{" "}
        <a className={styles.underline} href={platformLink}>
          {platformName}
        </a>
      </li>
    );
  }
}

import Image from "next/image";
import Link from "next/link";
import styles from "./card.module.css";
import cls from "classnames";

function Card(props) {
  return (
    <div>
      <Link href={props.href}>
        <a className={styles.cardLink}>
          <div className={cls('glass' , styles.container)}>
            <div className={styles.cardHeaderWrapper}>
              <h2 className = {styles.cardHeader}>{props.name}</h2>
            </div>
            <div className={styles.cardImageWrapper}>
              <Image
                className={styles.cardImage}
                src={props.imgURL}
                width={180}
                height={160}
                alt="Coffee shop image"
              ></Image>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}

export default Card;

import { getHeroBySlug } from "@/services/heroService";
import HeroDetail from "@/components/heroes/HeroDetail";
import HeroBuilds from "@/components/heroes/HeroBuilds";
import styles from "@/styles/HeroDetail.module.css";

export default async function HeroPage({ params }) {
    const { slug } = await params;
    const hero = await getHeroBySlug(slug);

    return (
        <>
            <HeroDetail hero={hero} />
            <div className={styles.detailPage}>
                <HeroBuilds slug={slug} />
            </div>
        </>
    );
}
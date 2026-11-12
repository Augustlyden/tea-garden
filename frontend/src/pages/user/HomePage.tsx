import { ArrowRight, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from '../../css/homePage.module.css'
import { Header } from '../../components/user/Header';
import { LoginErrorBanner } from '../../components/user/LoginErrorBanner';

export const HomePage = () => {
  const teaGuide = [
    {
      id: 'green',
      name: 'Grönt Te',
      desc: 'Bladen ångas eller rostas direkt efter skörd för att stoppa oxideringen. Detta bevarar den friska, gröna färgen och ger en gräsig, uppiggande smak rik på antioxidanter.',
      temp: '70-80°C',
      time: '2-3 min',
      imgUrl: '/images/green-tea.jpg',
      tip: 'Brygg inte med kokande vatten. För varmt vatten gör teet bittert.'
    },
    {
      id: 'black',
      name: 'Svart Te',
      desc: 'Ett helt oxiderat te som ger en djup, fyllig och ofta robust smak med toner av malt eller honung. Perfekt som morgonte och dricks ofta med en skvätt mjölk.',
      temp: '95-100°C',
      time: '3-5 min',
      imgUrl: '/images/black-tea.jpg',
      tip: 'Drar svart te för länge blir det lätt beskt.'
    },
    {
      id: 'herbal',
      name: 'Örtte',
      desc: 'Egentligen inte ett äkta te eftersom det inte kommer från tebusken Camellia sinensis. Istället består det av torkade blommor, rötter eller örter som kamomill och pepparmynta. Naturligt koffeinfritt!',
      temp: '100°C',
      time: '5-8 min',
      imgUrl: '/images/herbal-tea.jpg',
      tip: 'Brygg en kopp varmt kamomill- eller lavendelte ungefär 30 minuter innan du ska gå och lägga dig för en naturligt avslappnande kvällsrutin.'
    },
    {
      id: 'white',
      name: 'Vitt Te',
      desc: 'Det minst processade teet som görs på de allra tidigaste, duniga vårknopparna. Det oxideras inte alls utan torkas bara varsamt i solen. Smaken är extremt len, subtil och naturligt söt med blommiga undertoner.',
      temp: '60-70°C',
      time: '1-2 min',
      imgUrl: '/images/white-tea.jpg',
      tip: 'Rekommenderas att drickas precis som det är.'
    },
    {
      id: 'oolong',
      name: 'Oolong Te',
      desc: 'Ett traditionellt kinesiskt te som är delvis oxiderat, vilket lägger det mitt emellan grönt och svart te. Bladen rullas ofta till små kulor som vecklar ut sig vid bryggning. Smaken är komplex och kan skifta från krämig till blommig eller rostad.',
      temp: '80-90°C',
      time: '3-5 min',
      imgUrl: '/images/oolong-tea.jpg',
      tip: 'Högkvalitativa oolong-teer kan bryggas om flera gånger. Smaken utvecklas och förändras för varje ny bryggning.'
    },
    {
      id: 'rooibos',
      name: 'Rooibos (Rött Te)',
      desc: 'Kommer från en sydafrikansk buske med nålliknande blad. Bladen oxideras vilket ger den djupt rödbruna färgen. Det är helt koffeinfritt, har en naturligt söt och nötig smak och tål att dras länge utan att bli beskt.',
      temp: '100°C',
      time: '5-8 min',
      imgUrl: '/images/rooibos.jpg',
      tip: 'Rooibos är helt fritt från bittra tanniner. Det gör det till en perfekt bas för iste! Brygg starkt, söta med lite honung och låt svalna med citronskivor.'
    }

  ];

  return (
    <>
    <Header />
    <LoginErrorBanner />
    <main className={styles.homeContainer}>
      
      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <span className={styles.heroTag}><Leaf size={14} /> Välkommen till Tea Garden</span>
            <h1 className={styles.heroTitle}>Hitta ditt perfekta te</h1>
            <p className={styles.heroSubtitle}>
              Utforska vårt noggrant utvalda sortiment av ekologiska teer och handgjorda tillbehör.
            </p>
            <Link to="/shop/products" className={styles.heroBtn}>
              Till Butiken <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.guideSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Den Stora Teguiden</h2>
          <p className={styles.sectionSubtitle}>Lär dig grunderna om temperaturer, dragtider och tebladens magiska värld.</p>
        </div>

        <div className={styles.guideList}>
          {teaGuide.map((tea, idx) => (
            <article 
              key={tea.id} 
              className={styles.guideCard}
              style={{ '--card-index': idx } as React.CSSProperties} 
            >
              <div className={styles.cardImgContainer}>
                <img src={tea.imgUrl} alt={tea.name} className={styles.cardImg} />
              </div>
              
              <div className={styles.cardContent}>
                <h3 className={styles.teaName}>{tea.name}</h3>
                <p className={styles.teaDesc}>{tea.desc}</p>

                <div className={styles.tipBox}>
                  <p className={styles.tipText}>
                    <strong>Tips:</strong> {tea.tip}
                  </p>
                </div>
                
                <div className={styles.brewSpecs}>
                  <div className={styles.spec}>
                    <span className={styles.specLabel}>Vattentemp</span>
                    <span className={styles.specValue}>{tea.temp}</span>
                  </div>
                  <div className={styles.spec}>
                    <span className={styles.specLabel}>Bryggtid</span>
                    <span className={styles.specValue}>{tea.time}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      
    </main>
    </>
  );
};
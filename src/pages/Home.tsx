import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <HomeContent />
      </IonContent>
    </IonPage>
  );
};

const HomeContent = () => {
  return (<div>aaaa</div>)
};

export default Home;

import { X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import styles from '../../css/loginErrorBanner.module.css';

const ERROR_MESSAGE = new Map<string, string>([
  ['cancelled', 'Inloggningen avbröts. Du kan försöka igen när du vill.'],
  ['state', 'Inloggningen kunde inte säkerställas av särkerhetsskäl. Försök logga in igen.'],
  ['not-verified', 'Din Google e-postadress är inte verifierad, så vi kan inte logga in dig med den.'],
  ['google', 'Något gick fel vid inloggningen med Google. Försök igen om en stund.'],
  ['not-admin', 'Detta konto har inte administratör behörighet.'],
  ['github', 'Något gick fel vid inloggningen med GitHub. Försök igen om en stund.']
]);

export const LoginErrorBanner = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const code = searchParams.get('error');
  const message = code ? ERROR_MESSAGE.get(code) : undefined;

  if (!message) return null;

  const handleClose = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('error');
    setSearchParams(next, { replace: true });
  };

  return (
    <div className={styles.banner} role='alert'>
      <p className={styles.message}>{message}</p>
      <button type='button' className={styles.closeButton} onClick={handleClose} aria-label='Stäng'>
        <X size={16} />
      </button>
    </div>
  );
};
import Link from 'next/link';
import Head from 'next/head';
import ExtLink from 'components/ext-link';
import { useRouter } from 'next/router';
import styles from 'styles/header.module.css';

const navItems: { label: string; page?: string; link?: string }[] = [
  { label: 'Home', page: '/' },
];

const ogImageUrl = 'https://blog.fakhrusy.com/neuron.png';

const Header = ({ titlePre = '' }) => {
  const { pathname } = useRouter();

  return (
    <header className={styles.header}>
      <Head>
        <title>{titlePre ? `${titlePre} |` : ''} Fahru's Brain Dumps</title>
        <meta
          name="description"
          content="My brain dumps about anything that I found share-worthy"
        />
        <meta name="og:title" content="Brain dumps" />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:site" content="@f_fakhrusy" />
        <meta name="twitter:card" content="summary_large_image" />
        {/* <meta name="twitter:image" content={ogImageUrl} /> */}
      </Head>
      <ul>
        {navItems.map(({ label, page, link }) => (
          <li key={label}>
            {page ? (
              <Link href={page}>
                <a className={pathname === page ? 'active' : undefined}>
                  {label}
                </a>
              </Link>
            ) : (
              <ExtLink href={link}>{label}</ExtLink>
            )}
          </li>
        ))}
      </ul>
    </header>
  );
};

export default Header;

import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import HeroSection from '@site/src/components/Hero';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Kepler.gl is a data agnostic, WebGL empowered, high-performance web application for geospatial analytic visualizations."
    >
      <main>
        <HeroSection />
      </main>
    </Layout>
  );
}

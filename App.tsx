import React from 'react';
import { Layout } from './components/Layout';
import { ScrollPortfolio } from './pages/ScrollPortfolio';

const App: React.FC = () => {
  /*
   * The page is a single scroll experience, so restore deep links such as
   * /#projects after React has mounted the sections.
   */
  React.useEffect(() => {
    const id = window.location.hash.replace('#', '');
    if (!id) return;

    let frame = 0;
    frame = requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;

      const html = document.documentElement;
      const previousBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      target.scrollIntoView({ block: 'start' });
      html.style.scrollBehavior = previousBehavior;
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Layout>
      <ScrollPortfolio />
    </Layout>
  );
};

export default App;
